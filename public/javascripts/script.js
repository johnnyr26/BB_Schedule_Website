document.getElementById('search-bar').addEventListener('keyup', e => {
    const searchResult = document.getElementById('search-bar').value;
    const allCourses = [];
    Object.values(document.querySelectorAll('button')).forEach(courseButton => {
        if (courseButton.textContent === 'Reset') {
            return;
        }
        allCourses.push(courseButton.textContent)
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

document.getElementById('reset').addEventListener('click', () => {
    resetButtonColors();
    resetClassNames();
    document.getElementById('conflict-list').textContent = '';
});

Object.values(document.getElementsByTagName('button')).forEach(button => {
    button.addEventListener('click', () => {
        if (button.className !== 'squareOn' && button.className !== 'squareOff') {
            return;
        }
        button.className = button.className === 'squareOff' ? 'squareOn' : 'squareOff';
        if (button.className === 'squareOff') {
            button.style.backgroundColor = 'grey';
            button.backgroundColor = 'grey';
        }
        const courses = [];
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
});

const resetButtonColors = () => {
    const courseButtons = Object.values(document.querySelectorAll('button')).filter(button => button.className === 'squareOn' || button.className === 'squareOff');
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