import { input } from "./input";

const numberPad = [
    [null, null, 1, null, null],
    [null, 2, 3, 4, null],
    [5, 6, 7, 8, 9],
    [null, "A", "B", "C", null],
    [null, null, "D", null, null]
];

interface State {
    x: number;
    y: number;
}

const number = (state: State) => numberPad[state.y][state.x];

interface Move { (state: State): State }

const filterPermitted = (state: State, move: Move) => {
    const newState = move(state);
    const { x, y } = newState;
    if (0 <= x && x < 5
        && 0 <= y && y < 5
        && numberPad[y][x] !== null) return newState;

    return state;
};

const moves: { [direction: string]: Move } = {
    U: (state: State) => filterPermitted(state, ({ x, y }) => ({ x, y: y - 1 })),
    D: (state: State) => filterPermitted(state, ({ x, y }) => ({ x, y: y + 1 })),
    L: (state: State) => filterPermitted(state, ({ x, y }) => ({ x: x - 1, y })),
    R: (state: State) => filterPermitted(state, ({ x, y }) => ({ x: x + 1, y }))
};

type Direction = "U" | "D" | "L" | "R";
const move = ({ x, y }: State, direction: Direction) => {
    const move = moves[direction];
    return move(state);
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
