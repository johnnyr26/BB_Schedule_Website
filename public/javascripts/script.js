class Course {
    constructor(name, periods) {
        this.name = name;
        this.periods = periods;
    }
}

let setCourses = [];
let periods = [];

document.getElementById('search-bar').addEventListener('keyup', e => {
    const searchResult = document.getElementById('search-bar').value;
    let searchedCourses = setCourses.filter(course => {
        const shortenedCourseName = course.name.substr(0, searchResult.length).toLowerCase();
        const lowerCasedSearchResult = searchResult.toLowerCase();
        return shortenedCourseName === lowerCasedSearchResult;
    });
    searchedCourses = searchedCourses.map(course => course.name);
    resetBorderColors();
    const searchFieldIsEmpty = searchedCourses.length === setCourses.length;
    if (searchFieldIsEmpty) {
        return;
    }
    searchedCourses.forEach(courseName => {
        document.getElementById(courseName).style.border = 'solid yellow 3px';
    });
});

document.getElementById('reset').addEventListener('click', () => {
    periods = [];
    resetButtonColors();
    resetClassNames();
    document.getElementById('conflict-list').textContent = '';
});

Object.values(document.getElementsByTagName('button')).forEach(button => {
    button.addEventListener('click', () => {
        document.getElementById('conflict-list').textContent = '';
        const course = setCourses.find(course => course.name === button.textContent);
        if (button.className === 'squareOn') {
            button.className = 'squareOff';
            button.backgroundColor = 'grey';
            button.style.backgroundColor = 'grey';
            const periodToRemove = course.periods ? course.periods : '';
            const index = periods.indexOf(periodToRemove);
            periods.splice(index, 1);
        } else if (button.textContent !== 'Reset') {
            button.className = 'squareOn';
            button.backgroundColor = 'green';
            button.style.backgroundColor = 'green';
            periods.push(course.periods);
        }
        const courses = [];
        resetButtonColors(courses);
        let conflictString = 'Conflicts: ';
        let conflictedCourses = getConflicts(courses);
        const flattenedArray = [].concat.apply([], conflictedCourses);
        conflictedCourses = [...new Set(flattenedArray)];
        conflictedCourses.forEach(conflictCourse => {
            if (document.getElementById(conflictCourse.name).backgroundColor === 'green') {
                document.getElementById(conflictCourse.name).style.backgroundColor = 'red';
                conflictString += conflictCourse.name + ', ';
            }
        });
        if (conflictString !== 'Conflicts: ') {
            conflictString = conflictString.slice(0, -2);
            document.getElementById('conflict-list').textContent = conflictString;
        }
    });
});

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

