# AlphaLens AI - Multi-Agent Investment Intelligence Platform

AlphaLens AI is a multi-agent investment research tool built with LangGraph.js and Node.js. It automates the process of gathering and auditing financial data, parsing market news, benchmarking competitors, and assessing downside risks. Instead of relying on a single generic LLM prompt, the system routes data through a structured pipeline of specialized AI agents that debate the bullish and bearish case for a stock before rendering a final investment verdict.

---

## Key Features

*   **State Graph Pipeline (LangGraph.js):** Orchestrates sequential agent steps in a predictable Directed Acyclic Graph (DAG) state.
*   **Audit Checks:** A dedicated validation agent audits financial outputs, catching missing metrics or contradictions before decisions are finalized.
*   **Bull vs Bear Debate:** Simulates a structured debate between a growth-oriented Bull agent and a risk-averse Bear agent to prevent bias.
*   **Ecosystem & Risk Benchmarking:** Evaluates competitive moats (switching costs, brand power) and categorizes risks across macroeconomic, financial, and regulatory domains.
*   **Style Personas:** Tailors verdicts based on user-selected styles: Value, Growth, Dividend, Aggressive, and Conservative.
*   **Structured Output:** Generates clean JSON payloads to map the scoring breakdown, risk registry, and portfolio asset allocation.
*   **Performance Caching:** Saves API costs and speeds up response times with a 10-minute in-memory caching layer.
*   **Interview Defense Mode:** Built-in annotations and explanation modules (like ELI15 - "Explain like I'm 15") designed to help defend metrics during code reviews or interviews.

---

## System Architecture & Agent Flow

The backend executes a Directed Acyclic Graph (DAG) using the following node-by-node sequence:

```
[START]
   │
   ▼
[Financial Agent] ──────────► Fetches core metrics from Yahoo Finance
   │
   ▼
[Data Validation Agent] ────► Audits numbers for sanity and completeness
   │
   ▼
[News Agent] ───────────────► Scrapes Google News RSS & scores sentiment
   │
   ▼
[Competition Agent] ────────► Benchmarks primary competitors & moats
   │
   ▼
[Risk Agent] ───────────────► Assesses financial, regulatory, and macro risks
   │
   ▼
[Market Intelligence] ──────► Analyzes sector trends and industry outlook
   │
   ▼
[Bull Analyst Node] ────────► Compiles the strongest possible long thesis
   │
   ▼
[Bear Analyst Node] ────────► Compiles the strongest possible downside thesis
   │
   ▼
[Judge Node] ───────────────► Synthesizes debate and renders structured verdict
   │
   ▼
[END]
```

---

## Setup & Running the Project

### Prerequisites
*   Node.js (v18 or higher)
*   npm (v9 or higher)
*   A Gemini API Key (from Google AI Studio)

### 1. Backend Setup (`server/`)
1. Change into the server directory:
    ```bash
    cd server
    ```
2. Install the backend dependencies:
    ```bash
    npm install
    ```
3. Create a `.env` file in the root of the `server/` directory and configure your keys:
    ```env
    PORT=5000
    GEMINI_API_KEY=your_gemini_api_key_here
    GEMINI_MODEL=gemini-2.5-flash
    NODE_ENV=development
    ```
4. Start the Express server:
    ```bash
    npm start
    ```
    *Note: If no `GEMINI_API_KEY` is provided, the backend automatically runs in **Offline Mock Mode**, serving high-fidelity mock data to let you explore the UI immediately.*

### 2. Frontend Setup (`client/`)
1. Change into the client directory:
    ```bash
    cd client
    ```
2. Install the frontend dependencies:
    ```bash
    npm install --legacy-peer-deps
    ```
3. Start the Vite development server:
    ```bash
    npm run dev
    ```
4. Open your browser and navigate to `http://localhost:5173`.

---

## Design Decisions & Trade-Offs

### LangGraph vs. Single Prompts
Using a single prompt for complex investment analysis often leads to context dilution, formatting failures, and confirmation bias where the LLM ignores negative metrics if it starts building a positive outlook. Dividing responsibilities among dedicated agents ensures:
*   The **Financial Agent** focuses purely on numbers.
*   The **Validation Agent** serves as an independent controller checking data quality.
*   The **Bull** and **Bear** agents are forced to make two distinct, high-fidelity arguments.
*   The **Judge Node** acts as the final committee to balance these arguments objectively.

### LLM Model Selection (Gemini 2.5 Flash)
We selected `gemini-2.5-flash` because it has native support for structured JSON schema outputs (`responseMimeType: "application/json"`), high context limits, fast inference speeds, and is highly cost-efficient under the developer free tier.

