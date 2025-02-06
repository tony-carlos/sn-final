// /app/api/translate/deepl/route.js
export const runtime = "edge"; // <-- Add this at the top

import axios from 'axios';

export async function POST(request) {
  try {
    const { text, targetLang } = await request.json();

    if (!text || !targetLang) {
      return new Response(
        JSON.stringify({ error: 'Missing text or target language.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const response = await axios({
      method: 'POST',
      url: 'https://api-free.deepl.com/v2/translate',
      params: {
        auth_key: process.env.DEEPL_API_KEY,
        text: text,
        target_lang: targetLang,
      },
    });

    const translatedText = response.data.translations[0].text;

    return new Response(
      JSON.stringify({ translatedText }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    if (error.response) {
      // The request was made, and the server responded with a status code
      console.error('DeepL API Error Response:', error.response.data);
      return new Response(
        JSON.stringify({ error: error.response.data.message || 'Translation failed' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    } else if (error.request) {
      // The request was made, but no response was received
      console.error('DeepL API No Response:', error.request);
      return new Response(
        JSON.stringify({ error: 'No response from DeepL API' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('DeepL API Error:', error.message);
      return new Response(
        JSON.stringify({ error: 'Translation failed' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
}
