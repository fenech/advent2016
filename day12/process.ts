export interface State {
    a: number;
    b: number;
    c: number;
    d: number;
    line: number;
}

const applyAndMove = (state: State, object: Partial<State>): State =>
    Object.assign({}, state, object, { line: state.line + 1 });

const actions = [
    {
        re: /cpy (\w+) (-?\w+)/,
        action: (state: State, match: RegExpMatchArray) => {
            const [src, dest] = match.slice(1);
            return applyAndMove(state, { [dest]: src.match(/[a-d]/) ? state[src] : +src });
        }
    },
    {
        re: /inc (\w+)/,
        action: (state: State, match: RegExpMatchArray) => {
            const register = match[1];
            return applyAndMove(state, { [register]: state[register] + 1 });
        }
    },
    {
        re: /dec (\w+)/,
        action: (state: State, match: RegExpMatchArray) => {
            const register = match[1];
            return applyAndMove(state, { [register]: state[register] - 1 });
        }
    },
    {
        re: /jnz (\w+) (-?\w+)/,
        action: (state: State, match: RegExpMatchArray) => {
            const [check, offset] = match.slice(1);
            if (/[a-d]/.test(check) && state[check] !== 0 || !isNaN(+check) && +check !== 0) {
                return Object.assign({}, state, { line: state.line + +offset });
            }
            return applyAndMove(state, {});
        }
    }
];

export const process = (state: State, instructions: string[]) => {
    while (state.line < instructions.length) {
        let instruction = instructions[state.line];
        const { action, re } = actions.find(({ re }) => re.test(instruction));
        const args = instruction.match(re);
        state = action(state, args);
    }

    return state.a;
}
