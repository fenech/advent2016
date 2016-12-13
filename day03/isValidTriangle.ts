export const isValidTriangle = (sides: number[]) => 
    sides.length === 3
    && sides[0] + sides[1] > sides[2]
    && sides[0] + sides[2] > sides[1]
    && sides[1] + sides[2] > sides[0];
    