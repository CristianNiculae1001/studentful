import db from '../../db/connection';
import logger from '../../helpers/winston';

export const getLastNote = async (user_id: string) => {
    try {
        const result = await db.table('note').select('*').where({user_id}).limit(1).orderBy('created_at', 'desc');
        if(!result) {
            return {
                status: 0,
                data: null,
            };
        }
        return {
            status: 1,
            data: result
        };
    } catch (error) {
        logger.error(error);
        return {
            status: 0,
            message: error,
        };
    }
};

export const getLastLink = async (user_id: string) => {
    try {
        const result = await db.table('link').select('*').where({user_id}).limit(1).orderBy('created_at', 'desc');
        if(!result) {
            return {
                status: 0,
                data: null,
            };
        }
        return {
            status: 1,
            data: result
        };
    } catch (error) {
        logger.error(error);
        return {
            status: 0,
            message: error,
        };
    }
};

export const getCatalogStats = async (user_id: string) => {
    try {
        const result = await db.raw(
            `WITH catalog_data AS (
                SELECT jsonb_array_elements(data) AS year_data
                FROM catalog
                WHERE user_id = ?
            ),
            subjects AS (
                SELECT jsonb_object_keys(year_data) AS year, 
                       jsonb_array_elements(year_data->jsonb_object_keys(year_data)->'sem1') AS subject, 
                       'sem1' AS semester 
                FROM catalog_data
                UNION ALL
                SELECT jsonb_object_keys(year_data) AS year, 
                       jsonb_array_elements(year_data->jsonb_object_keys(year_data)->'sem2') AS subject, 
                       'sem2' AS semester 
                FROM catalog_data
            ),
            raw_grades AS (
                SELECT 
                    subject->>'name' AS subject_name,
                    semester,
                    year,
                    subject->'note' AS notes,
                    subject->'puncte' AS points,
                    COALESCE(NULLIF(subject->>'credite', 'null')::INTEGER, 0) AS credits
                FROM subjects
            )
            SELECT 
                (SELECT COUNT(DISTINCT subject_name) FROM raw_grades) AS total_subjects,
                (SELECT jsonb_agg(jsonb_build_object('subject', subject_name, 'notes', notes, 'points', points, 'credits', credits, 'semester', semester, 'year', year)) FROM raw_grades) AS subject_data;`,
            [user_id]
        );

        if (!result || result.rowCount === 0) {
            return {
                status: 0,
                data: {
                    totalSubjects: 0,
                    totalCredits: 0,
                    overallAverage: 0,
                    subjectAverages: [],
                    semesterAverages: [],
                    yearlySparkline: [],
                    gradeDistribution: [],
                    lastYearGrowth: null
                },
            };
        }

        const { total_subjects, subject_data } = result.rows[0];

        let subjects = [];
        if (subject_data) {
            subjects = typeof subject_data === "string" ? JSON.parse(subject_data) : subject_data;
        }

        let totalEarnedCredits = 0;
        let totalCredits = 0;
        let totalSum = 0;
        let totalGrades = 0;
        const subjectAverages: { subject: string; average: number }[] = [];
        const semesterAverages: { year: string; semester: string; average: number }[] = [];
        const yearlySparkline: { year: string; average: number }[] = [];
        const gradeCounts: Record<number, number> = {};

        const semesterData: Record<string, { sum: number; count: number }> = {};
        const yearlyData: Record<string, { sum: number; count: number }> = {};

        subjects.forEach((row: any) => {
            const subjectName = row.subject;
            const notes = typeof row.notes === "string" ? JSON.parse(row.notes) : row.notes;
            const points = typeof row.points === "string" ? JSON.parse(row.points) : row.points;
            const credits = row.credits || 0;
            const year = row.year;
            const semester = row.semester;

            totalCredits += credits;

            if (!Array.isArray(notes) || notes.length === 0) return;

            let average = 0;

            if (Array.isArray(points) && points.length === notes.length) {
                let totalWeightedSum = 0;
                let totalWeights = 0;

                for (let i = 0; i < notes.length; i++) {
                    const nota = notes[i];
                    const weight = points[i] / 10;
                    totalWeightedSum += nota * weight;
                    totalWeights += weight;
                }

                average = totalWeightedSum;
            } else {
                const sum = notes.reduce((acc, curr) => acc + curr, 0);
                average = sum / notes.length;
            }

            average = parseFloat(average.toFixed(2));

            if(average >= 5) {
                totalEarnedCredits += (credits ?? 0);
            }

            subjectAverages.push({ subject: subjectName, average });

            totalSum += average;
            totalGrades++;

            const semesterKey = `${year}_${semester}`;
            if (!semesterData[semesterKey]) semesterData[semesterKey] = { sum: 0, count: 0 };
            semesterData[semesterKey].sum += average;
            semesterData[semesterKey].count++;

            if (!yearlyData[year]) yearlyData[year] = { sum: 0, count: 0 };
            yearlyData[year].sum += average;
            yearlyData[year].count++;

            notes.forEach((note) => {
                if (!gradeCounts[note]) gradeCounts[note] = 0;
                gradeCounts[note]++;
            });
        });

        for (const key in semesterData) {
            const [year, semester] = key.split("_");
            const { sum, count } = semesterData[key];
            semesterAverages.push({
                year,
                semester,
                average: parseFloat((sum / count).toFixed(2)),
            });
        }

        for (const year in yearlyData) {
            const { sum, count } = yearlyData[year];
            yearlySparkline.push({
                year,
                average: parseFloat((sum / count).toFixed(2)),
            });
        }

        let lastYearGrowth = null;
        if (yearlySparkline.length > 1) {
            const sortedYears = yearlySparkline.sort((a, b) => a.year.localeCompare(b.year));
            const latest = sortedYears[sortedYears.length - 1].average;
            const previous = sortedYears[sortedYears.length - 2].average;
            lastYearGrowth = parseFloat((((latest - previous) / previous) * 100).toFixed(2));
        }

        const gradeDistribution = Object.entries(gradeCounts).map(([grade, count]) => ({
            grade: parseInt(grade),
            count,
        }));

        const overallAverage = totalGrades > 0 ? parseFloat((totalSum / totalGrades).toFixed(2)) : 0;

        return {
            status: 1,
            data: {
                totalSubjects: total_subjects || 0,
                totalCredits: totalCredits,
                totalEarnedCredits,
                overallAverage,
                subjectAverages,
                semesterAverages,
                yearlySparkline,
                gradeDistribution,
                lastYearGrowth,
            },
        };
    } catch (error) {
        logger.error(error);
        return {
            status: 0,
            message: error,
        };
    }
};
