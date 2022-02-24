const permutation = require('./permutations');
const hasConflicts = require('./isConflict')

module.exports = periods => {
    const combinations = permutation(periods, [[]]);
    for (let combo of combinations) {
        if (!hasConflicts(combo)) {
            return false;
        }
    }
    return true;
}

