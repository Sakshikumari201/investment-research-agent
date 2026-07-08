# AlphaLens AI - Multi-Agent Investment Intelligence Platform

**AlphaLens AI** is an enterprise-grade investment research platform powered by a multi-agent LangGraph system. It automates financial audits, sentiment analysis, competitive benchmarking, and macroeconomic verification to generate explainable, institutional-quality investment recommendations.

---

## 🚀 Overview & Key Features

AlphaLens AI replaces static, single-prompt AI models with a team of cooperative, specialized AI agents:

1. **Structured Stepper Timeline**: Animates execution steps as they complete in the backend, logging precise agent runtimes.
2. **Transparent Scoring Tree**: Transparently breaks down the overall score into modular metrics: Financial Strength (/25), Market Sentiment (/20), Competitive Moat (/20), Risk Resilience (/20), and News Sentiment (/15).
3. **Data Validation Audit**: A dedicated agent audits financial outputs to flag anomalies or missing data, reducing LLM hallucinations.
4. **Bull vs Bear AI Debate**: Simulates arguments between a growth-oriented Bull Analyst and a risk-off Bear Analyst before the Judge renders the final decision.
5. **AI Devil's Advocate**: Discloses the exact contrarian risks ("Why Not Buy?") for every recommendation.
6. **Portfolio Simulator**: Recommends customized asset allocations (e.g. out of ₹100,000) based on selected investment styles.
7. **Investment Personas**: Adjusts recommendation thresholds according to user preferences: Value, Growth, Dividend, Aggressive, and Conservative.
8. **Explain like I'm 15 (ELI15)**: Simplifies complicated financial jargon into simple block analogies.
9. **Interview Defense Mode**: Renders annotations and annotations to prepare developers to defend metrics during interviews.
10. **Dual Stock Comparison**: Benchmarks two companies side-by-side (e.g., TSLA vs NVDA) and outputs a detailed head-to-head verdict.
11. **Performance Caching**: In-memory cache layer with a 10-minute TTL to reduce API expenses.

---

## 🛠️ Architecture & Multi-Agent Flow

AlphaLens AI leverages a linear-and-parallel Directed Acyclic Graph (DAG) built with **LangGraph.js**:

```
[START]
   │
   ▼
[Supervisor] ──(Resolves Ticker symbol via Search)
   │
   ▼
[Financial Agent]
   │
   ▼
[Data Validation Agent]
   │
   ├───────────────────────────┬───────────────────────────┬───────────────────────────┐
   ▼                           ▼                           ▼                           ▼
[News Agent]         [Competition Agent]             [Risk Agent]       [Market Intelligence Agent]
   │                           │                           │                           │
   └───────────────────────────┼───────────────────────────┴───────────────────────────┘
                               ▼
                        [AI Debate Mode]
                         ├── Bull Analyst
                         └── Bear Analyst
                               │
                               ▼
                         [Judge Agent]
                               │
                               ▼
                            [END]
```

---

## ⚙️ Setup & Run Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- A **Gemini API Key** (from Google AI Studio)

### 1. Backend Setup (`server/`)
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on the template:
   ```env
   PORT=5000
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-1.5-flash
   NODE_ENV=development
   ```
4. Start the Express server:
   ```bash
   npm start
   ```
   *Note: If no `GEMINI_API_KEY` is supplied, the server launches in **Offline Mock Mode**, serving high-fidelity simulated responses so you can immediately explore the dashboard.*

### 2. Frontend Setup (`client/`)
1. Navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
4. Open your browser to: `http://localhost:5173`

---

## 🏛️ Architecture Decisions & Trade-Offs

### Why LangGraph instead of a Single Prompt?
A single LLM prompt suffers from context pollution, is prone to forgetting negative details, and often hallucinates when aggregating quantitative data with qualitative sentiment. 
By dividing responsibilities:
- **Financial Agent** focuses entirely on numbers.
- **Validation Agent** acts as an independent auditor.
- **Bull vs Bear Agents** work in opposition to check bias.
- **Judge Agent** balances both sides, resulting in significantly higher recommendation accuracy and explainability.

### Why Gemini 1.5/2.5 Flash?
We selected Gemini because it offers industry-leading speed, native structured JSON outputs (`responseMimeType: "application/json"`), a massive context window, and is highly cost-efficient compared to alternative models.

### Caching & Cost Strategy
To prevent redundant LLM and external API expenses, we implemented a 10-minute in-memory cache layer. If a user repeats a query (e.g. searching "Tesla" multiple times), AlphaLens AI serves the cached analysis instantly, notifying the user with a "Served from Cache - Last updated X minutes ago" banner.

