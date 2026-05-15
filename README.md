# PersonaMind 2.0: Naija Behavioral Modeling Engine

PersonaMind 2.0 is a specialized application designed to model user behavior and provide intelligent recommendations, specifically tailored for the Nigerian market. It leverages advanced AI to capture the linguistic nuances, value-driven critique, and cultural context of Nigerian consumers.

## 🚀 Architectural Design

The application follows a modern, full-stack reactive architecture, optimized for high-density data visualization and AI-driven insights.

### 1. High-Level Architecture
The system is built on a **Client-Side Intelligence** model, where the frontend manages state and user interactions while offloading behavioral reasoning to the **Google Gemini Pro** ecosystem via secure API calls.

### 2. Tech Stack
- **Frontend Framework**: React 19 (TypeScript)
- **Build Tool**: Vite
- **AI Engine**: Google Gemini 1.5 Flash (via `@google/genai` SDK)
- **Styling**: Tailwind CSS (with a custom Bento-Grid design system)
- **Animations**: Motion (React-native performance animations)
- **Iconography**: Lucide React

### 3. Core Logic Layers

#### A. User Modeling (Task A: "Naija Modeling")
The modeling engine analyzes the user's "Linguistic DNA." It looks at:
- **Lexical markers**: Use of Pidgin, Nigerian English, and localized slang.
- **Value baseline**: Nigerians are historically value-conscious; the model weights durability and "functional truth" over aesthetic fluff.
- **Tone matching**: Captures everything from "cynical techie" to "optimistic merchant."

#### B. Recommendation Engine (Task B: "Oga Recommendation")
Moving beyond basic keyword matching, this layer uses **Recursive Agentic Retrieval**:
1. **Psychographic Analysis**: Analyzes the active persona's bio and review history.
2. **Value Ranking**: Ranks candidate items (e.g., Solar Generators, Smart TVs) based on their utility in a local context (e.g., power stability, bandwidth efficiency).
3. **Reasoning Trace**: Provides a "Multiturn Reasoning Trace" explaining *why* a specific product fits the user's current "hustle."

### 4. Component Structure
- `src/App.tsx`: The primary Command Center managing global state, task routing, and the Bento-Grid layout.
- `src/services/geminiService.ts`: The bridge to the AI. It contains the specialized "Nigerian System Instructions" and handles JSON schema-based response parsing.
- `src/types.ts`: Strictly typed interfaces for `UserProfile`, `ItemMetadata`, and `SimulationResults`, ensuring consistency across the pipeline.
- `src/constants.ts`: A curated set of localized demo data featuring authentic Nigerian personas (e.g., Tunde the Tech Bro, Mama K from Onitsha).

### 5. Data Flow Lifecycle
1. **Persona Selection/Generation**: User selects a pre-set persona or generates a new one via a "Theme" input (e.g., "Abuja Lifestyle").
2. **Context Injection**: Additional contextual variables (e.g., "user is in traffic", "it's raining") are added to the prompt.
3. **AI Inference**: The Gemini model processes the profile, candidate list, and context through a "Nigerian Filter."
4. **Structured Response**: The API returns a validated JSON object containing the simulated review, match scores, and behavioral reasoning.
5. **Reactive Update**: The UI updates via `motion` transitions to show the ranked retrieval or simulated response.

## 🛠️ Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- A valid `GEMINI_API_KEY` in your environment.

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add your key:
   ```env
   GEMINI_API_KEY=your_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🔐 Security & Optimization
- **Z-Aware Typing**: All API responses are validated against TypeScript interfaces.
- **Reduced Latency**: Utilizing `gemini-1.5-flash` for high-speed simulations without sacrificing linguistic accuracy.
- **Bento Design**: The interface is optimized for both desktop precision and mobile accessibility.


