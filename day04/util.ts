const comparator = (letters: string) =>
    (a: string, b: string) => {
        const aMatches = letters.match(new RegExp(a, "g"));
        const bMatches = letters.match(new RegExp(b, "g"));
        if (aMatches && bMatches) {
            const frequencyDiff = bMatches.length - aMatches.length;
            if (frequencyDiff !== 0) {
                return frequencyDiff;
            }
        }
        return a.localeCompare(b);
    };

const unique = (array: string[]) => array.filter((value, index, array) => array.indexOf(value) === index)

export const isValid = (letters: string, checksum: string) => {
    letters = letters.replace(/-/g, "");
    const uniqueLetters = unique(letters.split("")).sort(comparator(letters));
    return checksum.split("").reduce((prev, curr, index) => prev && curr === uniqueLetters[index], true);
}
