// /app/api/translate-deepl/route.js

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const { text, targetLang } = await request.json();

    if (!text || !targetLang) {
      return NextResponse.json({ error: 'Missing text or targetLang in request body' }, { status: 400 });
    }

    const url = 'https://api.deepl.com/v2/translate';

    const params = new URLSearchParams();
    params.append('auth_key', process.env.DEEPL_API_KEY);
    params.append('text', text);
    params.append('target_lang', targetLang);

    const response = await axios.post(url, params);

    const translatedText = response.data.translations[0].text;

    return NextResponse.json({ translatedText }, { status: 200 });
  } catch (error) {
    console.error('DeepL Translation Error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data || 'DeepL Translation Failed' },
      { status: 500 }
    );
  }
}
