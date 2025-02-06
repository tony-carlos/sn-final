// /app/api/translate/libretranslate/route.js
export const runtime = "edge"; // <-- Add this at the top

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const { text, targetLang } = await request.json();

    if (!text || !targetLang) {
      return NextResponse.json(
        { error: 'Missing text or targetLang in request body' },
        { status: 400 }
      );
    }

    const endpoint = process.env.LIBRETRANSLATE_ENDPOINT; // e.g., https://libretranslate.de/translate

    const response = await axios.post(
      endpoint,
      {
        q: text,
        source: 'en', // Assuming English source
        target: targetLang.toLowerCase(),
        format: 'text',
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const translatedText = response.data.translatedText;

    return NextResponse.json({ translatedText }, { status: 200 });
  } catch (error) {
    console.error('LibreTranslate Error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data || 'LibreTranslate Failed' },
      { status: 500 }
    );
  }
}
