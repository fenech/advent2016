import { input } from "./input";

let encoded = input.slice();
const re = /(\((\d+)x(\d+)\)).*/;
let decodedLength = 0;
while (encoded.match(re)) {
    encoded.replace(re, (match, p1, p2, p3, offset) => {
        const group = p1;
        const length = +p2;
        const repeats = +p3;
        decodedLength += offset;
        encoded = encoded.slice(offset + group.length, offset + group.length + length).repeat(repeats) + encoded.slice(offset + group.length + length);
        return "";
    });
}

decodedLength += encoded.length;

console.log(decodedLength);
