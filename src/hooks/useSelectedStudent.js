import { query } from "../renix";
import state from "../state";

export default query(() => state.students[0]);
