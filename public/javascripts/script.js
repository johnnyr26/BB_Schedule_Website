const students = [];
// zach schutzer is a great messenger
// whoever has to read this atrocity...just two words...my apologies

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

document.getElementById('reset').addEventListener('click', () => {
    resetButtonColors();
    resetClassNames();
    
    document.getElementById('conflict-list').textContent = '';
});

Object.values(document.getElementsByTagName('button')).forEach(button => {
    button.addEventListener('click', () => {
        if (!button.classList.contains('squareOn') && !button.classList.contains('squareOff')) {
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
                    if (document.getElementById(conflictCourse).backgroundColor === 'green') {
                        document.getElementById(conflictCourse).style.backgroundColor = 'red';
                    }
                    conflictString += `${conflictCourse}, `;
                });
                conflictString = conflictString.slice(0, -2);
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
        button.classList.remove('squareOn');
        button.classList.add('squareOff');
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
        button.classList.remove('squareOn');
        button.classList.add('squareOff');
    });
}