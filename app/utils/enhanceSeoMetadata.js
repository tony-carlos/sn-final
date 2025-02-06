// app/utils/enhanceSeoMetadata.js

"use server"; // If using Next.js 13 server components

import { Configuration, OpenAIApi } from "openai";

/**
 * Initialize OpenAI API with your API key.
 * Ensure that the OPENAI_API_KEY is set in your environment variables.
 */
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

/**
 * Generates SEO-friendly metadata based on provided content.
 *
 * @param {string} content - The content to generate metadata for.
 * @returns {Promise<string>} - The generated SEO metadata.
 */
export async function generateSeoMetadata(content) {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Generate SEO-friendly metadata (title and description) for the following content:\n\n${content}`,
      max_tokens: 150,
      temperature: 0.7,
    });

    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error("Error generating SEO metadata:", error);
    throw new Error("Failed to generate SEO metadata.");
  }
}
