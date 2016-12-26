import { input } from "./input";

let robots: { [bot: number]: number[] } = {};

const assignRe = /value (\d+) goes to bot (\d+)/;
input.split("\n").filter(line => assignRe.test(line)).forEach(line => {
    const match = line.match(assignRe);
    const [value, bot] = match.slice(1);
    robots[bot] = bot in robots ? [...robots[bot], +value] : [+value];
});

let outputs: { [index: number]: number } = {};

const distributeRe = /bot (\d+) gives low to (bot|output) (\d+) and high to (bot|output) (\d+)/;
const distributeLines = input.split("\n").filter(line => !assignRe.test(line));

let instructions = distributeLines.map(line => {
    const match = line.match(distributeRe);
    return {
        source: match[1],
        line: match[0]
    };
});

const parse = (instruction: string) => {
    const match = instruction.match(distributeRe);
    const [srcNumber, lowDestType, lowDestNumber, highDestType, highDestNumber] = match.slice(1);
    return { srcNumber, lowDestType, lowDestNumber, highDestType, highDestNumber };
};

const distribute = (instruction: string) => {
    const { srcNumber, lowDestType, lowDestNumber, highDestType, highDestNumber } = parse(instruction);

    const [low, high] = robots[srcNumber].sort((a, b) => a - b);

    if (low === 17 && high === 61) {
        return srcNumber;
    }

    if (lowDestType === "bot") {
        robots[lowDestNumber] = lowDestNumber in robots ? [...robots[lowDestNumber], low] : [low];
    } else {
        outputs[lowDestNumber] = low;
    }

    if (highDestType === "bot") {
        robots[highDestNumber] = highDestNumber in robots ? [...robots[highDestNumber], high] : [high];
    } else {
        outputs[highDestNumber] = high;
    }

    return distribute(getNextStep(instructions));
};

const getNextStep = (instructions: { source: string, line: string }[]) => {
     const nextStepIndex = instructions.findIndex(({ source, line }) => {
        return source in robots && robots[source].length === 2;
    });

    const { line } = instructions[nextStepIndex];
    instructions.splice(nextStepIndex, 1);
    return line;
};

console.log(distribute(getNextStep(instructions)));
