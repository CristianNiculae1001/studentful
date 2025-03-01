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
                SELECT jsonb_object_keys(year_data) AS year, jsonb_array_elements(year_data->jsonb_object_keys(year_data)->'sem1') AS subject, 'sem1' AS semester FROM catalog_data
                UNION ALL
                SELECT jsonb_object_keys(year_data) AS year, jsonb_array_elements(year_data->jsonb_object_keys(year_data)->'sem2') AS subject, 'sem2' AS semester FROM catalog_data
            ),
            grades AS (
                SELECT 
                    jsonb_array_elements_text(subject->'note')::INTEGER AS grade, 
                    COALESCE(NULLIF(subject->>'credite', 'null')::INTEGER, 0) AS credits,
                    subject->>'name' AS subject_name,
                    semester,
                    year
                FROM subjects
            ),
            subject_averages AS (
                SELECT 
                    subject_name, 
                    ROUND(AVG(grade)::NUMERIC, 2) AS avg_grade
                FROM grades
                GROUP BY subject_name
            ),
            semester_averages AS (
                SELECT 
                    year,
                    semester, 
                    ROUND(AVG(grade)::NUMERIC, 2) AS avg_grade
                FROM grades
                GROUP BY year, semester
            ),
            grade_distribution AS (
                SELECT 
                    grade, 
                    COUNT(*) AS count
                FROM grades
                GROUP BY grade
            ),
            yearly_averages AS (
                SELECT 
                    year, 
                    ROUND(AVG(grade)::NUMERIC, 2) AS avg_grade
                FROM grades
                GROUP BY year
            ),
            percentage_growth AS (
                SELECT 
                    year, 
                    avg_grade,
                    LAG(avg_grade) OVER (ORDER BY year) AS prev_avg,
                    CASE 
                        WHEN LAG(avg_grade) OVER (ORDER BY year) IS NULL THEN NULL
                        ELSE ROUND((avg_grade - LAG(avg_grade) OVER (ORDER BY year)) / LAG(avg_grade) OVER (ORDER BY year) * 100, 2)
                    END AS growth_percentage
                FROM yearly_averages
            )
            SELECT 
                (SELECT COUNT(DISTINCT subject_name) FROM grades) AS total_subjects,
                (SELECT COALESCE(SUM(credits), 0) FROM grades) AS total_credits,
                (SELECT COALESCE(AVG(grade), 0) FROM grades) AS overall_average,
                (SELECT jsonb_agg(jsonb_build_object('subject', subject_name, 'average', avg_grade)) FROM subject_averages) AS subject_averages,
                (SELECT jsonb_agg(jsonb_build_object('year', year, 'semester', semester, 'average', avg_grade)) FROM semester_averages) AS semester_averages,
                (SELECT jsonb_agg(jsonb_build_object('grade', grade, 'count', count)) FROM grade_distribution) AS grade_distribution,
                (SELECT jsonb_agg(jsonb_build_object('year', year, 'average', avg_grade)) FROM yearly_averages) AS yearly_sparkline,
                (SELECT growth_percentage FROM percentage_growth ORDER BY year DESC LIMIT 1) AS last_year_growth;`,
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
                    gradeDistribution: [],
                    yearlySparkline: [],
                    lastYearGrowth: null
                },
            };
        }

        return {
            status: 1,
            data: {
                totalSubjects: result.rows[0].total_subjects || 0,
                totalCredits: result.rows[0].total_credits || 0,
                overallAverage: parseFloat(result.rows[0].overall_average) || 0,
                subjectAverages: result.rows[0].subject_averages || [],
                semesterAverages: result.rows[0].semester_averages || [],
                gradeDistribution: result.rows[0].grade_distribution || [],
                yearlySparkline: result.rows[0].yearly_sparkline || [],
                lastYearGrowth: result.rows[0].last_year_growth || 0
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

