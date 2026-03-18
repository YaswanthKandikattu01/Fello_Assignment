# AccountIQ: AI Account Intelligence System
**Fello AI Builder Hackathon**

---

## Slide 1: Transforming Raw Signals into Revenue

**The Problem:** Sales teams struggle with anonymous website traffic and incomplete account data, making it impossible to prioritize outreach effectively.

**Our Approach:** AccountIQ is an end-to-end, multi-agent AI system that ingests minimal inputs (like an IP address or company name) and orchestrates a pipeline to discover, enrich, and analyze the account.

**Key Features:**
*   **Visitor Identification:** IP-to-Company mapping and Domain research.
*   **Behavioral Inference:** Intent Scoring (1-10) and Persona classification based on URL pathways (`/demo` vs `/docs`).
*   **Automated Enrichment:** Custom technology stack detection via specialized web scrapers.
*   **Generative AI Synthesis:** Converts disparate signals into structured JSON featuring Business Signals, Leadership mapping, Talking Points, and Recommended Sales Actions using Gemini 2.0 Flash.

---

## Slide 2: System Architecture & The "AI Brain"

**The Architecture:**
A decoupled, low-latency stack built for scale:
1.  **React Frontend:** A premium, dark-mode glassmorphic UI representing the sales dashboard of the future.
2.  **Express Backend:** The orchestration layer managing parallel API tasks, caching, and rate-limiting.

**The Multi-Stage Pipeline in Action:**
1.  **Input:** Raw array of pages visited (`/pricing`, `/ai-sales-agent`) + Time On Site + IP Address.
2.  **Resolution:** Resolves `34.201.xxx.xxx` -> *Acme Mortgage*.
3.  **Inference:** Scoring engine detects High-Intent (Score: 8.5) and infers a "VP of Sales / RevOps Leader" persona.
4.  **Enrichment:** Scrapes `acmemortgage.com` to detect Salesforce, HubSpot, and React usage.
5.  **AI Intelligence (Gemini):** Merges all context into a prompt, returning actionable next steps like: *"Draft personalized email referencing Salesforce integration and AI sales automation ROI."*
