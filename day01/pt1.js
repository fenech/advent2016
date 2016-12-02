const fs = require("fs");

const rotations = {
    L: -1,
    R: 1
};

const movements = [
    (state, distance) => ({ x: state.x, y: state.y + distance }),
    (state, distance) => ({ x: state.x + distance, y: state.y }),
    (state, distance) => ({ x: state.x, y: state.y - distance }),
    (state, distance) => ({ x: state.x - distance, y: state.y })
];

const move = (state, rotation, distance) => {
    const orientation = (state.orientation + rotations[rotation] + 4) % 4;
    const position = movements[orientation](state, distance)
    return { orientation, x: position.x, y: position.y };
};

const initialState = {
    orientation: 0,
    x: 0,
    y: 0
};

const getBlocks = (state) => Math.abs(state.x) + Math.abs(state.y);

fs.readFile("input.txt", (err, data) => {
    const re = /(L|R)(\d+)/g;
    var state = initialState;
    var match;

    while ((match = re.exec(data)) !== null) {
        state = move(state, match[1], +match[2]);
    }

    console.log(getBlocks(state));
});
