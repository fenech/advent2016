import { Md5 } from "ts-md5/dist/md5";
import { input } from "./input";

let keyCount = 0;
const re3 = /(.)\1\1/;
const lookahead = 1000;
let hashes = new Array<string>(lookahead);

const keyStretch = (input: string): string => {
    let i = 2016;
    while (i-- >= 0) {
        input = Md5.hashAsciiStr(input) as string;
    }
    return input;
}

for (let i = 0; i < lookahead; ++i) {
    hashes[i] = keyStretch(input + i);
}

let index = lookahead;
while (keyCount < 64) {
    let hash = hashes.shift();
    let match = hash.match(re3);
    if (match) {
        let char = match[1];
        let re5 = new RegExp(char.repeat(5));
        if (hashes.some(hash => re5.test(hash))) {
            ++keyCount;
        }
    }
    hashes.push(keyStretch(input + index++));
}

console.log(index - lookahead - 1);
