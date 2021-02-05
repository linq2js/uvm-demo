import faker from "faker";
import { subscribe } from "./renix";
import users from "./users";

const { page, user } = JSON.parse(localStorage.getItem("appData")) || {};

const state = {
  page,
  user: { ...users[user] },
  students: new Array(100).fill(0).map((_, index) => {
    const name = faker.name.findName();
    const klass = Math.ceil(Math.random() * 12);
    return {
      id: index,
      uniId: name.replace(/\s+/g, "").toLowerCase(),
      name,
      klass,
      email: faker.internet.email(),
      unsubscribed: faker.random.boolean(),
    };
  }),
  surveys: new Array(20).fill(0).map((_, index) => {
    const start = faker.date.past();
    return {
      id: index,
      start,
      end: new Date(
        start.getTime() + Math.ceil(Math.random() * 7 * 24 * 60 * 60 * 1000)
      ),
      finished: faker.random.boolean(),
      responses: (Math.random() * 100).toFixed(2) + "%",
    };
  }),
};

if (!state.user.role) {
  state.page = "login";
  state.user = users.anonymous;
}

subscribe(() => {
  localStorage.setItem(
    "appData",
    JSON.stringify({
      page: state.page,
      user: state.user ? state.user.key : "",
    })
  );
});

export default state;
