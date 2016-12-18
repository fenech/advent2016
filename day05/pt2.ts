import { Md5 } from "ts-md5/dist/md5";

const id = "cxdnnyjw";

const length = 8;
const placeholder = "*";
let password = Array<string>(length);
for (let i = 0; i < length; ++i) {
    password[i] = placeholder;
}

let i = 0;
const re = /^00000([0-7])(.)/;
do {
    let hash = Md5.hashStr(id + (i++)) as string;
    let match = hash.match(re);
    if (match) {
        let position = +match[1];
        let char = match[2];
        if (password[position] === placeholder) {
            password[position] = char;
            console.log(password.join(""));
        }
    }
} while (password.some(char => char === "*"));
