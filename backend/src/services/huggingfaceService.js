import axios from "axios";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

/* -------------------------- MAIN FUNCTION -------------------------- */

export const generateRecipeFromAI = async ({ ingredients, cuisine, diet }) => {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("Groq API key not configured");
  }

  const prompt = buildPrompt({ ingredients, cuisine, diet });

  try {
    const response = await axios.post(
      GROQ_URL,
      {
        model: "llama-3.1-8b-instant",

        messages: [
          {
            role: "system",
            content:
              "You are an expert chef. You must return ONLY valid JSON. Never cut off mid sentence. Never return incomplete output."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1200
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    const content = response.data?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Empty AI response");
    }

    return safeParseRecipe(content);

  } catch (err) {
    console.error("Groq error:", err.response?.data || err.message);
    throw err;
  }
};

/* -------------------------- PROMPT BUILDER -------------------------- */

function buildPrompt({ ingredients, cuisine, diet }) {
  const ingredientsText = Array.isArray(ingredients)
    ? ingredients.join(", ")
    : ingredients;

  return `
You are an expert chef and nutritionist.

Create ONE realistic, complete, home-cook friendly recipe.

USER INPUTS
- Available ingredients: ${ingredientsText || "any common pantry items"}
- Target cuisine style: ${cuisine || "any"}
- Diet preference: ${diet || "none"}

STRICT REQUIREMENTS:
1. Use the provided ingredients prominently.
2. Only add common pantry items (salt, oil, pepper, butter, flour, water).
3. Provide AT LEAST 5 fully complete, detailed cooking steps.
4. Never end instructions mid-sentence.
5. Include quantities in ingredients.
6. Cooking time and difficulty must match the steps.
7. Nutrition values must be realistic for ONE serving.

RETURN ONLY valid JSON in this exact structure:

{
  "title": "Recipe title",
  "ingredients": ["ingredient with quantity"],
  "instructions": ["1) step", "2) step"],
  "nutrition": {
    "calories": 500,
    "protein": "30g",
    "carbs": "50g",
    "fat": "20g"
  },
  "cookingTimeMinutes": 30,
  "difficulty": "Easy"
}
`;
}

/* -------------------------- SAFE JSON PARSER -------------------------- */

function safeParseRecipe(text) {
  const jsonMatch = text.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("AI response did not contain valid JSON");
  }

  let jsonString = jsonMatch[0]
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  let parsed;

  try {
    parsed = JSON.parse(jsonString);
  } catch (err) {
    console.error("JSON parsing failed:", jsonString);
    throw new Error("Invalid JSON from AI");
  }

  // 🔥 Basic validation to avoid incomplete recipe
  if (
    !parsed.title ||
    !Array.isArray(parsed.ingredients) ||
    !Array.isArray(parsed.instructions) ||
    parsed.instructions.length < 4
  ) {
    throw new Error("AI returned incomplete recipe");
  }

  return parsed;
}