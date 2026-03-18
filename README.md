# AccountIQ - AI Account Intelligence & Enrichment System

AccountIQ is a comprehensive AI-powered system designed to solve the two biggest data problems facing sales and marketing teams: anonymous website visitors and incomplete company data.

By converting raw visitor signals and minimal company inputs into structured, actionable intelligence, AccountIQ enables revenue teams to identify high-intent accounts, understand their technology stack, and prioritize outreach.

![AccountIQ Dashboard](https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80) 
*(Illustrative banner)*

## 🚀 Key Features

*   **Visitor Signal Analysis:** Converts anonymous IP addresses and browsing behavior into enriched company profiles.
*   **Persona Inference Engine:** Analyzes the pages visited (e.g., `/pricing` vs `/api`) to determine the likely role, seniority, and department of the visitor.
*   **Multi-Signal Intent Scoring:** Evaluates session depth, frequency, and specific page activity to score buying intent (1-10) and classify the journey stage.
*   **Technology Stack Detection:** Custom web scraping pipeline that scans company domains to detect presence of CRMs, marketing automation, analytics, and frameworks.
*   **Generative AI Intelligence:** Uses Google Gemini (2.0 Flash) to synthesize all signals into a cohesive company profile, extracting business signals, leadership contacts, tailored talking points, and recommended sales actions.
*   **Batch Processing:** Bulk process multiple companies at once for rapid pipeline enrichment.

## 🏗 System Architecture & Design

AccountIQ is built with a modern, decoupled architecture focusing on speed, extensibility, and AI integration.

### Tech Stack
*   **Frontend:** React 18, Vite, custom responsive CSS (Glassmorphism & Dark Mode)
*   **Backend:** Express.js (Node.js)
*   **AI Engine:** Google Gemini AI (`@google/generative-ai`)
*   **Enrichment/Scraping:** Cheerio, Axios

### Pipeline Workflow
1.  **Identification Stage:** Receives Visitor IP or Company Name. Uses IP-to-Company mapping (simulated DB for demo) or generative research.
2.  **Behavioral Analysis:** Calculates intent scores and infers personas based on weighted page paths and session metrics.
3.  **Data Enrichment:** Scrapes the target domain's HTML, scripts, and headers to build a technology stack profile.
4.  **AI Synthesis:** Injects all collected data (behavior, tech stack, intent) into a structured prompt for Gemini.
5.  **Intelligence Generation:** Gemini returns a strictly typed JSON object containing leadership, business signals, talking points, and next steps.

*(Note: The system includes a graceful semantic fallback if no Gemini API key is provided, ensuring the prototype is always functional).*

## 💻 Getting Started (Running Locally)

To run the full end-to-end prototype on your local machine:

### Prerequisites
*   Node.js (v18 or higher)
*   NPM or Yarn
*   *(Optional)* Google Gemini API Key

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/ai-account-intelligence.git
    cd ai-account-intelligence
    ```

2.  **Install dependencies for both Client and Server:**
    ```bash
    npm run install:all
    ```

3.  **Configure Environment (Optional but recommended):**
    *   Create a `.env` file in the root directory.
    *   Add your Gemini API Key:
        ```env
        GEMINI_API_KEY=your_actual_api_key_here
        ```
    *(Alternatively, you can provide the API key directly through the UI via the sidebar Settings menu).*

4.  **Start the Application:**
    ```bash
    npm run dev
    ```
    *This uses `concurrently` to boot both the Express server on port 3001 and the Vite React app on port 5173.*

5.  **View the App:**
    Open your browser and navigate to `http://localhost:5173`

## 🧪 Testing the Prototype

1.  Navigate to **Visitor Analysis** in the sidebar.
2.  Click on one of the **Quick Presets** (e.g., "High-Intent Mortgage Lead").
3.  Click **Analyze Visitor**.
4.  Watch the multi-stage pipeline execute and generate the final Intelligence Report.
5.  Try **Company Lookup** to research specific companies individually.
6.  Try **Batch Processing** to queue multiple companies at once.

---
*Built for the Fello AI Builder Hackathon*
