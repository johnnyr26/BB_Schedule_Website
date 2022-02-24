module.exports = searchedCourses => {
    console.log("\t\t\t\t" + "1A" + "\t" + "1B" + "\t" + "2A" + "\t" + "2B" + "\t" + "3A" + "\t" + "3B"
            + "\t" + "4A" + "\t" + "4B" + "\t" + "5A" + "\t" + "5B" + "\t" + "6A" + "\t" + "6B" + "\t" + "7A" + "\t"
            + "7B" + "\t" + "8A" + "\t" + "8B");
    searchedCourses.forEach(course => {
        let courseNameLength = Math.floor(course.name.length / 8);
        let courseString = `${course.name}`;
        for (let i = courseNameLength; i < 4; i ++) {
            courseString += '\t';
        }
        for (let i = 1; i <= 16; i ++) {
            let charIndex = 0;

            const periodInSection = course.periods.some((section, index) => {
                if (section.includes(`${i}`)) {
                    charIndex = index;
                }  

                return section.includes(`${i}`);
            });

            if (periodInSection) {
                if (course.periods.length === 1) {
                    courseString += 'S\t';
                    continue;
                }
                courseString += `${String.fromCharCode(97 + charIndex).toUpperCase()}\t`;
            } else {
                courseString += '\t';
            }
        }
        console.log(courseString);
    });
}

