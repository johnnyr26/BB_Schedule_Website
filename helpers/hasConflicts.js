const permutation = require('./permutations');

module.exports = periods => {
    const combinations = permutation(periods, [[]]);
    for (let combo of combinations) {
        const flattenedArray = combo.flat(Infinity);
        const setArray = [...new Set(flattenedArray)];
        const noConflicts = setArray.length === flattenedArray.length;
        if (noConflicts) {
            return false;
        }
    }
    return true;
}