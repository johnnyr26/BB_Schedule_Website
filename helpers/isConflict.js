module.exports = combo => {
    const flattenedArray = combo.flat(Infinity);
    const setArray = [...new Set(flattenedArray)];
    const hasConflicts = setArray.length !== flattenedArray.length;
    return hasConflicts;
}