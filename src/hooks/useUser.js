import { query } from "../renix";
import state from "../state";

export default query(() => state.user);
