const students = [];
// zach schutzer is a great messenger
// whoever has to read this atrocity...just two words...my apologies

const updatePathsLink = () => {
    if (document.querySelectorAll('.squareOn').length === 0) {
        document.querySelector('#paths').style.display = 'none';
    } else {
        document.querySelector('#paths').style.display = 'flex';
    }
    let queryString = '';
    queryString = [...document.querySelectorAll('.squareOn')].map(button => button.id).join();
    document.querySelector('#paths').href = `/paths?courses=${queryString}`;
}


document.getElementById('course-search').addEventListener('keyup', e => {
    const searchResult = document.getElementById('course-search').value;

    const courseButtons = Object.values(document.querySelectorAll('button')).filter(courseButton => {
        return courseButton.className === 'squareOn' || courseButton.className === 'squareOff';
    });
    const allCourses = courseButtons.map(course => course.textContent);

    let searchedCourses = allCourses.filter(course => {
        const shortenedCourseName = course.substring(0, searchResult.length).toLowerCase();
        const lowerCasedSearchResult = searchResult.toLowerCase();
        return shortenedCourseName === lowerCasedSearchResult;
    });

    resetBorderColors();

    const searchFieldIsEmpty = searchedCourses.length === allCourses.length;
    if (searchFieldIsEmpty) {
        return;
    }

    searchedCourses.forEach(courseName => {
        document.getElementById(courseName).style.border = 'solid yellow 3px';
    });
});

document.getElementById('student-search').addEventListener('keyup', e => {
    const searchResult = document.getElementById('student-search').value;
    const allStudents = [...students];

    let searchedStudents = allStudents.filter(student => {
        const shortenedCourseName = student.substr(0, searchResult.length).toLowerCase();
        const lowerCasedSearchResult = searchResult.toLowerCase();
        return shortenedCourseName === lowerCasedSearchResult;
    });

    resetButtonColors();
    resetStudentButtonBackground();
    updatePathsLink();

    document.getElementById('conflict-list').textContent = '';
    document.getElementById('student-buttons').innerHTML = '';

    searchedStudents.forEach(studentName => {

        const button = document.createElement('button');
        button.className = 'student-button';
        button.id = studentName;
        button.textContent = studentName;
        button.addEventListener('click', () => {
            if (!button.classList.contains('squareOn') && !button.classList.contains('squareOff') && !button.classList.contains('student-button')) {
                return;
            }
            if (button.classList.contains('student-button')) {
                let wasGreen = button.backgroundColor === 'green' ? true : false;
                // some nasty code but absolutely necessary for now because after button color resets, we have to know whether the button was previously green
                resetButtonColors();
                resetClassNames();

                document.getElementById('conflict-list').textContent = '';
                if (wasGreen) {
                    updatePathsLink();
                    return;
                }
                const studentName = button.textContent;
                fetch(`/?student=${studentName}`)
                .then(response => response.json())
                .then(response => {
                    const { courses } = response;
                    courses.forEach(course => {
                        document.getElementById(course).className = 'squareOn';
                    });
                    Object.values(document.getElementsByClassName('squareOn')).forEach(selectedCourseButton => courses.push(selectedCourseButton.textContent));
                    const setCourses = [...new Set(courses)];
                    fetch(`/?courses=${setCourses}`)
                    .then(response => response.json())
                    .then(response => {
                        let { conflictedCourses } = response;
                        Object.values(document.getElementsByClassName('squareOn')).forEach(selectedCourseButton => {
                            selectedCourseButton.backgroundColor = 'green';
                            selectedCourseButton.style.backgroundColor = 'green'
                        });
                        if (!conflictedCourses) {
                            return;
                        }
                        let conflictString = '';
                        conflictedCourses.forEach(conflictCourse => {
                            if (document.getElementById(conflictCourse.name).backgroundColor === 'green') {
                                document.getElementById(conflictCourse.name).style.backgroundColor = 'red';
                            }
                            conflictString += `${conflictCourse.name}, `;
                        });
                        conflictString = conflictString.slice(0, -2);
                        document.getElementById('conflict-list').textContent = conflictString;
                        updatePathsLink();
                    });
                });
                button.backgroundColor = 'green';
                button.style.backgroundColor = 'green';
                button.classList.remove('squareOff');
                button.classList.add('squareOn');
                return;
            }
            button.className = button.className === 'squareOff' ? 'squareOn' : 'squareOff';
            if (button.className === 'squareOff') {
                button.style.backgroundColor = 'grey';
                button.backgroundColor = 'grey';
            }
            const courses = [];
            Object.values(document.getElementsByClassName('squareOn')).forEach(selectedCourseButton => courses.push(selectedCourseButton.textContent));
            if (courses) {
                const setCourses = [...new Set(courses)];
                fetch(`/?courses=${setCourses}`)
                .then(response => response.json())
                .then(response => {
                    let { conflictedCourses } = response;
                    Object.values(document.getElementsByClassName('squareOn')).forEach(selectedCourseButton => {
                        selectedCourseButton.backgroundColor = 'green';
                        selectedCourseButton.style.backgroundColor = 'green'
                    });
                    if (!conflictedCourses) {
                        return;
                    }
                    let conflictString = '';
                    conflictedCourses.forEach(conflictCourse => {
                        if (document.getElementById(conflictCourse.name).backgroundColor === 'green') {
                            document.getElementById(conflictCourse.name).style.backgroundColor = 'red';
                        }
                        conflictString += `${conflictCourse.name}, `;
                    });
                    conflictString = conflictString.slice(0, -2);
                    document.getElementById('conflict-list').textContent = conflictString;
                });
            }
        });
        document.getElementById('student-buttons').appendChild(button);
    });
});

