// /app/api/translate-google/route.js

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const { text, targetLang } = await request.json();

    if (!text || !targetLang) {
      return NextResponse.json({ error: 'Missing text or targetLang in request body' }, { status: 400 });
    }

    const url = `https://translation.googleapis.com/language/translate/v2`;

    const params = {
      q: text,
      target: targetLang.toLowerCase(), // Google expects lowercase language codes
      format: 'text',
      key: process.env.GOOGLE_TRANSLATE_API_KEY,
    };

    const response = await axios.post(url, null, { params });

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
