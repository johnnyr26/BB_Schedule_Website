class Course {
    constructor(name, periods) {
        this.name = name;
        this.periods = periods;
        this.roster = [];
    }
}

module.exports = schedule => {
    let pastParenthesis1 = false;
    let pastClassName = false;
    let className = '';
    let periods = [];
    for (let i = 0; i < schedule.length; i++) {
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
    if (periods.length === 0) {
        return new Error('The class data does not have any periods');
    }

    const course = new Course(className, [periods]);

    return course;
}