import { input } from "./input";

const tls = input.split("\n").reduce((count, line) => {
    if (!line.match(/\[[^\]]*([a-z])(?!\1)([a-z])\2\1.*]/)
        && line.match(/([a-z])(?!\1)([a-z])\2\1/)) {
        return count + 1;
    }
    return count;
}, 0);

console.log(tls);
