const width = 50;
const height = 6;

let initialState: string[][] = [];

for (let j = 0; j < height; ++j) {
    initialState.push([]);
    for (let i = 0; i < width; ++i) {
        initialState[j].push(".");
    }
}

const actions = [
    {
        pattern: /^rect (\d+)x(\d+)$/,
        action: (state: string[][], columns: number, rows: number) => {
            for (let j = 0; j < rows; ++j) {
                for (let i = 0; i < columns; ++i) {
                    state[j][i] = "#";
                }
            }

            return state;
        }
    },
    {
        pattern: /^rotate column x=(\d+) by (\d+)$/,
        action: (state: string[][], column: number, offset: number) => {
            const original: string[] = [];
            for (let j = 0; j < height; ++j) {
                original.push(state[j][column]);
            }
            for (let j = 0; j < height; ++j) {
                state[j][column] = original[(j - offset + height) % height]
            }

            return state;
        }
    },
    {
        pattern: /^rotate row y=(\d+) by (\d+)$/,
        action: (state: string[][], row: number, offset: number) => {
            const original: string[] = [];
            for (let i = 0; i < width; ++i) {
                original.push(state[row][i]);
            }
            for (let i = 0; i < width; ++i) {
                state[row][i] = original[(i - offset + width) % width]
            }

            return state;
        }
    }
];

export const process = (input: string) =>
    input.split("\n").reduce((state, line) => {
        for (let i = 0; i < actions.length; ++i) {
            let match = line.match(actions[i].pattern);
            if (match) {
                return actions[i].action(state, +match[1], +match[2]);
            }
        }
    }, initialState);
