import { Md5 } from "ts-md5/dist/md5";

const id = "cxdnnyjw";

let i = 0;
let password = "";
do {
    let hash = Md5.hashStr(id + (i++)) as string;
    if (hash.slice(0, 5) === "00000") {
        password += hash.charAt(5);
    }
} while (password.length < 8);

console.log(password);
