import { input } from "./input";

const numberPad = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

interface State {
    x: number;
    y: number;
}

const number = (state: State) => numberPad[state.y][state.x];

interface Movement { (x: number): number };

const moves: { [direction: string]: { y: Movement, x: Movement } } = {
    U: {
        y: (y: number) => Math.max(0, y - 1),
        x: (x: number) => x
    },
    D: {
        y: (y: number) => Math.min(2, y + 1),
        x: (x: number) => x
    },
    L: {
        y: (y: number) => y,
        x: (x: number) => Math.max(0, x - 1)
    },
    R: {
        y: (y: number) => y,
        x: (x: number) => Math.min(2, x + 1)
    }
}

type Direction = "U" | "D" | "L" | "R";
const move = ({ x, y }: State, direction: Direction) => {
    const move = moves[direction];
    return {
        x: move.x(x),
        y: move.y(y)
    };
};


const initialState: State = {
    x: 1,
    y: 1
};

var state = initialState;
input.split(/\n/).forEach(line => {
    for (let i = 0; i < line.length; ++i) {
        const direction = line.charAt(i) as Direction;
        state = move(state, direction);
    }
    console.log(numberPad[state.y][state.x]);
});
