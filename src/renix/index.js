import { useEffect, useRef, useState } from "react";

let emptyObject = {};
let globalEmitter = createEmitter();
let isArray = Array.isArray;
let assign = Object.assign;
let getEntries = Object.entries;
let typeProp = "$$type";
let loadingStatus = 1;
let loadedStatus = 2;
let failedStatus = 3;
let taskType = 4;
let dispatcherType = 5;
let noop = () => {};

export let action = createAction;
export let query = createQuery;
export let unsafe_cleanup = cleanup;
export let subscribe = globalEmitter.on;

export function delay(ms, value) {
  let timer;
  return createTask(
    new Promise((resolve) => (timer = setTimeout(resolve, ms, value))),
    null,
    () => clearTimeout(timer)
  );
}

function createActionContext() {
  let shouldUpdate = true;
  return {
    get shouldUpdate() {
      return shouldUpdate;
    },
    set shouldUpdate(value) {
      shouldUpdate = value;
    },
    preventUpdate() {
      shouldUpdate = false;
    },
  };
}

function createMemo(key, fn) {
  let memoized;
  let lastResult = noop;
  if (typeof key === "function") {
    memoized = function () {
      let k = key(...arguments);
      if (lastResult === noop || !isEqual(lastResult, k)) {
        lastResult = fn(k);
      }
      return lastResult;
    };
  } else {
    let lastArgs;
    memoized = (...args) => {
      if (
        !lastArgs ||
        lastArgs.length !== args.length ||
        lastArgs.some((value, index) => value !== args[index])
      ) {
        lastArgs = args;
        lastResult = fn(...args);
      }
      return lastResult;
    };
  }

  return memoized;
}

export function watch(selector, callback) {
  let current = selector();
  callback(current, true);
  return globalEmitter.on(() => {
    const next = selector();
    if (isEqual(next, current)) return;
    current = next;
    callback(current, false);
  });
}

function createQuery() {
  let selector = arguments.length > 1 ? createMemo(...arguments) : arguments[0];

  return function useSelector() {
    let [, forceRerender] = useState({});
    let data = useRef({}).current;
    data.args = [...arguments];
    // data.unmounted = false;
    useEffect(() => {
      function handleChange() {
        // if (data.unmounted) return;
        data.error = null;
        data.async = null;
        try {
          let value = selector(...data.args);
          // nothing change, skip re-rendering
          if (isEqual(value, data.value)) return;
        } catch (e) {
          data.error = e;
        }
        forceRerender({});
      }
      return globalEmitter.on(handleChange);
    }, [data]);
    // useEffect(() => () => (data.unmounted = true), [data]);
    if (data.error) throw data.error;
    if (data.async) {
      let async = data.async;
      if (
        async.args.length !== data.args.length ||
        async.args.some((value, index) => data.args[index] !== value)
      ) {
        data.async = null;
      } else {
        switch (async.status) {
          case failedStatus:
            throw async.value;
          case loadedStatus:
            return async.value;
          default:
            throw data.value;
        }
      }
    }

    data.value = selector(...data.args);
    if (isPromiseLike(data.value)) {
      let async = (data.async = { status: loadingStatus, args: data.args });
      function onDone(status, value) {
        if (async !== data.async) return;
        async.value = value;
        async.status = status;
        forceRerender({});
      }
      data.value.then(
        onDone.bind(null, loadedStatus),
        onDone.bind(null, failedStatus)
      );
      throw data.value;
    }

    return data.value;
  };
}

function handleIterator(iterator) {
  let unsubscribe;
  let cancels;
  let context = createActionContext();
  let task = createTask(null, null, () => {
    unsubscribe && unsubscribe();
    cancels && cancels.forEach((f) => f());
  });

  function next(payload) {
    context.shouldUpdate = true;
    try {
      unsubscribe = null;
      cancels = [];
      let { done, value } = iterator.next(payload);
      if (done) return task.resolve(value);

      let waitAll = true;
      let entries;
      let isMultiple = true;

      if (isArray(value)) {
        entries = getEntries(value);
      } else if (!value || isPromiseLike(value) || typeof value !== "object") {
        entries = [[0, value]];
        isMultiple = false;
      } else {
        waitAll = false;
        entries = getEntries(value);
        isMultiple = false;
      }

      let results = waitAll ? [] : {};
      let onSuccess = [];
      let onFail = [];
      let doneCount = 0;

      function dispose() {
        onSuccess.forEach((f) => f());
        onFail.forEach((f) => f());
      }

      function onDone(isSuccess, key, value) {
        if (!isSuccess) {
          dispose();
          task.reject(value);
          return;
        }
        results[key] = value;
        doneCount++;
        if (waitAll) {
          if (doneCount >= entries.length) {
            dispose();
            next(isMultiple ? results : value);
          }
        } else {
          cancels.forEach((f) => f());
          next(results);
        }
      }

      entries.forEach(([key, item]) => {
        if (isPromiseLike(item)) item = createTask(item);
        if (item) {
          if (typeof item.success === "function") {
            onSuccess.push(item.success((result) => onDone(true, key, result)));
          }
          if (typeof item.fail === "function") {
            onFail.push(item.fail((reason) => onDone(false, key, reason)));
          }
          if (typeof item.cancel === "function") {
            cancels.push(item.cancel);
          }
        } else {
          onDone(true, key, item);
        }
      });
    } catch (e) {
      task.reject(e);
    } finally {
      context.shouldUpdate && globalEmitter.emit();
    }
  }

  next();

  return task;
}

