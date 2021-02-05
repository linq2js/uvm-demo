import { action } from "../renix";
import state from "../state";
import NavigateAction from "./NavigateAction";

export default action((user) => {
  state.user = { ...user };
  NavigateAction("dashboard");
});
