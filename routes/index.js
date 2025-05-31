var express = require('express');
const {google} = require('googleapis');
const getConflicts = require('../helpers/getConflicts');
const parseClasses = require('../helpers/parseClasses');
const printSched = require('../helpers/printSched');
const permutations = require('../helpers/permutations');
const hasConflicts = require('../helpers/isConflict');
const possiblePaths = require('../helpers/possiblePaths');
var router = express.Router();

class Course {
  constructor(name, periods) {
      this.name = name;
      this.periods = periods;
      this.roster = [];
  }
}

class Student {
    constructor(name) {
        this.name = name;
        this.courses = [];
    }
}

router.get('/paths', (req, res) => {
    const sheets = google.sheets('v4');
    sheets.spreadsheets.values.get({
        spreadsheetId: '1Y2M_NX8f8nmf8Bj-W3bo8aat7ZMvC2cHTmOHV5H3yOg',
        range: 'A1:100000',
        key: 'AIzaSyCpijldE4DDH_fTsapnbzFUtYYCDwutZG4'
    }, (error, response) => {
        if (error || !response.data.values) {
            return console.log('The API returned an error: ' + error);
        }
        const schedules = response.data.values.flat();
        const courses = [];
        schedules.every(schedule => {
            const course = parseClasses(schedule);

            if (course instanceof Error) {
                document.getElementById('conflict-list').textContent = 'There was an error processing the data.';
                console.log('There was an error processing the data.');
                return false;
            }
            const addedCourse = courses.find(addedCourse => addedCourse.name === course.name);
            
            if (addedCourse) {
                addedCourse.periods.push(...course.periods);
            } else {
                courses.push(course);
            }

            return true;
        });

        courses.sort((a, b) => a.name > b.name ? 1 : -1);
        courses.map(course => {
            course.periods.map(section => {
                return section.sort((a, b) => {
                    return parseInt(a) - parseInt(b);
                });
            });
            return course.periods.sort((a, b) => {
                return parseInt(a[0]) - parseInt(b[0]);
            })
        });
        if (req.query.courses) {
            const queryCourses = req.query.courses.split(',');
            if (queryCourses.length > 12) {
                return;
            }
            const searchedCourses = courses.filter(course => queryCourses.includes(course.name));

            const noConflictPaths = possiblePaths(searchedCourses);

            return res.render('paths', { noConflictPaths, searchedCourses });
        }
        return res.render('paths');
    });

});

/* GET home page. */
router.get('/', function(req, res, next) {

    const sheets = google.sheets('v4');
    sheets.spreadsheets.values.get({
        spreadsheetId: '1Y2M_NX8f8nmf8Bj-W3bo8aat7ZMvC2cHTmOHV5H3yOg',
        range: 'A1:100000',
        key: 'AIzaSyCpijldE4DDH_fTsapnbzFUtYYCDwutZG4'
    }, (error, response) => {
        if (error || !response.data.values) {
            return console.log('The API returned an error: ' + err);
        }
        const schedules = response.data.values.flat();
        const courses = [];
        schedules.every(schedule => {
            const course = parseClasses(schedule);

            if (course instanceof Error) {
                document.getElementById('conflict-list').textContent = 'There was an error processing the data.';
                console.log('There was an error processing the data.');
                return false;
            }
            const addedCourse = courses.find(addedCourse => addedCourse.name === course.name);
            
            if (addedCourse) {
                addedCourse.periods.push(...course.periods);
            } else {
                courses.push(course);
            }

            return true;
        });


        courses.sort((a, b) => a.name > b.name ? 1 : -1);
        
        if (req.query.courses) {
            const queryCourses = req.query.courses.split(',');
            if (queryCourses.length > 12) {
                return;
            }
            const searchedCourses = courses.filter(course => queryCourses.includes(course.name));
            
            let conflictedCourses = getConflicts(searchedCourses);
            const flattenedArray = [].concat.apply([], conflictedCourses);
            conflictedCourses = [...new Set(flattenedArray)];

            return res.send({ conflictedCourses });
        }
        sheets.spreadsheets.values.get({
            spreadsheetId: '1EzicmqWRMe6K3hjRRyECsoWCalU_SxZJ6gdkf6NZuOU',
            range: 'A1:100000',
            key: 'AIzaSyCpijldE4DDH_fTsapnbzFUtYYCDwutZG4'
        }, (rosterError, rosterResponse) => {
            if (rosterError || !rosterResponse.data.values) {
                console.log('Error getting course roster');
                return;
            }
            const spreadSheetCourses = rosterResponse.data.values.flat();
            spreadSheetCourses.forEach(course => {
                let courseName = '';
                let setCourseConstant;
                let courseNameEntered = false;
                let passedAdd = false;
                let passedStudent = false;
                let students = [];
                let student = '';
                let over = false;
                [...course].forEach(letter => {
                    if (over) {
                        return;
                    }
                    if (letter === '.') {
                        courseNameEntered = true;
                        setCourseConstant = courses.find(course => course.name === courseName);
                        return;
                    }
                    if (!courseNameEntered) {
                        if (letter === '_') {
                            courseName += ' ';
                            return;
                        }
                        courseName += letter;
                        return;
                    }
                    if (!passedAdd && letter !== '(') {
                        return;
                    }
                    if (letter === '(') {
                        passedAdd = true;
                        return;
                    }
                    if (letter === ')') {
                        students.push(student.trim());
                        over = true;
                        return;
                    }
                    if (!passedStudent && letter !== ',') {
                        student += letter;
                        return;
                    }
                    if (letter === ',' || letter === ')' || (letter === ' ' && !passedStudent)) {
                        students.push(student.trim());
                        student = '';
                        passedStudent = true;
                        return;
                    }
                    if (letter === ' ' && passedStudent) {
                        passedStudent = false;
                    }
                });
                if (setCourseConstant) {
                    setCourseConstant.roster.push(...students);
                }
            });
            const students = new Set();
            const studentsName = new Set();
            courses.forEach(course => {
                course.roster.forEach(student => {
                    studentsName.add(student);
                    let alreadyIncluded = false;
                    students.forEach(includedStudent => {
                        if (includedStudent.name === student) {
                            alreadyIncluded = true;
                            return;
                        }
                    });
                    if (!alreadyIncluded) {
                        students.add(new Student(student));
                    }
                });
            });
            students.forEach(student => {
                courses.forEach(course => {
                    if (course.roster.includes(student.name) && !student.courses.includes(course)) {
                        student.courses.push(course);
                    }
                });
            });
            if (req.query.student) {
                const searchedStudent = [...students].find(student => student.name === req.query.student);
                const courseNames = searchedStudent.courses.map(course => course.name);
                return res.send({ courses: courseNames });
            }
            const sortedStudents = [...studentsName].sort((a, b) => {
                const firstStudentId = parseInt(a.substring(3));
                const secondStudentId = parseInt(b.substring(3));
                return firstStudentId - secondStudentId;
            });

            res.render('index', { courses, students: sortedStudents });
        });
    });
});

module.exports = router;