function createAction(action, options = emptyObject) {
  let { debounce, throttle } = options;
  let emitter = createEmitter();
  let context = createActionContext();
  let wrapper = function (payload) {
    emitter.emit(payload);
    try {
      let result = action(payload, context);
      if (isPromiseLike(result))
        return (
          result
            // update after promise done
            .finally(globalEmitter.emit)
        );
      if (isIteratorLike(result)) return handleIterator(result);
      return result;
    } finally {
      context.shouldUpdate && globalEmitter.emit();
    }
  };
  let original = wrapper;
  let t;
  if (debounce !== void 0) {
    wrapper = function () {
      clearTimeout(t);
      setTimeout(original, debounce, ...arguments);
    };
  } else if (throttle !== void 0) {
    wrapper = function () {
      let now = Date.now();
      if (!t || now >= t + throttle) {
        t = now;
        original(...arguments);
      }
    };
  }

  return assign(wrapper, {
    [typeProp]: dispatcherType,
    subscribe: emitter.on,
  });
}

function isPromiseLike(value) {
  return value && typeof value.then === "function";
}

function isIteratorLike(value) {
  return value && typeof value.next === "function";
}

function objectEqual(a, b) {
  if (a === b) return true;
  for (let ka in a) {
    if (a[ka] !== b[ka]) return false;
  }
  for (let kb in b) {
    if (a[kb] !== b[kb]) return false;
  }
  return true;
}

function isEqual(a, b) {
  if (a === b) {
    return true;
  }

  if (
    typeof a !== "object" ||
    typeof b !== "object" ||
    isPromiseLike(a) ||
    isPromiseLike(b) ||
    isArray(a) ||
    isArray(b)
  )
    return false;
  if (a === null && b) return false;
  if (b === null && a) return false;

  return objectEqual(a, b);
}

function createEmitter() {
  let listeners = [];
  let emitting = 0;
  let removed = 0;
  let cleanup = false;

  function on(listener) {
    let active = true;
    let wrapper = (payload) => active && listener(payload);
    listeners.push(wrapper);
    return () => {
      if (!active) return;
      active = false;
      let index = listeners.indexOf(wrapper);
      if (emitting) {
        removed++;
        wrapper.removed = true;
      } else {
        listeners.splice(index, 1);
      }
    };
  }

  function length() {
    return listeners.length;
  }

  function emit(payload) {
    try {
      emitting++;
      removed = 0;
      listeners.forEach((listener) => {
        listener(payload);
      });
      // for (let i = 0; i < copy.length; i++) copy[i](payload);
    } finally {
      emitting--;
      if (!emitting) {
        if (removed) {
          let temp = [];
          listeners.forEach((listener) => {
            if (!listener.removed) return;
            removed--;
            temp[temp.length] = listener;
            if (!removed) return true;
          });
          listeners = temp;
        }
        removed = null;
        cleanup && clear();
      }
    }
  }

  function clear() {
    if (!listeners.length) return;
    if (emitting) {
      cleanup = true;
    } else {
      listeners = [];
    }
  }

  return { on, length, emit, clear };
}

function cleanup() {
  globalEmitter.clear();
}

function createTask(promise, onDone, onCancel) {
  if (promise && promise[typeProp] === taskType) return promise;
  let cancelled = false;
  let onSuccess;
  let onFail;
  let onResolve = noop;
  let onReject = noop;

  function resolve(result) {
    if (cancelled) return;
    onSuccess && onSuccess.emit(result);
    onResolve(result);
    onDone && onDone();
  }

  function reject(reason) {
    if (cancelled) return;
    onFail && onFail.emit(reason);
    onReject(reason);
    onDone && onDone();
  }

  let result;

  result = new Promise(function () {
    [onResolve, onReject] = arguments;
  });

  if (promise) {
    promise.then(resolve, reject);
  }

  return assign(result, {
    [typeProp]: taskType,
    resolve: promise ? noop : resolve,
    reject: promise ? noop : reject,
    success(listener) {
      if (!onSuccess) onSuccess = createEmitter();
      return onSuccess.on(listener);
    },
    fail(listener) {
      if (!onFail) onFail = createEmitter();
      return onFail.on(listener);
    },
    cancel() {
      if (cancelled) return;
      cancelled = true;
      onSuccess && onSuccess.clear();
      onCancel && onCancel();
    },
  });
}
