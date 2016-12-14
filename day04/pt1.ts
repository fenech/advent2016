import { input } from "./input";
import { isValid } from "./util";

const sum = input.split("\n").reduce((sum, line) => {
    const [letters, id, checksum] = line.match(/^([-a-z]+)(\d+)\[(\w+)]$/).slice(1);
    return isValid(letters, checksum) ? sum + +id : sum;
}, 0);

console.log(sum);
