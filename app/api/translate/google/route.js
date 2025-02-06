// /app/api/translate/google/route.js

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

    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

    const response = await axios.post(url, {
      q: text,
      target: targetLang.toLowerCase(),
      source: 'en', // Assuming English source
      format: 'text',
    });

    const translatedText = response.data.data.translations[0].translatedText;

    return NextResponse.json({ translatedText }, { status: 200 });
  } catch (error) {
    console.error('Google Translate Error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data || 'Google Translate Failed' },
      { status: 500 }
    );
  }
}
