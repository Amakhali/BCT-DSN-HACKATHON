import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, ItemMetadata, SimulationResult, RecommendationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `
You are a highly advanced User Modeling Agent. Your task is to deeply analyze a user's behavioral history, writing style, and preferences to simulate how they would review a specific new item.

CRITICAL DIRECTIVES:
1. CAPTURE TONE: Match the user's vocabulary, sentence length, and emotional expression.
2. RATING BEHAVIOR: Observe if the user is a "harsh grader" or "generous reviewer".
3. CONTEXTUAL NUANCE: Integrate how the specific item features interact with the user's known preferences.
4. AUTHENTICITY: Do not be generic. If the user is cynical, be cynical. If the user is enthusiastic about specific details (e.g., lighting in restaurants), focus on those.

Your output must be a valid JSON object containing:
- rating: (number 1-5)
- review: (string, the simulated written review)
- reasoning: (string, an explanation of why this specific model chose this rating and tone)
`;

export async function generatePersona(theme: string): Promise<UserProfile> {
  const prompt = `Generate a unique and detailed user profile for a review simulation app based on the theme: "${theme}".
  
  The profile must include:
  - name: A clever name or handle.
  - bio: A short biography describing their personality and review philosophy.
  - traits: 3-4 keywords representing their behavior.
  - history: 2-3 sample reviews they have written in the past (include itemName, rating 1-5, and detailed review content).
  
  Make the personality distinct and avoid generic archetypes.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are a creative writer specializing in character profiles. Output valid JSON matching the UserProfile interface.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            bio: { type: Type.STRING },
            traits: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            history: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  itemName: { type: Type.STRING },
                  rating: { type: Type.NUMBER },
                  content: { type: Type.STRING }
                },
                required: ["itemName", "rating", "content"]
              }
            }
          },
          required: ["name", "bio", "traits", "history"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    return {
      ...data,
      id: Date.now().toString(), // Just in case we need a profile ID
    };
  } catch (error) {
    console.error("Persona generation failed:", error);
    throw new Error("Failed to generate persona.");
  }
}

export async function getRecommendations(
  profile: UserProfile,
  candidates: ItemMetadata[],
  context: string = ""
): Promise<RecommendationResult> {
  const prompt = `
USER PROFILE:
- Name: ${profile.name}
- Bio: ${profile.bio}
- Traits: ${profile.traits.join(", ")}
- Review History:
${profile.history.map(r => `  * [${r.rating} stars] ${r.itemName}: "${r.content}"`).join("\n")}

CANDIDATE ITEMS:
${candidates.map((item, i) => `
[Item ${i}]
- Name: ${item.name}
- Category: ${item.category}
- Description: ${item.description}
- Features: ${item.features.join(", ")}
`).join("\n")}

ADDITIONAL CONTEXT:
${context}

TASK:
1. ANALYZE: Reason about the user's core values, recurring complaints, and what actually "sparks joy" for them.
2. RECOMMEND: Rank the best fits from the candidate list.
3. EXPLAIN: For each recommendation, provide a nuanced justification.

Output must be a valid JSON object:
- analysis: (string, your step-by-step reasoning about the user's needs)
- recommendations: Array of {
    rank: number,
    itemName: string,
    matchScore: number (0-100),
    reasoning: string
  }
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are an Elite Recommendation Agent. You use deep behavioral analysis to perform 'conversational retrieval'—finding the perfect item even with complex user signals.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  rank: { type: Type.NUMBER },
                  itemName: { type: Type.STRING },
                  matchScore: { type: Type.NUMBER },
                  reasoning: { type: Type.STRING },
                },
                required: ["rank", "itemName", "matchScore", "reasoning"],
              },
            },
          },
          required: ["analysis", "recommendations"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    
    // Map back to our full ItemMetadata
    const mappedRecs = data.recommendations.map((rec: any) => {
      const item = candidates.find(c => c.name === rec.itemName) || candidates[0];
      return {
        item,
        reasoning: rec.reasoning,
        matchScore: rec.matchScore,
      };
    });

    return {
      analysis: data.analysis,
      recommendations: mappedRecs,
    };
  } catch (error) {
    console.error("Recommendation failed:", error);
    throw new Error("Failed to generate recommendations.");
  }
}

export async function simulateUserReview(
  profile: UserProfile,
  item: ItemMetadata,
  context: string = ""
): Promise<SimulationResult> {
  const prompt = `
USER PROFILE:
- Name: ${profile.name}
- Bio: ${profile.bio}
- Traits: ${profile.traits.join(", ")}
- Review History:
${profile.history.map(r => `  * [${r.rating} stars] ${r.itemName}: "${r.content}"`).join("\n")}

TARGET ITEM:
- Name: ${item.name}
- Category: ${item.category}
- Description: ${item.description}
- Features: ${item.features.join(", ")}

ADDITIONAL CONTEXT:
${context}

Simulate the user's review for this target item.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rating: { type: Type.NUMBER },
            review: { type: Type.STRING },
            reasoning: { type: Type.STRING },
          },
          required: ["rating", "review", "reasoning"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    return {
      rating: data.rating || 3,
      review: data.review || "No review generated.",
      reasoning: data.reasoning || "No reasoning provided.",
    };
  } catch (error) {
    console.error("Simulation failed:", error);
    throw new Error("Failed to simulate user review.");
  }
}
