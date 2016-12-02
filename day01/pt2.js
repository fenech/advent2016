const fs = require("fs");

const rotations = {
    L: -1,
    R: 1
};

const steps = [
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
    { x: -1, y: 0 }
];

const rotate = (state, rotation) => ({
    orientation: (state.orientation + rotations[rotation] + 4) % 4,
    x: state.x,
    y: state.y
});

const move = (state) => {
    const step = steps[state.orientation];
    return {
        orientation: state.orientation,
        x: state.x + step.x,
        y: state.y + step.y
    };
};

const initialState = {
    orientation: 0,
    x: 0,
    y: 0
};

const getBlocks = (state) => Math.abs(state.x) + Math.abs(state.y);

fs.readFile("input.txt", (err, data) => {
    var state = initialState;
    var visited = [];

    const re = /(L|R)(\d+)/g;
    var match;
    while ((match = re.exec(data)) !== null) {
        state = rotate(state, match[1]);
        for (var i = 0; i < +match[2]; ++i) {
            state = move(state);
            var position = { x: state.x, y: state.y };
            if (visited.some(v => v.x === position.x && v.y === position.y)) {
                console.log(getBlocks(position));
                return;
            }

            visited.push(position);
        }
    }
});
