import { input } from "./input";

const ssl = input.split("\n").reduce((count, line) => {
    const supernet = line.replace(/\[[^\]]*]/g, "");
    const hypernet = line.replace(/(^|])[^\]]*(\[|$)/g, "");
    if (`${supernet}%${hypernet}`.match(/(.)(?!\1)(.)\1.*%.*\2\1\2/)) {
        return count + 1;
    }
    return count;
}, 0);

console.log(ssl);
