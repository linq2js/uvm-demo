import { action } from "../renix";
import state from "../state";
import users from "../users";
import NavigateAction from "./NavigateAction";

export default action(() => {
  state.user = users.anonymous;
  NavigateAction("login");
});
