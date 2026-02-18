const GradeRange = require('../models/GradeRange');

/**
 * Calculate grade based on percentage and school's grade ranges
 */
const calculateGrade = async (percentage, schoolId) => {
    const gradeRanges = await GradeRange.find({ school: schoolId }).sort({ minPercentage: -1 });

    for (const range of gradeRanges) {
        if (percentage >= range.minPercentage && percentage <= range.maxPercentage) {
            return range.grade;
        }
    }

    return 'N/A';
};

/**
 * Calculate percentage
 */
const calculatePercentage = (obtained, total) => {
    if (total === 0) return 0;
    return parseFloat(((obtained / total) * 100).toFixed(2));
};

/**
 * Calculate weighted score
 */
const calculateWeightedScore = (marksObtained, maxMarks, weightagePercent) => {
    if (maxMarks === 0) return 0;
    return parseFloat(((marksObtained / maxMarks) * weightagePercent).toFixed(2));
};

module.exports = {
    calculateGrade,
    calculatePercentage,
    calculateWeightedScore
};
