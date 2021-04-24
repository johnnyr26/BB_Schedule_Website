var express = require('express');
const fs = require('fs');
const getConflicts = require('../helpers/getConflicts');
var router = express.Router();

class Course {
  constructor(name, periods) {
      this.name = name;
      this.periods = periods;
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
        return res.send({ conflictedCourses, conflictString });
    }
    res.render('index', { courses: setCourses });
  });
});

module.exports = router;
