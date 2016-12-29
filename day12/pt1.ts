import { input } from "./input";
import { State, process } from "./process";

const instructions = input.split("\n");

let state: State = {
    a: 0,
    b: 0,
    c: 0,
    d: 0,
    line: 0
};

console.log(process(state, instructions));
