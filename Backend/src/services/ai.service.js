const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GEMINI_API_KEY
})

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("MUST follow this exact format: 'Approach:\n<what key points to cover and how to structure the answer>\n\nSample Answer:\n<a full, high-quality, first-person sample answer the candidate could say verbatim>'")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("MUST follow this exact format: 'Approach:\n<what key points to cover and how to structure the answer>\n\nSample Answer:\n<a full, high-quality, first-person sample answer the candidate could say verbatim>'")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        phaseNumber: z.number().describe("The phase number in the preparation plan, starting from 1"),
        phaseName: z.string().describe("The name of this phase, e.g., 'Core Fundamentals', 'Framework Deep-dive'"),
        durationEstimate: z.string().describe("The estimated time to complete this phase, e.g., '2-3 days', '1 week'"),
        focus: z.string().describe("The main focus of this phase, e.g., 'Closing key gaps in React architecture and learning Tailwind CSS v4'"),
        tasks: z.array(z.string()).describe("Detailed list of tasks, courses, practice problems, or documentation to read during this phase.")
    })).describe("A phase-based/milestone-based preparation plan for the candidate to follow sequentially to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated."),
})

const newQuestionsSchema = z.object({
    questions: z.array(z.object({
        question: z.string().describe("The technical or behavioral question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("MUST follow this exact format: 'Approach:\n<what key points to cover and how to structure the answer>\n\nSample Answer:\n<a full, high-quality, first-person sample answer the candidate could say verbatim>'")
    })).describe("List of 10 completely new questions")
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `Analyze the given resume, self-description, and job description to generate a comprehensive interview preparation report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        IMPORTANT INSTRUCTIONS:
                        1. You MUST generate at least 10 technicalQuestions.
                        2. You MUST generate at least 10 behavioralQuestions.
                        3. You MUST thoroughly compare the candidate's profile against the job description and identify ALL skill gaps. Do not limit the number; strictly list every single skill, tool, or qualification that is required for the job but missing from the candidate's profile. List only those skillgaps which are strictly required for that job. 
                        4. You MUST create a preparationPlan structured into sequential milestone phases (e.g. Phase 1, Phase 2, etc.) rather than rigid single days. Focus on creating 3 to 5 logical phases, each with a realistic durationEstimate based on the depth of the topics (e.g., '3-4 days', '1 week', 3 weeks) and clear focuses/tasks tailored to the candidate's skill gaps. Give duration of phase that actually a normal human need to complete that perticular task.
                        5. For EVERY question's answer field, you MUST use this exact two-section format:
                           Approach:
                           <Explain the key points and strategy to structure the answer>

                           Sample Answer:
                           <Write a full, first-person, high-quality answer the candidate could say word-for-word>
                        Do NOT leave any of these arrays empty in your response!
    `
    const response = await ai.models.generateContent({
        // model: "gemini-3-flash-preview",
        // model: "gemini-2.5-pro",
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),
        }
    })
    return JSON.parse(response.text)
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage"
        ]
    })
    try {
        const page = await browser.newPage()
        await page.setJavaScriptEnabled(false)
        await page.setContent(htmlContent, { waitUntil: "domcontentloaded" })
        const pdfBuffer = await page.pdf({
            format: "A4",
            margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" }
        })
        return pdfBuffer
    } finally {
        await browser.close()
    }
}

const resumeDataSchema = z.object({
    personalInfo: z.object({
        name: z.string().describe("Candidate's full name"),
        email: z.string().describe("Email address"),
        phone: z.string().describe("Phone number"),
        location: z.string().optional().describe("City, State or Country"),
        linkedin: z.string().optional().describe("LinkedIn profile URL"),
        github: z.string().optional().describe("GitHub profile URL"),
    }),
    careerObjective: z.string().describe("Professional/career objective summary"),
    education: z.array(z.object({
        degree: z.string().describe("Degree name, e.g. B.Tech – Information Technology"),
        institution: z.string().describe("School or University name"),
        location: z.string().optional().describe("City, State"),
        startDate: z.string().optional().describe("e.g. 2023"),
        endDate: z.string().optional().describe("e.g. 2027 or Present"),
        details: z.string().optional().describe("GPA, CGPA or percentage")
    })).optional(),
    experience: z.array(z.object({
        role: z.string().describe("Job title"),
        company: z.string().describe("Company name"),
        location: z.string().optional().describe("City, State"),
        startDate: z.string().optional().describe("e.g. Jun 2025"),
        endDate: z.string().optional().describe("e.g. Present"),
        bulletPoints: z.array(z.string()).describe("ATS-friendly bullet points of achievements")
    })).optional(),
    projects: z.array(z.object({
        title: z.string().describe("Project name"),
        technologies: z.array(z.string()).describe("Technologies used, e.g. React, Node.js"),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        bulletPoints: z.array(z.string()).describe("Detailed bullet points describing the project")
    })).optional(),
    skills: z.array(z.object({
        category: z.string().describe("Category, e.g. Languages, Tools"),
        items: z.array(z.string()).describe("List of skills in this category")
    })).optional(),
    additionalSections: z.array(z.object({
        title: z.string().describe("Section name, e.g. Certifications, Awards, volunteering"),
        bulletPoints: z.array(z.string()).describe("Items in this section")
    })).optional()
})