document.getElementById('reset').addEventListener('click', () => {
    resetButtonColors();
    resetClassNames();
    updatePathsLink();
    document.getElementById('conflict-list').textContent = '';
});

Object.values(document.getElementsByTagName('button')).forEach(button => {
    button.addEventListener('click', () => {
        if (!button.classList.contains('squareOn') && !button.classList.contains('squareOff') && !button.classList.contains('student-button')) {
            return;
        }
        if (button.classList.contains('student-button')) {
            let wasGreen = false;
            if (button.backgroundColor === 'green') {
                wasGreen = true;
            }
            resetButtonColors();
            resetClassNames();
            document.getElementById('conflict-list').textContent = '';
            if (wasGreen) {
                updatePathsLink();
                return;
            }
            const studentName = button.textContent;
            fetch(`/?student=${studentName}`)
            .then(response => response.json())
            .then(response => {
                const { courses } = response;
                courses.forEach(course => {
                    document.getElementById(course).className = 'squareOn';
                });
                Object.values(document.getElementsByClassName('squareOn')).forEach(selectedCourseButton => courses.push(selectedCourseButton.textContent));
                const setCourses = [...new Set(courses)]; 
                fetch(`/?courses=${setCourses}`)
                .then(response => response.json())
                .then(response => {
                    let { conflictedCourses } = response;
                    Object.values(document.getElementsByClassName('squareOn')).forEach(selectedCourseButton => {
                        selectedCourseButton.backgroundColor = 'green';
                        selectedCourseButton.style.backgroundColor = 'green'
                    });
                    if (!conflictedCourses) {
                        return;
                    }
                    let conflictString = '';
                    conflictedCourses.forEach(conflictCourse => {
                        if (document.getElementById(conflictCourse.name).backgroundColor === 'green') {
                            document.getElementById(conflictCourse.name).style.backgroundColor = 'red';
                        }
                        conflictString += `${conflictCourse.name}, `;
                    });
                    conflictString = conflictString.slice(0, -2);
                    document.getElementById('conflict-list').textContent = conflictString;
                    updatePathsLink();
                });
            });
            button.backgroundColor = 'green';
            button.style.backgroundColor = 'green';
            button.classList.remove('squareOff');
            button.classList.add('squareOn');
            return;
        } 
        button.className = button.className === 'squareOff' ? 'squareOn' : 'squareOff';
        if (button.className === 'squareOff') {
            button.style.backgroundColor = 'grey';
            button.backgroundColor = 'grey';
        }
        const courses = [];
        Object.values(document.getElementsByClassName('squareOn')).forEach(selectedCourseButton => courses.push(selectedCourseButton.textContent));
        if (courses) {
            const setCourses = [...new Set(courses)];
            if (setCourses.length > 12) {
                button.className = 'squareOff';
                // prevents website from getting shut down from network timeout from overloaded calculations of too many selected courses
                document.getElementById('conflict-list').textContent = 'You cannot select more than twelve courses';
                return;
            }
            fetch(`/?courses=${setCourses}`)
            .then(response => response.json())
            .then(response => {
                let { conflictedCourses } = response;
                Object.values(document.getElementsByClassName('squareOn')).forEach(selectedCourseButton => {
                    selectedCourseButton.backgroundColor = 'green';
                    selectedCourseButton.style.backgroundColor = 'green';
                });
                if (!conflictedCourses) {
                    return;
                }
                let conflictString = '';
                conflictedCourses.forEach(conflictCourse => {
                    if (document.getElementById(conflictCourse.name).backgroundColor === 'green') {
                        document.getElementById(conflictCourse.name).style.backgroundColor = 'red';
                    }
                    conflictString += `${conflictCourse.name}, `;
                });
                conflictString = conflictString.slice(0, -2);
                document.getElementById('conflict-list').textContent = conflictString;
            });
        }
        updatePathsLink();
    });
});

const resetButtonColors = () => {
    const courseButtons = Object.values(document.querySelectorAll('button')).filter(button => button.className === 'squareOn' || button.className === 'squareOff');
    Object.values(courseButtons).forEach(button => {
        button.backgroundColor = 'grey';
        button.style.backgroundColor = 'grey';
        button.style.border = 'solid black 1px';
        button.classList.remove('squareOn');
        button.classList.add('squareOff');
    });
    resetStudentButtonBackground();
}

const resetStudentButtonBackground = () => {
    const selectedStudentButton = Object.values(document.getElementsByClassName('student-button')).filter(button => button.style.backgroundColor === 'green')[0];
    if (!selectedStudentButton) {
        return;
    }
    selectedStudentButton.backgroundColor = 'grey';
    selectedStudentButton.style.backgroundColor = 'grey';
    selectedStudentButton.classList.remove('squareOn');
    selectedStudentButton.classList.add('squareOff');
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
        button.classList.remove('squareOn');
        button.classList.add('squareOff');
    });
}
window.onload = () => {
   Object.values(document.getElementsByClassName('student-button')).forEach(button => {
        students.push(button.textContent);
   });
   updatePathsLink();
}