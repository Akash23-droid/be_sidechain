const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const GOOGLE_GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GOOGLE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

class ResumeModel {
  static async parseResume(file) {
    const { path, originalname } = file;
    let text = "";

    try {
      if (originalname.endsWith(".pdf")) {
        const dataBuffer = fs.readFileSync(path);
        text = (await pdfParse(dataBuffer)).text;
      } else if (originalname.endsWith(".docx")) {
        const result = await mammoth.extractRawText({ path });
        text = result.value;
      } else {
        throw new Error("Unsupported file format");
      }

      const skills = await this.extractSkillsWithDevicons(text);
      // console.log("skills : ", skills);
      const { projects, roles, jobDurations } =
        await this.extractAdditionalInfo(text);
      console.log({ skills, projects, roles, jobDurations });
      return { skills, projects, roles, jobDurations };
    } finally {
      if (fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
    }
  }

  static async extractSkillsWithDevicons(text) {
    const prompt = `
      Extract skills from the following resume text. For each skill, provide the skill name and suggest an appropriate Devicon class name. 
      Return the result as a JSON array of objects, where each object has 'name' and 'icon' properties. 
      The 'icon' should be a valid Devicon class name (e.g., 'devicon-javascript-plain' for JavaScript).
      If you're unsure about a specific Devicon class, use a general class like 'devicon-{skillname}-plain' or 'devicon-{skillname}-original'.
      Here's the resume text:

      ${text}

      Example of expected output format:
      [
        {"name": "JavaScript", "icon": "devicon-javascript-plain"},
        {"name": "Python", "icon": "devicon-python-plain"},
        {"name": "React", "icon": "devicon-react-original"}
      ]

      Return only the JSON array, without any additional text or formatting.
    `;

    const result = await model.generateContent(prompt);
    let skillsJson = result.response.text();

    try {
      skillsJson = skillsJson.replace(/```json\s*|\s*```/g, "").trim();
      return JSON.parse(skillsJson);
    } catch (error) {
      console.error("Error parsing skills JSON:", error);
      return [];
    }
  }

  static async extractAdditionalInfo(text) {
    const prompt = `
      Extract the following information from the resume text:
      1. Projects: List of projects with brief descriptions
      2. Roles: Job titles or roles held
      3. Job Durations: Start and end dates for each role

      Return the result as a JSON object with the following structure:
      {
        "projects": [
          { "name": "Project Name", "description": "Brief project description" }
        ],
        "roles": [
          { "title": "Job Title", "company": "Company Name" }
        ],
        "jobDurations": [
          { "role": "Job Title", "startDate": "YYYY-MM", "endDate": "YYYY-MM or Present" }
        ]
      }

      Here's the resume text:

      ${text}

      Return only the JSON object, without any additional text or formatting.
    `;

    const result = await model.generateContent(prompt);
    let infoJson = result.response.text();

    try {
      infoJson = infoJson.replace(/```json\s*|\s*```/g, "").trim();
      return JSON.parse(infoJson);
    } catch (error) {
      console.error("Error parsing additional info JSON:", error);
      return { projects: [], roles: [], jobDurations: [] };
    }
  }
}

module.exports = ResumeModel;

// const fs = require("fs");
// const pdfParse = require("pdf-parse");
// const mammoth = require("mammoth");
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// require("dotenv").config();

// const GOOGLE_GEMINI_API_KEY = "AIzaSyBB54gtuBwb3Sn8PsVJQgSckJL0OvWjq2I";
// console.log("GOOGLE_GEMINI_API_KEY : ", GOOGLE_GEMINI_API_KEY);
// const genAI = new GoogleGenerativeAI(GOOGLE_GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// class ResumeModel {
//   static async parseResume(file) {
//     const { path, originalname } = file;
//     let text = "";

//     try {
//       if (originalname.endsWith(".pdf")) {
//         const dataBuffer = fs.readFileSync(path);
//         text = (await pdfParse(dataBuffer)).text;
//       } else if (originalname.endsWith(".docx")) {
//         const result = await mammoth.extractRawText({ path });
//         text = result.value;
//       } else {
//         throw new Error("Unsupported file format");
//       }

//       const skills = await this.extractSkillsWithDevicons(text);
//       return { skills };
//     } finally {
//       if (fs.existsSync(path)) {
//         fs.unlinkSync(path);
//       }
//     }
//   }

//   static async extractSkillsWithDevicons(text) {
//     const prompt = `
//       Extract skills from the following resume text. For each skill, provide the skill name and suggest an appropriate Devicon class name.
//       Return the result as a JSON array of objects, where each object has 'name' and 'icon' properties.
//       The 'icon' should be a valid Devicon class name (e.g., 'devicon-javascript-plain' for JavaScript).
//       If you're unsure about a specific Devicon class, use a general class like 'devicon-{skillname}-plain' or 'devicon-{skillname}-original'.
//       Here's the resume text:

//       ${text}

//       Example of expected output format:
//       [
//         {"name": "JavaScript", "icon": "devicon-javascript-plain"},
//         {"name": "Python", "icon": "devicon-python-plain"},
//         {"name": "React", "icon": "devicon-react-original"}
//       ]

//       Return only the JSON array, without any additional text or formatting.
//     `;

//     const result = await model.generateContent(prompt);
//     let skillsJson = result.response.text();

//     try {
//       // Remove any markdown formatting or extra text
//       skillsJson = skillsJson.replace(/```json\s*|\s*```/g, "").trim();

//       const skills = JSON.parse(skillsJson);
//       return skills;
//     } catch (error) {
//       console.error("Error parsing skills JSON:", error);
//       console.error("Raw JSON string:", skillsJson);
//       return [];
//     }
//   }
// }

// module.exports = ResumeModel;
