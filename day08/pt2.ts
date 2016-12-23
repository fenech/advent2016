import { input } from "./input";
import { process } from "./process";

const state = process(input);

for (let j = 0; j < state.length; j += 6) {
    for (let i = 0; i < state[j].length; i += 5) {
        console.log(state.slice(j, j + 6).map(s => s.slice(i, i + 5).join("")).join("\n") + "\n");
    }
}
