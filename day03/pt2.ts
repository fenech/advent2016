import { input } from "./input";
import { isValidTriangle } from "./isValidTriangle";

const re = /\d+/g;
const triangles = input.match(re).map(Number).reduce((count, side, index, sides) => {
    if (index % 9 === 0) {
        return count + (isValidTriangle([sides[index], sides[index + 3], sides[index + 6]]) ? 1 : 0)
            + (isValidTriangle([sides[index + 1], sides[index + 4], sides[index + 7]]) ? 1 : 0)
            + (isValidTriangle([sides[index + 2], sides[index + 5], sides[index + 8]]) ? 1 : 0);
    }
    return count;
}, 0);

console.log(triangles);
