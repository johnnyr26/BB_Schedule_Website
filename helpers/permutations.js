const permutation = (input, output) => {
    if (input.length === 0) {
        return output;
    }
    const inputList = input[0];
    const newOutput = [];
    inputList.forEach(val => {
        output.forEach(outputList => {
            const newOutputList = [...outputList];
            newOutputList.push(val);
            newOutput.push(newOutputList);
        });
    });
    return permutation(input.slice(1), newOutput);
}
module.exports = permutation;