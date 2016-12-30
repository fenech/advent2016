import { Md5 } from "ts-md5/dist/md5";
import { input } from "./input";

let keyCount = 0;
const re3 = /(.)\1\1/;
const lookahead = 1000;
let hashes = new Array<string>(lookahead);

for (let i = 0; i < lookahead; ++i) {
    hashes[i] = Md5.hashAsciiStr(input + i) as string;
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
    hashes.push(Md5.hashAsciiStr(input + index++) as string);
}

console.log(index - lookahead - 1);