function renderResumeHtml(data) {
    const p = data.personalInfo || {}
    
    // Contact Info Bar
    const contactParts = []
    if (p.phone) contactParts.push(p.phone)
    if (p.email) contactParts.push(`<a href="mailto:${p.email}">${p.email}</a>`)
    if (p.location) contactParts.push(p.location)
    if (p.linkedin) {
        const displayLinkedin = p.linkedin.replace(/https?:\/\/(www\.)?/, "")
        contactParts.push(`<a href="${p.linkedin}" target="_blank">${displayLinkedin}</a>`)
    }
    if (p.github) {
        const displayGithub = p.github.replace(/https?:\/\/(www\.)?/, "")
        contactParts.push(`<a href="${p.github}" target="_blank">${displayGithub}</a>`)
    }
    const contactInfoHtml = contactParts.join(" | ")

    // Career Objective
    const objectiveHtml = data.careerObjective 
        ? `<div class="section">
            <div class="section-title">Career Objective</div>
            <p class="objective-text">${data.careerObjective}</p>
           </div>`
        : ""

    // Education
    let educationHtml = ""
    if (data.education && data.education.length > 0) {
        const items = data.education.map(edu => {
            const dateRange = [edu.startDate, edu.endDate].filter(Boolean).join(" – ")
            const locationStr = edu.location ? ` | ${edu.location}` : ""
            return `
                <div class="item">
                    <div class="item-header">
                        <span>${edu.degree}</span>
                        <span>${dateRange}</span>
                    </div>
                    <div class="item-subheader">
                        <span>${edu.institution}${locationStr}</span>
                        ${edu.details ? `<span>${edu.details}</span>` : ""}
                    </div>
                </div>
            `
        }).join("")
        educationHtml = `
            <div class="section">
                <div class="section-title">Education</div>
                ${items}
            </div>
        `
    }

    // Industrial Experience
    let experienceHtml = ""
    if (data.experience && data.experience.length > 0) {
        const items = data.experience.map(exp => {
            const dateRange = [exp.startDate, exp.endDate].filter(Boolean).join(" – ")
            const locationStr = exp.location ? ` | ${exp.location}` : ""
            const bullets = exp.bulletPoints.map(bp => `<li>${bp}</li>`).join("")
            return `
                <div class="item">
                    <div class="item-header">
                        <span>${exp.role} | ${exp.company}</span>
                        <span>${dateRange}</span>
                    </div>
                    ${locationStr ? `<div class="item-subheader"><span>${locationStr.replace(/^ \| /, "")}</span></div>` : ""}
                    <ul class="item-bullets">
                        ${bullets}
                    </ul>
                </div>
            `
        }).join("")
        experienceHtml = `
            <div class="section">
                <div class="section-title">Industrial Experience</div>
                ${items}
            </div>
        `
    }

    // Projects
    let projectsHtml = ""
    if (data.projects && data.projects.length > 0) {
        const items = data.projects.map(proj => {
            const dateRange = [proj.startDate, proj.endDate].filter(Boolean).join(" – ")
            const techStack = proj.technologies && proj.technologies.length > 0
                ? ` | ${proj.technologies.join(" · ")}`
                : ""
            const bullets = proj.bulletPoints.map(bp => `<li>${bp}</li>`).join("")
            return `
                <div class="item">
                    <div class="item-header">
                        <span>${proj.title}${techStack}</span>
                        <span>${dateRange}</span>
                    </div>
                    <ul class="item-bullets">
                        ${bullets}
                    </ul>
                </div>
            `
        }).join("")
        projectsHtml = `
            <div class="section">
                <div class="section-title">Projects</div>
                ${items}
            </div>
        `
    }

    // Skills
    let skillsHtml = ""
    if (data.skills && data.skills.length > 0) {
        const rows = data.skills.map(skillSet => `
            <div class="skills-row">
                <div class="skills-category">${skillSet.category}:</div>
                <div class="skills-items">${skillSet.items.join(", ")}</div>
            </div>
        `).join("")
        skillsHtml = `
            <div class="section">
                <div class="section-title">Skills & Certifications</div>
                <div class="skills-grid">
                    ${rows}
                </div>
            </div>
        `
    }

    // Additional Custom Sections
    let additionalHtml = ""
    if (data.additionalSections && data.additionalSections.length > 0) {
        additionalHtml = data.additionalSections.map(sec => {
            const bullets = sec.bulletPoints.map(bp => `<li>${bp}</li>`).join("")
            return `
                <div class="section">
                    <div class="section-title">${sec.title}</div>
                    <ul class="item-bullets">
                        ${bullets}
                    </ul>
                </div>
            `
        }).join("")
    }

    // Put everything together
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>${p.name || "Resume"}</title>
            <style>
                body {
                    font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                    color: #2D3748;
                    line-height: 1.4;
                    margin: 0;
                    padding: 0;
                    font-size: 10pt;
                }
                .container {
                    padding: 0;
                }
                .header {
                    text-align: center;
                    margin-bottom: 15px;
                }
                .name {
                    font-size: 20pt;
                    font-weight: 700;
                    margin: 0 0 5px 0;
                    text-transform: uppercase;
                    color: #1A202C;
                    letter-spacing: 0.5px;
                }
                .contact-info {
                    font-size: 8.5pt;
                    color: #4A5568;
                    margin: 0;
                }
                .contact-info a {
                    color: #4A5568;
                    text-decoration: none;
                }
                .section {
                    margin-bottom: 15px;
                    page-break-inside: avoid;
                }
                .section-title {
                    font-size: 11pt;
                    font-weight: 700;
                    text-transform: uppercase;
                    color: #1A202C;
                    border-bottom: 1px solid #CBD5E0;
                    padding-bottom: 3px;
                    margin: 0 0 8px 0;
                    letter-spacing: 0.5px;
                }
                .objective-text {
                    font-size: 9.5pt;
                    text-align: justify;
                    margin: 0;
                    color: #2D3748;
                }
                .item {
                    margin-bottom: 8px;
                    page-break-inside: avoid;
                }
                .item-header {
                    display: flex;
                    justify-content: space-between;
                    font-weight: 700;
                    font-size: 10pt;
                    color: #2D3748;
                    margin-bottom: 2px;
                }
                .item-subheader {
                    display: flex;
                    justify-content: space-between;
                    font-size: 9pt;
                    color: #4A5568;
                    margin-bottom: 4px;
                    font-style: italic;
                }
                .item-bullets {
                    margin: 0 0 6px 0;
                    padding-left: 20px;
                }
                .item-bullets li {
                    font-size: 9.5pt;
                    margin-bottom: 2px;
                    color: #2D3748;
                }
                .skills-grid {
                    display: table;
                    width: 100%;
                    font-size: 9.5pt;
                }
                .skills-row {
                    display: table-row;
                }
                .skills-category {
                    display: table-cell;
                    font-weight: 700;
                    width: 160px;
                    padding-bottom: 4px;
                    color: #2D3748;
                }
                .skills-items {
                    display: table-cell;
                    padding-bottom: 4px;
                    color: #2D3748;
                }
                @media print {
                    body {
                        font-size: 9.5pt;
                    }
                    .section {
                        page-break-inside: avoid;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 class="name">${p.name || ""}</h1>
                    <div class="contact-info">
                        ${contactInfoHtml}
                    </div>
                </div>
                
                ${objectiveHtml}
                ${educationHtml}
                ${experienceHtml}
                ${projectsHtml}
                ${skillsHtml}
                ${additionalHtml}
            </div>
        </body>
        </html>
    `
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const prompt = `You are an expert resume writer and ATS optimization specialist. 
                    Your task is to generate a professional, high-impact resume tailored for the target job description based on the candidate's details.

                    Candidate Details:
                    Resume Content: ${resume}
                    Self Description: ${selfDescription}
                    Target Job Description: ${jobDescription}

                    Instructions:
                    1. Tailor the content to highlight relevant experience, projects, and skills for the target job.
                    2. Maintain a highly professional, first-person tone.
                    3. Rewrite bullet points in work experience and projects to be action-oriented, starting with strong action verbs, and quantify achievements where possible.
                    4. Ensure all dates, degrees, companies, and project titles are extracted accurately.
                    5. Categorize skills logically (e.g. Languages, Frontend & Backend, Tools, Machine Learning) and list specific tools and technologies.
                    6. If the candidate has any other important sections like Certifications, volunteering, or awards, include them in the additionalSections array.
                    7. Output strictly as JSON matching the requested schema. Do not include any HTML formatting inside the text values.
                    `

    const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumeDataSchema),
        }
    })

    const jsonContent = JSON.parse(response.text)
    const compiledHtml = renderResumeHtml(jsonContent)

    const pdfBuffer = await generatePdfFromHtml(compiledHtml)
    return pdfBuffer
}

async function generateNewQuestions({ resume, selfDescription, jobDescription, existingQuestions, type }) {
    const existingQuestionsList = existingQuestions.map(q => q.question).join("\n- ");

    const prompt = `Act as an expert interviewer. We need 10 COMPLETELY NEW ${type} questions for a candidate. generate questions only for ${jobDescription}.
                    
                    Candidate Details:
                    Resume: ${resume}
                    Self Description: ${selfDescription}
                    Job Description: ${jobDescription}

                    DO NOT ASK ANY OF THE FOLLOWING EXISTING QUESTIONS:
                    - ${existingQuestionsList}

                    IMPORTANT INSTRUCTIONS:
                    1. Generate exactly 10 new ${type} questions.
                    2. Ensure they do not overlap conceptually with the existing questions provided above.
                    3. For each question, provide the intention and a comprehensive answer containing the approach and an exact sample answer.
    `
    const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(newQuestionsSchema),
        }
    })

    const result = JSON.parse(response.text)
    return result.questions
}

module.exports = { generateInterviewReport, generateResumePdf, generateNewQuestions }