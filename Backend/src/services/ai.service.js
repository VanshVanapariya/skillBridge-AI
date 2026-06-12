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

let browserInstance = null;

async function getBrowserInstance() {
    if (!browserInstance) {
        browserInstance = await puppeteer.launch({
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-web-security"
            ]
        });
    }
    return browserInstance;
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await getBrowserInstance();
    const page = await browser.newPage();

    // Disable JS execution to prevent script injection (SSRF/XSS)
    await page.setJavaScriptEnabled(false);

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await page.close(); // Close only the page (tab)
    return pdfBuffer;
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })

    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)
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
        model: "gemini-3-flash-preview",
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