# Loom Demo Recording Script (5-10 Minutes)

Here is a recommended script for your Fello AI Builder Hackathon submission video.

---

### Introduction (0:00 - 1:00)
1.  **Introduce Yourself:** "Hi, I'm [Your Name], and this is my submission for the Fello AI Builder Hackathon: AccountIQ."
2.  **The Problem:** "Sales teams face a massive data problem. They have anonymous website traffic but don't know who the visitor is, and they have company names but lack actionable intelligence to prioritize outreach."
3.  **The Solution:** "AccountIQ solves this by converting raw visitor signals and minimal company inputs into structured, AI-generated account intelligence and sales actions in real time."

### Architecture Overview (1:00 - 2:00)
1.  **Sys Design:** Briefly explain the tech stack. "This is a full-stack application. The frontend is built with React and Vite, featuring a premium dark-mode interface. The backend is Node/Express, and the orchestration layer handles parsing intent, inferring personas, and deep scraping for technology detection."
2.  **The AI Engine:** "The core brain of the system is powered by Google Gemini 2.0. It ingests the raw behavior logs and the scraped text to generate the final structured intelligence report."

### Demo 1: Visitor Signal Analysis (2:00 - 4:30)
1.  **Open 'Visitor Analysis':** Click on the `Visitor Analysis` tab.
2.  **Explain the Input:** "Let's say a visitor lands on our site. They have IP `34.201.100.50`, and they look at `/pricing`, `/case-studies`, and `/ai-sales-agent`. They've visited 3 times this week."
3.  **Use Quick Preset:** Click the "High-Intent Mortgage Lead" preset button to populate the fields to save time.
4.  **Analyze Structure:** Click "Analyze Visitor". Show the loading modal and explain what is happening under the hood (IP matching, Persona inference, Tech scraping, and Generation).
5.  **The Report:** Walk through the final report:
    *   **Intent Gauge:** Point out the High Intent score and explain *why* it scored high (e.g., pricing + case studies).
    *   **Persona Inference:** Show how the system deduced "VP of Sales / RevOps Leader" based purely on the `ai-sales-agent` and `pricing` pages.
    *   **Company Profile & Tech Stack:** Show the detected technologies (e.g., Salesforce, HubSpot).
    *   **Sales Action:** Read out the recommended AI action and talking points. Highlight how specific and actionable they are.

### Demo 2: Company Lookup & Batch Processing (4:30 - 7:00)
1.  **Company Lookup:** Go to the "Company Lookup" tab. Type in a real company (e.g., Google or a startup) and hit Analyze. Show that the tool works with minimal inputs—even just a name.
2.  **Batch Processing:** Navigate to the "Batch Processing" tab. Start the batch job to show how the system can scale to handle lists of companies for rapid pipeline enrichment.

### Conclusion (7:00 - End)
1.  **Recap:** "To recap, AccountIQ handles messy, missing data and automatically structures it into comprehensive intelligence, solving the core challenge for revenue teams."
2.  **Closing:** "Thank you for the opportunity to build this. Check out the Github repo for the code and instructions on running it locally."