### Zero-Cost Scrapers & Data Pipeline
To avoid requiring paid third-party search APIs (like SerpAPI or Tavily) which carry severe rate limits and credential costs for users, we built:
*   An automated Google News RSS parser that pulls headlines and content snippets directly via XML.
*   An integration with `yahoo-finance2` that falls back to high-fidelity static baseline metrics if the public API crumb endpoint is rate-limited or fails.

---

## Example Run: Apple Inc. (AAPL)

We ran the pipeline for **Apple Inc. (AAPL)** using the **GROWTH** investment style. The full structured JSON response from the pipeline can be viewed in [server/aapl_run_output.json](file:///c:/Users/HP/Desktop/julyass/server/aapl_run_output.json).

### **Run Summary**
*   **Ticker:** AAPL (Apple Inc.)
*   **Persona:** GROWTH
*   **Verdict:** **BUY**
*   **Overall Score:** **84 / 100**
    *   *Financial Strength:* 22 / 25
    *   *Market Sentiment:* 18 / 20
    *   *Competitive Moat:* 19 / 20
    *   *Risks Resilience:* 12 / 20
    *   *News Sentiment:* 13 / 15
*   **Pipeline Confidence:** **89%**

### **Verdict Rationale**
Apple displays exceptional balance sheet stats with $104 billion in Free Cash Flow (FCF), a gross margin of 46.2%, and an outstanding Return on Equity (ROE) of 154%. While short-term liquidity is relatively tight (current ratio of 1.04) and leverage is moderate (D/E of 1.6), its massive FCF generation makes these risks highly manageable. The brand power and high switching costs of the iOS ecosystem provide a deep competitive moat. Geopolitical supply chain concentration in China and ongoing antitrust scrutiny are significant risks, but acceptable under a growth-oriented, aggressive strategy.

### **Asset Allocation Recommendation**
For a total portfolio of ₹100,000 under the growth strategy:
*   **AAPL Stock:** 25% (₹25,000)
*   **Equity Index ETFs:** 35% (₹35,000)
*   **Cash Reserves:** 30% (₹30,000)
*   **Short-Term Treasuries:** 10% (₹10,000)

---

## What I'd Improve With More Time

1.  **Parallel Agent Execution:** Currently, the LangGraph flow runs sequentially (`START -> Financial -> Validation -> News -> Competition -> Risk -> Market Intel -> Bull -> Bear -> Judge -> END`). In a production setting, the intermediate research agents (News, Competition, Risk, Market Intel) do not depend on each other and can execute concurrently (fan-out/fan-in) to reduce latency from ~120s down to ~30s.
2.  **Distributed Cache (Redis):** Replace the local, in-memory Node.js cache with a Redis cluster to persist data across backend restarts and support horizontal scaling.
3.  **Real-Time Search APIs:** Supplement the RSS news scraper with dedicated API engines (like Tavily or SearchApi) to retrieve formal analyst consensus filings and macroeconomic reports.
4.  **Interactive Conversation:** Implement a chatbot interface on the dashboard so users can follow up on the Judge Node's decision and drill down into specific data points.

---

## Interview Questions & Code Defense

*   **"How do you handle API rate-limiting or failures from Yahoo Finance?"**
    *   *Defense:* The services use robust fallbacks. If Yahoo Finance returns a rate-limit error, the controller catches the failure, loads a static high-fidelity baseline dataset for popular tickers (like AAPL or TSLA), and flags the data status as `PARTIAL` or `COMPLETED`. The Judge Node adjusts its overall confidence score downward if fallback data was used.
*   **"Why separate the Bull Analyst from the Bear Analyst nodes?"**
    *   *Defense:* LLMs naturally suffer from confirmation bias—once a model starts building a positive thesis, it tends to selectively filter out risk indicators. Separating the prompts into two distinct, opposing agents forces the LLM to generate high-conviction arguments for both sides. The Judge Node is then forced to weigh both analyses, mimicking a real-world investment committee.
*   **"Why not run everything in parallel in the Graph?"**
    *   *Defense:* While sequential graphs are slightly slower, they allow downstream agents to benefit from the context generated by upstream agents (e.g. the Validation Agent checks the Financial Agent's output, and the Bull/Bear Agents review the unified risk, competitor, and sentiment inputs). If we scale this up, we would run the independent research nodes in parallel and aggregate their outputs in a single merge node before initiating the Bull vs Bear debate.

---

## BONUS: LLM Chat Session Logs

As part of the development process, all interactions, prompts, tool outputs, and execution results were logged. You can review the step-by-step history directly in the root directory:
*   [chat_transcript.jsonl](file:///c:/Users/HP/Desktop/julyass/chat_transcript.jsonl): Token-optimized logs of the development conversation.
*   [chat_transcript_full.jsonl](file:///c:/Users/HP/Desktop/julyass/chat_transcript_full.jsonl): Untruncated transcript logs containing every prompt, response, and tool trace.
