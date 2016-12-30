import { input } from "./input";

const discFactory = (input: string) => {
    const re = /(\d+) positions.*position (\d+)\.$/;
    const match = input.match(re);
    const positions = +match[1];
    const initialPosition = +match[2];
    return (n: number) => (initialPosition + n) % positions;
}

const discs = input.split("\n").map(discFactory);

let t = 0;
while (!discs.reduce((fallThrough, disc, index) => fallThrough && disc(t + index + 1) === 0, true)) {
    ++t;
}

console.log(t);
