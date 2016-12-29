import { input } from "./input";

interface Floor {
    elevator: boolean;
    microchips: string[];
    generators: string[];
}

interface State {
    step: number;
    floors: Floor[];
}

const serialiseFloor = ({ elevator, microchips, generators }: Floor) => {
    const pairs = microchips.filter(m => generators.indexOf(m) > -1);
    return `${elevator ? "E" : ""}M${microchips.length - pairs.length}G${generators.length - pairs.length}P${pairs.length}`;
};

const serialiseState = (state: State) =>
    state.floors.map(serialiseFloor).join("");

const floorIsEmpty = (floor: Floor) => floor.microchips.length === 0 && floor.generators.length === 0;

const isFinalState = (state: State) =>
    state.floors.slice(0, state.floors.length - 1).every(floorIsEmpty);

const parseInitialState = (input: string): State => {
    const getMatches = (floor: string, re: RegExp) => {
        let matches: string[] = [];
        let match = re.exec(floor);
        while (match) {
            matches.push(match[1]);
            match = re.exec(floor);
        }
        return matches;
    }

    const floors = input.split("\n").map((floor, index) => {
        return {
            elevator: index === 0,
            microchips: getMatches(floor, /(\w+)-compatible microchip/g),
            generators: getMatches(floor, /(\w+) generator/g)
        };
    });

    return {
        step: 0,
        floors
    };
}

const testInput = `The first floor contains a hydrogen-compatible microchip and a lithium-compatible microchip.
The second floor contains a hydrogen generator.
The third floor contains a lithium generator.
The fourth floor contains nothing relevant.`;

let state = parseInitialState(input);

state.floors[0].generators.push("elerium", "dilithium");
state.floors[0].microchips.push("elerium", "dilithium");

const cloneState = (state: State): State => {
    return {
        step: state.step + 1,
        floors: state.floors.map(({ elevator, microchips, generators }) =>
            ({ elevator, microchips: microchips.slice(), generators: generators.slice() }))
    };
};

const moveElevator = (state: State, from: number, to: number) => {
    state.floors[from].elevator = false;
    state.floors[to].elevator = true;
    return state;
}

const enumerateDoubleMoves = (state: State, currentFloor: number, newFloor: number) =>
    state.floors[currentFloor].generators.reduce((moves, firstGen, index, generators) =>
        moves.concat(generators.slice(index + 1).map(secondGen => {
            let newState = moveElevator(cloneState(state), currentFloor, newFloor);
            newState.floors[currentFloor].generators = newState.floors[currentFloor].generators.filter(g => g !== firstGen && g !== secondGen);
            newState.floors[newFloor].generators.push(firstGen, secondGen);
            return newState
        })), state.floors[currentFloor].microchips.reduce((moves, firstChip, index, microchips) =>
            moves.concat(microchips.slice(index + 1).map(secondChip => {
                let newState = moveElevator(cloneState(state), currentFloor, newFloor);
                newState.floors[currentFloor].microchips = newState.floors[currentFloor].microchips.filter(m => m !== firstChip && m !== secondChip);
                newState.floors[newFloor].microchips.push(firstChip, secondChip);
                return newState;
            })), state.floors[currentFloor].generators.reduce((moves, generator, genIndex) =>
                moves.concat(state.floors[currentFloor].microchips.map((microchip, chipIndex) => {
                    let newState = moveElevator(cloneState(state), currentFloor, newFloor);
                    newState.floors[currentFloor].generators.splice(genIndex, 1);
                    newState.floors[currentFloor].microchips.splice(chipIndex, 1);
                    newState.floors[newFloor].generators.push(generator);
                    newState.floors[newFloor].microchips.push(microchip);
                    return newState;
                })), []))).filter(isSafeState);

const enumerateSingleMoves = (state: State, currentFloor: number, newFloor: number) =>
    state.floors[currentFloor].generators.map((generator, index) => {
        let newState = moveElevator(cloneState(state), currentFloor, newFloor);
        newState.floors[currentFloor].generators.splice(index, 1);
        newState.floors[newFloor].generators.push(generator);
        return newState;
    }).concat(state.floors[currentFloor].microchips.map((firstChip, index) => {
        let newState = moveElevator(cloneState(state), currentFloor, newFloor);
        newState.floors[currentFloor].microchips.splice(index, 1);
        newState.floors[newFloor].microchips.push(firstChip);
        return newState;
    })).filter(isSafeState);

const isSafeState = (state: State) =>
    state.floors.every(floor =>
        floor.generators.length === 0
        || floor.microchips.every(m => floor.generators.indexOf(m) > -1));

const getLegalMoves = (state: State) => {
    const currentFloor = state.floors.findIndex(floor => floor.elevator);
    let moves: State[] = [];

    if (currentFloor < state.floors.length - 1) {
        let upwardMoves = enumerateDoubleMoves(state, currentFloor, currentFloor + 1);
        if (upwardMoves.length === 0) {
            upwardMoves = upwardMoves.concat(enumerateSingleMoves(state, currentFloor, currentFloor + 1));
        }
        moves = moves.concat(upwardMoves);
    }

    // only consider going down if not every floor below is empty
    if (currentFloor > 0 && !state.floors.slice(0, currentFloor).every(floorIsEmpty)) {
        let downwardMoves = enumerateSingleMoves(state, currentFloor, currentFloor - 1);
        if (downwardMoves.length === 0) {
            downwardMoves = downwardMoves.concat(enumerateDoubleMoves(state, currentFloor, currentFloor - 1));
        }
        moves = moves.concat(downwardMoves);
    }

    return moves;
}

const guessDistance = (state: State) =>
    state.floors.reduce((count, floor, index) =>
        count + (floor.elevator ? 1 : 0) + floor.microchips.length + floor.generators.length * (state.floors.length - index), 0)

let serialisedState = serialiseState(state);
let stateLookup = new Map([[serialisedState, state]]);

let closedSet = new Set<string>();
let openSet = new Set([serialisedState]);
let cameFrom = new Map<string, string>();

let gScore = new Map([[serialisedState, 0]]);
let fScore = new Map([[serialisedState, guessDistance(state)]]);

while (openSet.size > 0) {
    let current = Array.from(openSet).sort((a, b) => fScore[a] - fScore[b])[0];
    if (current.startsWith("M0G0P0".repeat(state.floors.length - 1))) {
        console.log(stateLookup.get(current).step);
        break;
    }

    openSet.delete(current);
    closedSet.add(current);
    getLegalMoves(stateLookup.get(current)).forEach(move => {
        const serialisedMove = serialiseState(move);
        if (serialisedMove in closedSet) {
            return;
        }

        let tentativeGScore = move.step;
        if (!(serialisedMove in openSet)) {
            stateLookup.set(serialisedMove, move);
            openSet.add(serialisedMove);
        } else if (tentativeGScore >= gScore[serialisedMove]) {
            return;
        }

        cameFrom.set(serialisedMove, current);
        gScore.set(serialisedMove, tentativeGScore);
        fScore.set(serialisedMove, gScore[serialisedMove] + guessDistance(move));
    });
}
