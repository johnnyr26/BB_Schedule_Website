const hasConflicts = require('./hasConflicts');


module.exports = setCourses => {
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