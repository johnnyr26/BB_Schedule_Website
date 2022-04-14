const permutations = require('./permutations');
const hasConflicts = require('./isConflict');

module.exports = courses => {
    const periods = courses.map(course => course.periods);

    const perms = permutations(periods, [[]])
            
    const noConflictPerms = perms.filter(perm => !hasConflicts(perm));

    const noConflictPaths = noConflictPerms.map(perm => {
        return perm.map(section => {
            return {
                name: courses.find(course => course.periods.some(period => section === period)).name,
                section,
                periods: convertSectionsToPeriods(section)
            };
        });
    });

    noConflictPaths.map(path => {
        return path.sort((a, b) => {
            const aSection = a.section.map(period => parseInt(period));
            const bSection = b.section.map(period => parseInt(period));
            
            const lowerPeriodA = Math.min(...aSection);
            const lowerPeriodB = Math.min(...bSection);

            return lowerPeriodA - lowerPeriodB;
        });
    });

    return noConflictPaths;
}

const convertSectionsToPeriods = section => {
    return section.map(period => {
        return parseInt(period) % 2 === 1 ? `${Math.round(parseInt(period) / 2)}A` : `${Math.round(parseInt(period) / 2)}B`;
    });
}