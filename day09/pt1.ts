import { input } from "./input";

let encoded = input.slice();
let decoded = "";
const re = /(\((\d+)x(\d+)\)).*/;
while (encoded.match(re)) {
    decoded += encoded.replace(re, (match, p1, p2, p3, offset) => {
        const group = p1;
        const length = +p2;
        const repeats = +p3;
        const decoded = encoded.slice(offset + group.length, offset + group.length + length).repeat(repeats);
        encoded = encoded.slice(offset + group.length + length);
        return decoded;
    });
}

decoded += encoded;
console.log(decoded.length);
