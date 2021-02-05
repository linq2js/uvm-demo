export type Unsubscribe = () => void;
export type Subscribe = (listener: Function) => Unsubscribe;

export interface Action<TPayload, TReturn> extends Function {
  (payload?: TPayload): TReturn;
  subscribe: Subscribe;
}

export interface ActionOptions {
  debounce?: number;
  throttle?: number;
}

export interface QueryOptions<T> {
  memo: T;
}

export interface QueryExports {
  <TSelector extends (...args: any[]) => any>(selector: TSelector): TSelector;
  <TKey extends (...args: any[]) => any, TResult>(
    key: TKey,
    selector: (key: ReturnType<TKey>) => TResult
  ): (...args: Parameters<TKey>) => TResult;
}

export function action<TPayload = any, TReturn = void>(
  action: (payload?: TPayload) => TReturn,
  options?: ActionOptions
): Action<TPayload, TReturn>;

export function watch<T>(
  selector: () => T,
  callback: (value: T) => void
): Unsubscribe;

export const query: QueryExports;

export function delay<T>(ms: number, value?: T): Promise<T>;

export function unsafe_cleanup(): void;

export let subscribe: Subscribe;
