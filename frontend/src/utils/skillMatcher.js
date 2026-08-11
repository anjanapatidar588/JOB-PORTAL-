// Utility to analyze skill match between user profile and job requirements

const TECH_SYNONYMS = {
    'js': 'javascript',
    'ts': 'typescript',
    'react.js': 'react',
    'reactjs': 'react',
    'node.js': 'node',
    'nodejs': 'node',
    'express.js': 'express',
    'expressjs': 'express',
    'mongo': 'mongodb',
    'postgres': 'postgresql',
    'py': 'python',
    'nextjs': 'next.js',
    'vuejs': 'vue',
    'tailwind': 'tailwindcss',
    'aws': 'amazon web services',
    'gcp': 'google cloud',
    'cpp': 'c++',
};

/**
 * Normalizes a skill or term string for matching
 */
const normalizeSkill = (skill) => {
    if (!skill) return '';
    let cleaned = skill.trim().toLowerCase().replace(/[^a-z0-9+#.\s]/g, '');
    return TECH_SYNONYMS[cleaned] || cleaned;
};

/**
 * Parse job requirements text into discrete skills list
 */
export const extractSkills = (requirementsString) => {
    if (!requirementsString) return [];
    if (Array.isArray(requirementsString)) return requirementsString.map(s => s.trim()).filter(Boolean);
    
    return requirementsString
        .split(/[,;\n|/•\-]+/)
        .map(s => s.trim())
        .filter(s => s.length > 1);
};

/**
 * Calculate match metrics between user skills and job requirements
 */
export const calculateSkillMatch = (userSkills = [], jobRequirements = "", userBio = "") => {
    const reqSkills = extractSkills(jobRequirements);
    
    if (reqSkills.length === 0) {
        return {
            score: 100,
            matchLevel: "Excellent Fit",
            colorClass: "emerald",
            matchedSkills: userSkills || [],
            missingSkills: [],
            totalRequired: 0,
            recommendations: "You meet all stated job criteria!"
        };
    }

    const normUserSkills = new Set((userSkills || []).map(normalizeSkill));
    const bioText = (userBio || "").toLowerCase();

    const matchedSkills = [];
    const missingSkills = [];

    reqSkills.forEach(req => {
        const normReq = normalizeSkill(req);
        let isMatch = false;

        normUserSkills.forEach(uSkill => {
            if (uSkill === normReq || uSkill.includes(normReq) || normReq.includes(uSkill)) {
                isMatch = true;
            }
        });

        if (!isMatch && bioText.length > 0 && bioText.includes(normReq)) {
            isMatch = true;
        }

        if (isMatch) {
            matchedSkills.push(req);
        } else {
            missingSkills.push(req);
        }
    });

    const matchRatio = matchedSkills.length / Math.max(reqSkills.length, 1);
    let score = Math.round(matchRatio * 100);

    // If user has no skills filled in profile
    if (!userSkills || userSkills.length === 0) {
        score = 0;
    }

    let matchLevel = "Low Fit";
    let colorClass = "rose";
    if (score >= 80) {
        matchLevel = "Excellent Fit";
        colorClass = "emerald";
    } else if (score >= 60) {
        matchLevel = "Good Fit";
        colorClass = "blue";
    } else if (score >= 35) {
        matchLevel = "Moderate Fit";
        colorClass = "amber";
    } else {
        matchLevel = "Low Fit";
        colorClass = "rose";
    }

    let recommendations = "";
    if (missingSkills.length === 0) {
        recommendations = "Your profile matches all specified requirements for this position! Highlight your top project achievements when applying.";
    } else if (missingSkills.length <= 2) {
        recommendations = `Adding skills like ${missingSkills.slice(0, 2).join(" & ")} to your profile will significantly boost your fit score.`;
    } else {
        recommendations = `Consider learning or adding experience in ${missingSkills.slice(0, 3).join(", ")} to align closer with this role.`;
    }

    return {
        score,
        matchLevel,
        colorClass,
        matchedSkills,
        missingSkills,
        totalRequired: reqSkills.length,
        recommendations
    };
};
