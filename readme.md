# Node.js Resume Parser Backend

This is a Node.js backend for processing and analyzing resume data using the Google Gemini API. 
It accepts resume files in PDF or DOCX format, parses the content, and extracts useful information such as skills, technologies, projects, experience, and more.

## Features

- Resume file upload via the frontend (PDF, DOCX formats)
- Parsing resume data using Google Gemini API
- Extracting sections such as skills, education, work experience, projects, etc.
- API to expose parsed resume data for the frontend

## Environment Variables

Make sure to create a `.env` file in the root of the project and add the following environment variables:

GOOGLE_GEMINI_API_KEY=YOUR_GOOGLE_GEMINI_API_KEY

markdown
Copy code

Replace `YOUR_GOOGLE_GEMINI_API_KEY` with the actual API key you received from Google.

## Setup and Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (version >= 16.x.x)
- [npm](https://www.npmjs.com/) (version >= 7.x.x)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
Navigate to the project directory:

bash
Copy code
cd your-repo-name
Install the dependencies:

bash
Copy code
npm install
Create a .env file in the root directory and add your Google Gemini API key:

bash
Copy code
GOOGLE_GEMINI_API_KEY=YOUR_GOOGLE_GEMINI_API_KEY
Run the application:

bash
Copy code
npm start
The server will start on http://localhost:3000.