const hasConflicts = periods => {
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

const fetchSchedule = async () => {
    fetch('/?schedule=true')
    .then(response => response.json())
    .then(response => setCourses = response.courses);
}

const resetButtonColors = (courseArray) => {
    if (courseArray) {
        Object.values(document.getElementsByClassName('squareOn')).forEach(button => {
            button.backgroundColor = 'green';
            button.style.backgroundColor = 'green';
            setCourses.forEach(originallySelectedCourse => {
                if (originallySelectedCourse.name === button.textContent) {
                    courseArray.push(originallySelectedCourse);
                }
            });
        });
        return;
    }
    const courseButtons = Object.values(document.getElementsByTagName('button')).filter(button => button.className === 'squareOn' || button.className === 'squareOff');
    Object.values(courseButtons).forEach(button => {
        button.backgroundColor = 'grey';
        button.style.backgroundColor = 'grey';
    });
}

const resetBorderColors = () => {
    const courseButtons = Object.values(document.getElementsByTagName('button')).filter(button => button.className === 'squareOn' || button.className === 'squareOff');
    courseButtons.forEach(button => {
        button.style.border = 'solid black 1px';
    });
}

const resetClassNames = () => {
    const courseButtons = Object.values(document.getElementsByTagName('button')).filter(button => button.className === 'squareOn' || button.className === 'squareOff');
    courseButtons.forEach(button => {
        button.className = 'squareOff';
    });
}

const getConflicts = setCourses => {
    const stuConflicts = [];

    for (let a = 0; a < setCourses.length - 1; a++)
        for (let b = a + 1; b < setCourses.length; b++) {
            const temp1 = [];
            temp1.push(setCourses[a].periods);
            temp1.push(setCourses[b].periods);
            if (hasConflicts(temp1)) {
                const conflictedCourses = [];
                conflictedCourses.push(setCourses[a]);
                conflictedCourses.push(setCourses[b]);
                stuConflicts.push(conflictedCourses);
            }
        }

    // looking for 3 at a time
    let skip = false;
    for (let a = 0; a < setCourses.length - 2; a++)
        for (let b = a + 1; b < setCourses.length - 1; b++)
            for (let c = b + 1; c < setCourses.length; c++) {
                // checking to see if 2 of a,b,c are already conflicted
                skip = false;
                let counter = 0; // number of a,b,c that are in a particular conflict
                for (let i = 0; i < stuConflicts.length; i++) {
                    counter = 0;
                    if (stuConflicts[i].includes(setCourses[a]))
                        counter++;
                    if (stuConflicts[i].includes(setCourses[b]))
                        counter++;
                    if (stuConflicts[i].includes(setCourses[c]))
                        counter++;
                    if (counter === stuConflicts[i].length)
                        skip = true;
                }
                if (!skip) {

                    const temp1 = [];
                    temp1.push(setCourses[a].periods);
                    temp1.push(setCourses[b].periods);
                    temp1.push(setCourses[c].periods);
                    if (hasConflicts(temp1)) {
                        const conflictedCourses = [];
                        conflictedCourses.push(setCourses[a]);
                        conflictedCourses.push(setCourses[b]);
                        conflictedCourses.push(setCourses[c]);
                        stuConflicts.push(conflictedCourses);

                    }
                }
            }

    // looking for 4 at a time

    for (let a = 0; a < setCourses.length - 3; a++)
        for (let b = a + 1; b < setCourses.length - 2; b++)
            for (let c = b + 1; c < setCourses.length - 1; c++)
                for (let d = c + 1; d < setCourses.length; d++) {
                    skip = false;
                    // System.out.print(a+' '+b+' '+c+' '+d);
                    // System.out.println(' '+setCourses[a]+' '+setCourses[b]+'
                    // '+setCourses[c]+' '+setCourses[d]);
                    // checking to see if a,b,c,d are already conflicted
                    let counter = 0; // number of a,b,c,d that are in a particular conflict
                    for (let i = 0; i < stuConflicts.length; i++) {
                        counter = 0;
                        if (stuConflicts[i].includes(setCourses[a]))
                            counter++;
                        if (stuConflicts[i].includes(setCourses[b]))
                            counter++;
                        if (stuConflicts[i].includes(setCourses[c]))
                            counter++;
                        if (stuConflicts[i].includes(setCourses[d]))
                            counter++;
                        if (counter === stuConflicts[i].length) {
                            // System.out.println('Skipped: '+a+' '+b+' '+c+' '+d);
                            skip = true;
                            // System.out.println(stuConflicts[i].includes(setCourses[a])+'
                            // '+stuConflicts[i].includes(setCourses[b])+'
                            // '+stuConflicts[i].includes(setCourses[c])+'
                            // '+stuConflicts[i].includes(setCourses[d]));
                            // System.out.println(counter+' '+stuConflicts[i].length+'
                            // '+stuConflicts[i]+' '+setCourses[a]+' '+setCourses[b]+'
                            // '+setCourses[c]+' '+setCourses[d]);
                        }
                    }
                    if (!skip) {
                        // System.out.println('After skip'+a+' '+b+' '+c+' '+d);

                        // System.out.println(' '+setCourses[a]+' '+setCourses[b]+'
                        // '+setCourses[c]+' '+setCourses[d]);

                        const temp1 = [];
                        temp1.push(setCourses[a].periods);
                        temp1.push(setCourses[b].periods);
                        temp1.push(setCourses[c].periods);
                        temp1.push(setCourses[d].periods);
                        if (hasConflicts(temp1)) {

                            const conflictedCourses = [];
                            conflictedCourses.push(setCourses[a]);
                            conflictedCourses.push(setCourses[b]);
                            conflictedCourses.push(setCourses[c]);
                            conflictedCourses.push(setCourses[d]);
                            stuConflicts.push(conflictedCourses);

                        }
                    }
                }

    // looking for 5 at a time

    for (let a = 0; a < setCourses.length - 4; a++)
        for (let b = a + 1; b < setCourses.length - 3; b++)
            for (let c = b + 1; c < setCourses.length - 2; c++)
                for (let d = c + 1; d < setCourses.length - 1; d++)
                    for (let e = d + 1; e < setCourses.length; e++) {
                        // checking to see if a,b,c,d,e are already conflicted
                        skip = false;
                        let counter = 0; // number of a,b,c,d that are in a particular conflict
                        for (let i = 0; i < stuConflicts.length; i++) {
                            counter = 0;
                            if (stuConflicts[i].includes(setCourses[a]))
                                counter++;
                            if (stuConflicts[i].includes(setCourses[b]))
                                counter++;
                            if (stuConflicts[i].includes(setCourses[c]))
                                counter++;
                            if (stuConflicts[i].includes(setCourses[d]))
                                counter++;
                            if (stuConflicts[i].includes(setCourses[e]))
                                counter++;
                            if (counter === stuConflicts[i].length)
                                skip = true;
                        }
                        if (!skip) {
                            const temp1 = [];
                            temp1.push(setCourses[a].periods);
                            temp1.push(setCourses[b].periods);
                            temp1.push(setCourses[c].periods);
                            temp1.push(setCourses[d].periods);
                            temp1.push(setCourses[e].periods);
                            if (hasConflicts(temp1)) {
                                const conflictedCourses = [];
                                conflictedCourses.push(setCourses[a]);
                                conflictedCourses.push(setCourses[b]);
                                conflictedCourses.push(setCourses[c]);
                                conflictedCourses.push(setCourses[d]);
                                conflictedCourses.push(setCourses[e]);
                                stuConflicts.push(conflictedCourses);

                            }
                        }
                    }

    // looking for 6 at a time

    for (let a = 0; a < setCourses.length - 5; a++)
        for (let b = a + 1; b < setCourses.length - 4; b++)
            for (let c = b + 1; c < setCourses.length - 3; c++)
                for (let d = c + 1; d < setCourses.length - 2; d++)
                    for (let e = d + 1; e < setCourses.length - 1; e++)
                        for (let f = e + 1; f < setCourses.length; f++) {
                            // checking to see if a,b,c,d,e are already conflicted
                            skip = false;
                            let counter = 0; // number of a,b,c,d that are in a particular conflict
                            for (let i = 0; i < stuConflicts.length; i++) {
                                counter = 0;
                                if (stuConflicts[i].includes(setCourses[a]))
                                    counter++;
                                if (stuConflicts[i].includes(setCourses[b]))
                                    counter++;
                                if (stuConflicts[i].includes(setCourses[c]))
                                    counter++;
                                if (stuConflicts[i].includes(setCourses[d]))
                                    counter++;
                                if (stuConflicts[i].includes(setCourses[e]))
                                    counter++;
                                if (stuConflicts[i].includes(setCourses[f]))
                                    counter++;
                                if (counter === stuConflicts[i].length)
                                    skip = true;
                            }
                            if (!skip) {
                                const temp1 = [];
                                temp1.push(setCourses[a].periods);
                                temp1.push(setCourses[b].periods);
                                temp1.push(setCourses[c].periods);
                                temp1.push(setCourses[d].periods);
                                temp1.push(setCourses[e].periods);
                                temp1.push(setCourses[f].periods);
                                if (hasConflicts(temp1)) {
                                    const conflictedCourses = [];
                                    conflictedCourses.push(setCourses[a]);
                                    conflictedCourses.push(setCourses[b]);
                                    conflictedCourses.push(setCourses[c]);
                                    conflictedCourses.push(setCourses[d]);
                                    conflictedCourses.push(setCourses[e]);
                                    conflictedCourses.push(setCourses[f]);
                                    stuConflicts.push(conflictedCourses);

                                }
                            }
                        }

    // looking for 7 at a time

    for (let a = 0; a < setCourses.length - 6; a++)
        for (let b = a + 1; b < setCourses.length - 5; b++)
            for (let c = b + 1; c < setCourses.length - 4; c++)
                for (let d = c + 1; d < setCourses.length - 3; d++)
                    for (let e = d + 1; e < setCourses.length - 2; e++)
                        for (let f = e + 1; f < setCourses.length - 1; f++)
                            for (let g = f + 1; g < setCourses.length; g++) {
                                // checking to see if a,b,c,d,e,f,g are already conflicted
                                skip = false;
                                let counter = 0; // number of a,b,c,d,e,f,g that are in a particular conflict
                                for (let i = 0; i < stuConflicts.length; i++) {
                                    counter = 0;
                                    if (stuConflicts[i].includes(setCourses[a]))
                                        counter++;
                                    if (stuConflicts[i].includes(setCourses[b]))
                                        counter++;
                                    if (stuConflicts[i].includes(setCourses[c]))
                                        counter++;
                                    if (stuConflicts[i].includes(setCourses[d]))
                                        counter++;
                                    if (stuConflicts[i].includes(setCourses[e]))
                                        counter++;
                                    if (stuConflicts[i].includes(setCourses[f]))
                                        counter++;
                                    if (stuConflicts[i].includes(setCourses[g]))
                                        counter++;
                                    if (counter === stuConflicts[i].length)
                                        skip = true;
                                }
                                if (!skip) {
                                    const temp1 = [];
                                    temp1.push(setCourses[a].periods);
                                    temp1.push(setCourses[b].periods);
                                    temp1.push(setCourses[c].periods);
                                    temp1.push(setCourses[d].periods);
                                    temp1.push(setCourses[e].periods);
                                    temp1.push(setCourses[f].periods);
                                    temp1.push(setCourses[g].periods);
                                    if (hasConflicts(temp1)) {
                                        const conflictedCourses = [];
                                        conflictedCourses.push(setCourses[a]);
                                        conflictedCourses.push(setCourses[b]);
                                        conflictedCourses.push(setCourses[c]);
                                        conflictedCourses.push(setCourses[d]);
                                        conflictedCourses.push(setCourses[e]);
                                        conflictedCourses.push(setCourses[f]);
                                        conflictedCourses.push(setCourses[g]);
                                        stuConflicts.push(conflictedCourses);

                                    }
                                }

                            }

    // looking for 8 at a time

    for (let a = 0; a < setCourses.length - 7; a++)
        for (let b = a + 1; b < setCourses.length - 6; b++)
            for (let c = b + 1; c < setCourses.length - 5; c++)
                for (let d = c + 1; d < setCourses.length - 4; d++)
                    for (let e = d + 1; e < setCourses.length - 3; e++)
                        for (let f = e + 1; f < setCourses.length - 2; f++)
                            for (let g = f + 1; g < setCourses.length - 1; g++)
                                for (let h = g + 1; h < setCourses.length; h++) {
                                    // checking to see if a,b,c,d,e,f,g are already conflicted
                                    skip = false;
                                    let counter = 0; // number of a,b,c,d,e,f,g that are in a particular conflict
                                    for (let i = 0; i < stuConflicts.length; i++) {
                                        counter = 0;
                                        if (stuConflicts[i].includes(setCourses[a]))
                                            counter++;
                                        if (stuConflicts[i].includes(setCourses[b]))
                                            counter++;
                                        if (stuConflicts[i].includes(setCourses[c]))
                                            counter++;
                                        if (stuConflicts[i].includes(setCourses[d]))
                                            counter++;
                                        if (stuConflicts[i].includes(setCourses[e]))
                                            counter++;
                                        if (stuConflicts[i].includes(setCourses[f]))
                                            counter++;
                                        if (stuConflicts[i].includes(setCourses[g]))
                                            counter++;
                                        if (stuConflicts[i].includes(setCourses[h]))
                                            counter++;
                                        if (counter === stuConflicts[i].length)
                                            skip = true;
                                    }
                                    if (!skip) {
                                        const temp1 = [];
                                        temp1.push(setCourses[a].periods);
                                        temp1.push(setCourses[b].periods);
                                        temp1.push(setCourses[c].periods);
                                        temp1.push(setCourses[d].periods);
                                        temp1.push(setCourses[e].periods);
                                        temp1.push(setCourses[f].periods);
                                        temp1.push(setCourses[g].periods);
                                        temp1.push(setCourses[h].periods);
                                        if (hasConflicts(temp1)) {
                                            const conflictedCourses = [];
                                            conflictedCourses.push(setCourses[a]);
                                            conflictedCourses.push(setCourses[b]);
                                            conflictedCourses.push(setCourses[c]);
                                            conflictedCourses.push(setCourses[d]);
                                            conflictedCourses.push(setCourses[e]);
                                            conflictedCourses.push(setCourses[f]);
                                            conflictedCourses.push(setCourses[g]);
                                            conflictedCourses.push(setCourses[h]);
                                            stuConflicts.push(conflictedCourses);

                                        }
                                    }
                                }

    // looking for 9 at a time

    for (let a = 0; a < setCourses.length - 8; a++)
        for (let b = a + 1; b < setCourses.length - 7; b++)
            for (let c = b + 1; c < setCourses.length - 6; c++)
                for (let d = c + 1; d < setCourses.length - 5; d++)
                    for (let e = d + 1; e < setCourses.length - 4; e++)
                        for (let f = e + 1; f < setCourses.length - 3; f++)
                            for (let g = f + 1; g < setCourses.length - 2; g++)
                                for (let h = g + 1; h < setCourses.length - 1; h++)
                                    for (let j = h + 1; j < setCourses.length; j++) {
                                        // checking to see if a,b,c,d,e,f,g are already conflicted
                                        skip = false;
                                        let counter = 0; // number of a,b,c,d,e,f,g that are in a particular
                                                            // conflict
                                        for (let i = 0; i < stuConflicts.length; i++) {
                                            counter = 0;
                                            if (stuConflicts[i].includes(setCourses[a]))
                                                counter++;
                                            if (stuConflicts[i].includes(setCourses[b]))
                                                counter++;
                                            if (stuConflicts[i].includes(setCourses[c]))
                                                counter++;
                                            if (stuConflicts[i].includes(setCourses[d]))
                                                counter++;
                                            if (stuConflicts[i].includes(setCourses[e]))
                                                counter++;
                                            if (stuConflicts[i].includes(setCourses[f]))
                                                counter++;
                                            if (stuConflicts[i].includes(setCourses[g]))
                                                counter++;
                                            if (stuConflicts[i].includes(setCourses[h]))
                                                counter++;
                                            if (stuConflicts[i].includes(setCourses[j]))
                                                counter++;
                                            if (counter === stuConflicts[i].length)
                                                skip = true;
                                        }
                                        if (!skip) {
                                            const temp1 = [];
                                            temp1.push(setCourses[a].periods);
                                            temp1.push(setCourses[b].periods);
                                            temp1.push(setCourses[c].periods);
                                            temp1.push(setCourses[d].periods);
                                            temp1.push(setCourses[e].periods);
                                            temp1.push(setCourses[f].periods);
                                            temp1.push(setCourses[g].periods);
                                            temp1.push(setCourses[h].periods);
                                            temp1.push(setCourses[j].periods);
                                            if (hasConflicts(temp1)) {
                                                const conflictedCourses = [];
                                                conflictedCourses.push(setCourses[a]);
                                                conflictedCourses.push(setCourses[b]);
                                                conflictedCourses.push(setCourses[c]);
                                                conflictedCourses.push(setCourses[d]);
                                                conflictedCourses.push(setCourses[e]);
                                                conflictedCourses.push(setCourses[f]);
                                                conflictedCourses.push(setCourses[g]);
                                                conflictedCourses.push(setCourses[h]);
                                                conflictedCourses.push(setCourses[j]);
                                                stuConflicts.push(conflictedCourses);

                                            }
                                        }
                                    }

    // looking for 10 at a time

    for (let a = 0; a < setCourses.length - 9; a++)
        for (let b = a + 1; b < setCourses.length - 8; b++)
            for (let c = b + 1; c < setCourses.length - 7; c++)
                for (let d = c + 1; d < setCourses.length - 6; d++)
                    for (let e = d + 1; e < setCourses.length - 5; e++)
                        for (let f = e + 1; f < setCourses.length - 4; f++)
                            for (let g = f + 1; g < setCourses.length - 3; g++)
                                for (let h = g + 1; h < setCourses.length - 2; h++)
                                    for (let j = h + 1; j < setCourses.length - 1; j++)
                                        for (let k = j + 1; k < setCourses.length; k++) {
                                            // checking to see if a,b,c,d,e,f,g are already conflicted
                                            skip = false;
                                            let counter = 0; // number of a,b,c,d,e,f,g that are in a particular
                                                                // conflict
                                            for (let i = 0; i < stuConflicts.length; i++) {
                                                counter = 0;
                                                if (stuConflicts[i].includes(setCourses[a]))
                                                    counter++;
                                                if (stuConflicts[i].includes(setCourses[b]))
                                                    counter++;
                                                if (stuConflicts[i].includes(setCourses[c]))
                                                    counter++;
                                                if (stuConflicts[i].includes(setCourses[d]))
                                                    counter++;
                                                if (stuConflicts[i].includes(setCourses[e]))
                                                    counter++;
                                                if (stuConflicts[i].includes(setCourses[f]))
                                                    counter++;
                                                if (stuConflicts[i].includes(setCourses[g]))
                                                    counter++;
                                                if (stuConflicts[i].includes(setCourses[h]))
                                                    counter++;
                                                if (stuConflicts[i].includes(setCourses[j]))
                                                    counter++;
                                                if (stuConflicts[i].includes(setCourses[j]))
                                                    counter++;

                                                if (counter === stuConflicts[i].length)
                                                    skip = true;
                                            }
                                            if (!skip) {
                                                const temp1 = [];
                                                temp1.push(setCourses[a].periods);
                                                temp1.push(setCourses[b].periods);
                                                temp1.push(setCourses[c].periods);
                                                temp1.push(setCourses[d].periods);
                                                temp1.push(setCourses[e].periods);
                                                temp1.push(setCourses[f].periods);
                                                temp1.push(setCourses[g].periods);
                                                temp1.push(setCourses[h].periods);
                                                temp1.push(setCourses[j].periods);
                                                temp1.push(setCourses[k].periods);
                                                if (hasConflicts(temp1)) {
                                                    const conflictedCourses = [];
                                                    conflictedCourses.push(setCourses[a]);
                                                    conflictedCourses.push(setCourses[b]);
                                                    conflictedCourses.push(setCourses[c]);
                                                    conflictedCourses.push(setCourses[d]);
                                                    conflictedCourses.push(setCourses[e]);
                                                    conflictedCourses.push(setCourses[f]);
                                                    conflictedCourses.push(setCourses[g]);
                                                    conflictedCourses.push(setCourses[h]);
                                                    conflictedCourses.push(setCourses[j]);
                                                    conflictedCourses.push(setCourses[k]);
                                                    stuConflicts.push(conflictedCourses);

                                                }
                                            }
                                        }
    return stuConflicts;
}

fetchSchedule();