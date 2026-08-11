// Backend Utility to analyze skill match between user profile and job requirements

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

const normalizeSkill = (skill) => {
    if (!skill) return '';
    let cleaned = skill.trim().toLowerCase().replace(/[^a-z0-9+#.\s]/g, '');
    return TECH_SYNONYMS[cleaned] || cleaned;
};

export const extractSkills = (requirementsString) => {
    if (!requirementsString) return [];
    if (Array.isArray(requirementsString)) return requirementsString.map(s => s.trim()).filter(Boolean);
    
    return requirementsString
        .split(/[,;\n|/•\-]+/)
        .map(s => s.trim())
        .filter(s => s.length > 1);
};

export const calculateSkillMatch = (userSkills = [], jobRequirements = "", userBio = "") => {
    const reqSkills = extractSkills(jobRequirements);
    
    if (reqSkills.length === 0) {
        return {
            score: 100,
            matchLevel: "Excellent Fit",
            matchedSkills: userSkills || [],
            missingSkills: [],
            totalRequired: 0,
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

    if (!userSkills || userSkills.length === 0) {
        score = 0;
    }

    let matchLevel = "Low Fit";
    if (score >= 80) matchLevel = "Excellent Fit";
    else if (score >= 60) matchLevel = "Good Fit";
    else if (score >= 35) matchLevel = "Moderate Fit";

    return {
        score,
        matchLevel,
        matchedSkills,
        missingSkills,
        totalRequired: reqSkills.length,
    };
};
