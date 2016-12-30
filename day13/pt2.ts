import { favouriteNumber } from "./favouriteNumber";

enum Type {
    SPACE,
    WALL
}

interface Coords {
    x: number;
    y: number;
}

interface State {
    coords: Coords;
    steps: number;
}

let state = {
    coords: {
        x: 1,
        y: 1
    },
    steps: 0
};

const goal = {
    x: 1,
    y: 1
};

const getType = ({ x, y }: Coords): Type =>
    (((x * x + 3 * x + 2 * x * y + y + y * y) + favouriteNumber) >>> 0).toString(2).match(/1/g).length & 1;

const serialise = (state: Coords) => `x${state.x}y${state.y}`;

const guessDistance = (position: Coords, goal: Coords) =>
    Math.sqrt((goal.x - position.x) * (goal.x - position.x) + (goal.y - position.y) * (goal.y - position.y));

const isGoal = (position: Coords, goal: Coords) =>
    position.x === goal.x && position.y === goal.y;

function* getMoves({ x, y }: Coords) {
    if (x > 0) {
        let backwardX = {
            x: x - 1,
            y
        };
        if (getType(backwardX) === Type.SPACE) yield backwardX;
    }

    let forwardX = {
        x: x + 1,
        y
    };
    if (getType(forwardX) === Type.SPACE) yield forwardX;

    if (y > 0) {
        let backwardY = {
            x,
            y: y - 1
        };
        if (getType(backwardY) === Type.SPACE) yield backwardY;
    }

    let forwardY = {
        x,
        y: y + 1
    };
    if (getType(forwardY) === Type.SPACE) yield forwardY;
}

const aStar = (start: State, goal: Coords, limit: number) => {
    let closedSet = new Set<string>();
    let serialisedState = serialise(start.coords);
    let stateLookup = new Map([[serialisedState, start]]);

    let openSet = new Set([serialisedState]);
    let gScore = new Map([[serialisedState, 0]]);
    let fScore = new Map([[serialisedState, guessDistance(start.coords, goal)]]);

    while (openSet.size > 0) {
        let current = Array.from(openSet).sort((a, b) => fScore.get(a) - fScore.get(b))[0];
        let currentState = stateLookup.get(current);
        if (currentState.steps > limit || isGoal(currentState.coords, goal)) {
            return currentState.steps;
        }

        openSet.delete(current);
        closedSet.add(current);
        for (let move of getMoves(currentState.coords)) {
            let serialisedMove = serialise(move);
            if (serialisedMove in closedSet) {
                continue;
            }

            let tentativeGScore = currentState.steps + 1;
            if (!(serialisedMove in openSet)) {
                stateLookup.set(serialisedMove, { coords: move, steps: tentativeGScore });
                openSet.add(serialisedMove);
            } else if (tentativeGScore >= gScore.get(serialisedMove)) {
                continue;
            }

            gScore.set(serialisedMove, tentativeGScore);
            fScore.set(serialisedMove, gScore[serialisedMove] + guessDistance(move, goal))
        }
    }
};

let count = 0;
for (let x = 0; x <= 51; ++x) {
    for (let y = 0; x + y < 51; ++y) {
        let coords = { x, y };
        if (getType(coords) === Type.SPACE && aStar({ coords: { x, y }, steps: 0 }, goal, 50) <= 50) {
            ++count;
        }
    }
}

console.log(count);