### Data Security & Validation
Paid search APIs (like SerpAPI) require credential storage and carry rate limits. To make AlphaLens robust and zero-cost, we developed:
- An automated Google News XML RSS parser.
- Integration with the public Yahoo Finance search API for instant symbol resolution.
- Sanity checks in the Data Validation Agent to detect and report missing fields or statistical contradictions.

---

## 📚 Anticipated Interview Questions & Defense

*   **"How do you handle API failures from external feeds?"**
    *   *Defense:* The agents are designed with grace fallbacks. If the quote summary from Yahoo Finance fails, the Financial Agent packs the error message into a structured JSON payload and passes it along. The Validation Agent detects the partial state, tags it as `PARTIAL`, and the Judge Node decreases its overall confidence score while noting the data outage in the final report.
*   **"Why separate the Bull Analyst from the Bear Analyst?"**
    *   *Defense:* LLMs suffer from "confirmation bias" - if they start drafting a buy case, they tend to ignore risk signals. Separating them forces the LLM to generate two distinct, high-fidelity arguments. The Judge Node is then forced to review the best of both cases, simulating a real-world investment committee.
*   **"How would you scale this application to thousands of concurrent requests?"**
    *   *Defense:* We would move the caching layer from in-memory Node state to a distributed Redis cache. Additionally, we could run the parallel graph branches (News, Competition, Risk, Market Intelligence) asynchronously using serverless functions or worker threads, preventing Node's single-threaded event loop from blocking during intensive JSON parsers.

---

## 📊 Example Runs & Verdicts

The multi-agent pipeline was executed for **Apple Inc. (AAPL)** under the **GROWTH** investment persona. The full output response payload is saved in the repository at [server/aapl_run_output.json](file:///c:/Users/HP/Desktop/julyass/server/aapl_run_output.json).

### **AAPL Analysis Summary**
*   **Ticker/Company:** AAPL (Apple Inc.)
*   **Investment Persona:** GROWTH
*   **Final Decision:** **BUY**
*   **Overall Score:** **84 / 100**
    *   *Financial Strength:* 22 / 25
    *   *Market Sentiment:* 18 / 20
    *   *Competitive Moat:* 19 / 20
    *   *Risks Resilience:* 12 / 20
    *   *News Sentiment:* 13 / 15
*   **Confidence Score:** **89%**
*   **Judge's Rationale:** Apple's financial foundation is exceptionally robust, characterized by a staggering $104B in Free Cash Flow, high margins (Gross: 46.2%, Operating: 30.7%), and an outstanding 154% Return on Equity. The brand equity and switching costs within the iOS ecosystem provide a deep moat. While high-severity risks like antitrust investigations and supply chain concentration in China are present, they are acceptable under the aggressive GROWTH persona.
*   **Recommended Asset Allocation (out of ₹100,000):**
    *   **AAPL Stock:** 25% (₹25,000)
    *   **Equity Index ETFs:** 35% (₹35,000)
    *   **Cash Reserves:** 30% (₹30,000)
    *   **Short-Term Treasuries:** 10% (₹10,000)

---

## 🔮 What We Would Improve With More Time

1. **Parallel Node Execution (Fan-Out/Fan-In):** Currently, the graph executes sequentially (`START -> Financial -> Validation -> News -> Competition -> Risk -> Market Intel -> Bull -> Bear -> Judge -> END`). Since intermediate agents (News, Competition, Risk, Market Intel) do not depend on one another, they could run in parallel to reduce latency from ~129s to ~30s.
2. **Distributed Caching (Redis):** Transition from the current in-memory JS cache to Redis to allow cache persistence across server restarts and support horizontal scaling.
3. **Advanced Web Retrieval APIs:** Integrate dedicated APIs (like Tavily or SearchApi) to fetch deeper real-time financial filings and analyst reports, supplementing the Google News XML parser.
4. **Interactive Chatbot Interface:** Implement a conversational interface on the frontend, allowing users to query the Judge Agent directly about specific aspects of the investment report.

---

## 💬 BONUS: LLM Chat Session Transcripts & Logs

This project was built using agentic AI, with continuous chat sessions and automated tool executions. The complete logs of this session are included in the root directory:
*   [chat_transcript.jsonl](file:///c:/Users/HP/Desktop/julyass/chat_transcript.jsonl): Token-optimized logs of the development conversation.
*   [chat_transcript_full.jsonl](file:///c:/Users/HP/Desktop/julyass/chat_transcript_full.jsonl): Full, untruncated transcript logs containing every single prompt, LLM response, and tool execution history.
