import { action } from "../renix";
import state from "../state";

export default action((studentId) => {
  state.students = state.students.map((student) => {
    if (student.id === studentId) {
      return {
        ...student,
        unsubscribed: !student.unsubscribed,
      };
    }
    return student;
  });
});
