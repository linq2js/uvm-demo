import { action } from "../renix";
import state from "../state";

export default action((page) => (state.page = page));
