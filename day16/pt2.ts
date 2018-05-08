import { input } from "./input";

function flipReverse(input: string[]) {
    return input.map(s => s === "0" ? "1" : "0").reverse();
}

function* paddingGen() {
    let padding = ["0"];
    let index = 0;
    while (true) {
        if (index >= padding.length) {
            padding = padding.concat("0", flipReverse(padding))
        }

        yield padding[index++];
    }
}

function* dragonHash(input: string, requiredLength: number) {
    const patternA = input;
    const patternB = flipReverse(input.split("")).join("");
    const padding = paddingGen();

    while (true) {
        for (let pattern of [patternA, patternB]) {
            for (let char of pattern) {
                if (++length > requiredLength) return;
                yield char;
            }

            if (++length > requiredLength) return;
            yield padding.next().value;
        }
    }
}

function* checksum(hash: Iterable<string>) {
    var buffer: string[] = [];
    for (let char of hash) {
        if (buffer.push(char) === 2) {
            yield buffer.every(x => x === buffer[0]) ? "1" : "0";
            buffer = [];
        }
    }
}

const requiredLength = 35651584;

let check: Iterable<string> = Array.from(dragonHash(input, requiredLength));

for (let i = requiredLength; i % 2 == 0; i /= 2) {
    check = Array.from(checksum(check));
}

console.log(Array.from(check).join(""));
