import { input } from "./input";
import { process } from "./process";

const state = process(input);

const lit = state.reduce((count, row) =>
    count + row.reduce((count, col) =>
        col === "#" ? count + 1 : count, 0), 0);

console.log(lit);
