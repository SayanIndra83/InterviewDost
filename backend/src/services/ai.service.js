import { GoogleGenAI, Type } from "@google/genai";
import puppeteer from "puppeteer"
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function generateInterviewReport({resume, selfDescription, jobDescription}){
    const prompt = `You are an expert technical recruiter and career coach. 
    Analyze the candidate with extreme honesty. If the resume lacks keywords from the Job Description, give a low ATS score. Do not sugarcoat skill gaps. 
    Based on the following information, generate a comprehensive interview report.

    IMPORTANT: For title, give the title of the job for which the interview report is generated. This will help the candidate to understand the context of the report better.
    CRITICAL INSTRUCTION FOR ANSWERS:
    For every "answer" field in technical and behavioral questions, DO NOT write what you expect the candidate to say. Instead, write a detailed guide for the candidate on HOW to answer the question effectively. Mention what points need to be covered, what approach to follow (e.g., the STAR method), and what pitfalls to avoid.

    Job Description: ${jobDescription}
    Resume: ${resume}
    Self Description: ${selfDescription}`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                temperature: 0,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        ATSscore: { type: Type.INTEGER },
                        technicalQuestions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    question: { type: Type.STRING },
                                    answer: { type: Type.STRING },
                                    intention: { type: Type.STRING }
                                },
                                required: ["question", "answer", "intention"]
                            }
                        },
                        behavioralQuestions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    question: { type: Type.STRING },
                                    answer: { type: Type.STRING },
                                    intention: { type: Type.STRING }
                                },
                                required: ["question", "answer", "intention"]
                            }
                        },
                        skillGaps: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    skill: { type: Type.STRING },
                                    severity: { type: Type.STRING, enum: ["low", "medium", "high"] }
                                },
                                required: ["skill", "severity"]
                            }
                        },
                        preparationPlan: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    day: { type: Type.INTEGER },
                                    focusArea: { type: Type.STRING },
                                    tasks: { 
                                        type: Type.ARRAY, 
                                        items: { type: Type.STRING } 
                                    }
                                },
                                required: ["day", "focusArea", "tasks"]
                            }
                        },
                        title: { type: Type.STRING }
                    },
                    required: ["ATSscore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan", "title"]
                }
            },
        });
    
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error generating interview report:", error);
        throw new Error("Failed to generate interview report");
    }
}

async function generatePdf({ htmlContent }) {
    let browser; // Declare here so the 'finally' block can reach it

    try {
        // Added server-safe args
        browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'] 
        });
        
        const page = await browser.newPage();
        
        // Load the HTML
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        
        // Generate the PDF
        const pdfBuffer = await page.pdf({ 
            format: 'A4',
            margin:{top: "20mm", right: "15mm", bottom: "20mm", left: "15mm"}, 
            printBackground: true 
        });
        
        return pdfBuffer;

    } catch (error) {
        console.error("Error generating PDF:", error);
        throw new Error("Failed to generate PDF");

    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

async function ResumePdf ({jobDescription, resume, selfDescription}){
    const prompt = `You are an expert technical recruiter and resume writer. 
    Your task is to rewrite and optimize the provided Resume and Self Description to perfectly align with the target Job Description, maximizing the ATS score.
    
    Rules for rewriting:
    1. Tailor the bullet points and summary to highlight skills matching the Job Description.
    2. Naturally integrate missing keywords from the Job Description IF they align with the candidate's Self Description or past experience.
    3. DO NOT hallucinate or invent jobs, degrees, or experiences the candidate does not have.
    4. Format the output as a beautiful, professional, one-page resume in HTML.
    5.Use semantic HTML and inject styling using INLINE CSS ONLY (no external stylesheets or <style> blocks) so it renders perfectly in Puppeteer.
    6. STRICT DESIGN CONSTRAINTS: The resume must be ultra-minimalist and highly ATS-friendly. Use ONLY black text on a white background. Do NOT use colored text, background colors, background shading, multiple columns, or complex layouts. Use standard professional fonts (e.g., Arial, Helvetica, Calibri). Keep borders strictly to simple, thin, bottom borders for section headers if necessary.
    
    Output strictly as a JSON object with a single key "html".
    The resume content should not sound like ai generated, but sound like real human-written resume.
    The resume should not be so legthy. It should be concise and to the point and should be at most 1 to 2 pages long when converted to PDF with including all relevent information that can increase the chance of getting an interview for the particular jobDescription.
    Job Description: ${jobDescription}
    Resume: ${resume}
    Self Description: ${selfDescription}`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                temperature: 0.2,
                responseMimeType: "application/json",
            },
        }
);

const jsonContent = JSON.parse(response.text);

const pdf = generatePdf({htmlContent: jsonContent.html})
return pdf;

    } catch (error) {
        console.error("Error generating HTML resume:", error);
        throw new Error("Failed to generate resume");
    }

    

}
export { generateInterviewReport , ResumePdf}