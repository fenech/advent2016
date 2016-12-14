import { input } from "./input";
import { isValid } from "./util";

const shiftArray = "abcdefghijklmnopqrstuvwxyz";

input.split("\n").forEach(line => {
    const [letters, id, checksum] = line.match(/^([-a-z]+)(\d+)\[(\w+)]$/).slice(1);
    if (isValid(letters, checksum)) {
        const shifted = letters.split("").map(char =>
            shiftArray[(shiftArray.indexOf(char) + +id) % shiftArray.length]).join("");
        if (shifted.match(/pole/)) {
            console.log(shifted, id);
        }
    }
});
