import faker from "faker";
import { LEADER, STUDENT, TEACHER } from "./roles";

export default {
  anonymous: {},
  teacher: {
    key: "teacher",
    email: "teacher@demo.com",
    name: faker.name.findName(),
    role: TEACHER,
  },
  leader: {
    key: "leader",
    email: "leader@demo.com",
    name: faker.name.findName(),
    role: LEADER,
  },
  student: {
    key: "student",
    email: "student@demo.com",
    name: faker.name.findName(),
    role: STUDENT,
  },
};
