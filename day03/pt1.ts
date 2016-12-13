import { input } from "./input";
import { isValidTriangle } from "./isValidTriangle";

const re = /\d+/g;
const getSides = (line: string) => line.match(re).map(Number);

const triangles = input.split("\n").map(getSides).reduce((count, sides) =>
    isValidTriangle(sides) ? count + 1 : count, 0);

console.log(triangles);
