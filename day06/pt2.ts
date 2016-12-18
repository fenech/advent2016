import { input } from "./input";

let allCounts: { [char: string]: number }[];
input.split("\n").forEach((line, index) => {
    const chars = line.split("");
    if (index === 0) {
        allCounts = chars.map(() => ({}));
    }
    line.split("").forEach((char, index) => {
        const counts = allCounts[index];
        if (char in counts) {
            ++counts[char]
        } else {
            counts[char] = 1;
        }
    });
});

const message = allCounts.reduce((letters, counts) => {
    const letter = Object.keys(counts).reduce((prev, curr) => {
        const count = counts[curr];
        if (count < prev.count) {
            return {
                letter: curr,
                count
            };
        }
        return prev;
    }, { letter: <string>null, count: Infinity });

    return [
        ...letters,
        letter.letter
    ];
}, []).join("");

console.log(message);
