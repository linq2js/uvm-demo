import { action } from "../renix";
import NavigateAction from "./NavigateAction";

export default action((surveyId) => {
  NavigateAction("survey");
});
