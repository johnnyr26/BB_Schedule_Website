const students = [];

document.getElementById('course-search').addEventListener('keyup', e => {
    const searchResult = document.getElementById('course-search').value;
    const allCourses = [];
    Object.values(document.querySelectorAll('button')).forEach(courseButton => {
        if (courseButton.textContent === 'Reset') {
            return;
        }
        if (courseButton.className === 'squareOn' || courseButton.className === 'squareOff') {
            allCourses.push(courseButton.textContent);
        }
    });
    let searchedCourses = allCourses.filter(course => {
        const shortenedCourseName = course.substr(0, searchResult.length).toLowerCase();
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
    document.getElementById('conflict-list').textContent = '';
    document.getElementById('student-buttons').innerHTML = '';
    searchedStudents.forEach(studentName => {
        const button = document.createElement('button');
        button.className = 'student-button';
        button.id = studentName;
        button.textContent = studentName;
        button.addEventListener('click', () => {
            if (button.className !== 'squareOn' && button.className !== 'squareOff' && button.className !== 'student-button') {
                return;
            }
            if (button.className === 'student-button') {
                let wasGreen = false;
                if (button.backgroundColor === 'green') {
                    wasGreen = true;
                }
                resetButtonColors();
                resetClassNames();
                if (wasGreen) {
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
                    fetch(`/?courses=${courses}`)
                    .then(response => response.json())
                    .then(response => {
                        let { conflictedCourses, conflictString } = response;
                        Object.values(document.getElementsByClassName('squareOn')).forEach(selectedCourseButton => {
                            selectedCourseButton.backgroundColor = 'green';
                            selectedCourseButton.style.backgroundColor = 'green'
                        });
                        conflictedCourses.forEach(conflictCourse => {
                            if (document.getElementById(conflictCourse).backgroundColor === 'green') {
                                document.getElementById(conflictCourse).style.backgroundColor = 'red';
                            }
                        });
                        document.getElementById('conflict-list').textContent = conflictString;
                    });
                });
                button.backgroundColor = 'green';
                button.style.backgroundColor = 'green';
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
                fetch(`/?courses=${courses}`)
                .then(response => response.json())
                .then(response => {
                    let { conflictedCourses, conflictString } = response;
                    Object.values(document.getElementsByClassName('squareOn')).forEach(selectedCourseButton => {
                        selectedCourseButton.backgroundColor = 'green';
                        selectedCourseButton.style.backgroundColor = 'green'
                    });
                    conflictedCourses.forEach(conflictCourse => {
                        if (document.getElementById(conflictCourse).backgroundColor === 'green') {
                            document.getElementById(conflictCourse).style.backgroundColor = 'red';
                        }
                    });
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
    document.getElementById('conflict-list').textContent = '';
});

Object.values(document.getElementsByTagName('button')).forEach(button => {
    button.addEventListener('click', () => {
        if (button.className !== 'squareOn' && button.className !== 'squareOff' && button.className !== 'student-button') {
            return;
        }
        console.log(button.className);
        if (button.className === 'student-button') {
            let wasGreen = false;
            if (button.backgroundColor === 'green') {
                wasGreen = true;
            }
            resetButtonColors();
            resetClassNames();
            if (wasGreen) {
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
                fetch(`/?courses=${courses}`)
                .then(response => response.json())
                .then(response => {
                    let { conflictedCourses, conflictString } = response;
                    Object.values(document.getElementsByClassName('squareOn')).forEach(selectedCourseButton => {
                        selectedCourseButton.backgroundColor = 'green';
                        selectedCourseButton.style.backgroundColor = 'green'
                    });
                    conflictedCourses.forEach(conflictCourse => {
                        if (document.getElementById(conflictCourse).backgroundColor === 'green') {
                            document.getElementById(conflictCourse).style.backgroundColor = 'red';
                        }
                    });
                    document.getElementById('conflict-list').textContent = conflictString;
                });
            });
            button.backgroundColor = 'green';
            button.style.backgroundColor = 'green';
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
            fetch(`/?courses=${courses}`)
            .then(response => response.json())
            .then(response => {
                let { conflictedCourses, conflictString } = response;
                Object.values(document.getElementsByClassName('squareOn')).forEach(selectedCourseButton => {
                    selectedCourseButton.backgroundColor = 'green';
                    selectedCourseButton.style.backgroundColor = 'green'
                });
                conflictedCourses.forEach(conflictCourse => {
                    if (document.getElementById(conflictCourse).backgroundColor === 'green') {
                        document.getElementById(conflictCourse).style.backgroundColor = 'red';
                    }
                });
                document.getElementById('conflict-list').textContent = conflictString;
            });
        }
    });
});

const resetButtonColors = () => {
    const courseButtons = Object.values(document.querySelectorAll('button')).filter(button => button.className === 'squareOn' || button.className === 'squareOff');
    Object.values(courseButtons).forEach(button => {
        button.backgroundColor = 'grey';
        button.style.backgroundColor = 'grey';
        button.style.border = 'solid black 1px';
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
window.onload = () => {
   Object.values(document.getElementsByClassName('student-button')).forEach(button => {
        students.push(button.textContent);
   });
}