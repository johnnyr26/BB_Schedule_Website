var express = require('express');
const fs = require('fs');
const { set } = require('../app');
const getConflicts = require('../helpers/getConflicts');
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

/* GET home page. */
router.get('/', function(req, res, next) {
  let setCourses = [];
  fs.readFile('schedule.txt', 'utf8', (err, result) => {
    const schedules = result.split('\n').filter(course => course.length > 0);
    let classNames = [];
    let totalPeriods = [];
    schedules.forEach(schedule => {
      let pastParenthesis1 = false;
      let pastClassName = false;
      let className = '';
      const periods = [];
      for (let i = 0; i < schedule.length; i ++) {
          let letter = schedule[i];
          if (letter === ';' || letter === ')') {
              break;
          }
          if (letter === '(') {
              pastParenthesis1 = true;
              continue;
          }
          if (!pastParenthesis1) {
              continue;
          }
          if (!pastClassName) {
              if (letter === ',') {
                  classNames.push(className);
                  className = '';
                  pastClassName = true;
                  continue;
              }
              if (letter === '_') {
                  className += ' ';
                  continue;
              }
              className += letter;
              continue;
          } 
          if (letter === ' ') {
              continue;
          }
          let period = '';
          while (letter !== ',' && letter !== ')' && letter !== ';') {
              period += letter;
              letter = schedule[++i];
          }
          periods.push(period);
      }
      totalPeriods.push(periods);  
    });
    totalPeriods = totalPeriods.filter(period => period.length > 0);
    if (classNames.length !== totalPeriods.length) {
        document.getElementById('conflict-list').textContent = 'There was an error processing the data.';
        console.log('There was an error processing the data.');
        return;
    }
    let coursesArray= [];
    classNames = classNames.filter(course => course.length > 0);
    classNames.forEach((course, index) => {
        const periods = totalPeriods[index];
        const classCourse = new Course(course, periods);
        coursesArray.push(classCourse);
    });
    const uniqueCourses = new Set(classNames);
    uniqueCourses.forEach(className => {
        const coursesWithName = coursesArray.filter(course => course.name === className);
        let periods = coursesWithName.map(course => course.periods);
        periods = periods.map(JSON.stringify).reverse().filter((e, i, a) => {
          return a.indexOf(e, i + 1) === -1;
        }).reverse().map(JSON.parse);
        const newCourse = new Course(className, periods);
        setCourses.push(newCourse);
    });
    setCourses.sort((a, b) => a.name > b.name ? 1 : -1);
    if (req.query.courses) {
        const queryCourses = req.query.courses.split(',');
        const courses = setCourses.filter(course => queryCourses.includes(course.name));
        let conflictString = 'Conflicts: ';
        let conflictedCourses = getConflicts(courses);
        const flattenedArray = [].concat.apply([], conflictedCourses);
        conflictedCourses = [...new Set(flattenedArray)];
        conflictedCourses.forEach(conflictCourse => {
            conflictString += conflictCourse.name + ', ';
        });
        if (conflictString !== 'Conflicts: ') {
            conflictString = conflictString.slice(0, -2);
        } else {
            conflictString = '';
        }
        conflictedCourses = conflictedCourses.map(course => course.name);
        return res.send({ conflictedCourses, conflictString });
    }
    fs.readFile('roster.txt', 'utf-8', (err, response) => {
        const courses = response.split('\n').filter(course => course.length > 0);
        courses.forEach(course => {
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
                    setCourseConstant = setCourses.find(setCourse => setCourse.name === courseName);
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
                    return;
                }
            });
            if (setCourseConstant) {
                setCourseConstant.roster = students;
            }
        });
        const students = new Set();
        const studentsName = new Set();
        setCourses.forEach(course => {
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
            setCourses.forEach(course => {
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
        res.render('index', { courses: setCourses, students: studentsName });
    });
  });
});

module.exports = router;
