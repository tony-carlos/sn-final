// /app/api/translate/yandex/route.js

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

    const apiKey = process.env.YANDEX_TRANSLATE_API_KEY;
    const folderId = process.env.YANDEX_TRANSLATE_FOLDER_ID;
    const url = 'https://translate.api.cloud.yandex.net/translate/v2/translate';

    const response = await axios.post(
      url,
      {
        sourceLanguageCode: 'en', // Assuming English source
        targetLanguageCode: targetLang.toLowerCase(),
        texts: [text],
        folderId: folderId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const translatedText = response.data.translations[0].text;

    return NextResponse.json({ translatedText }, { status: 200 });
  } catch (error) {
    console.error('Yandex.Translate Error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data || 'Yandex.Translate Failed' },
      { status: 500 }
    );
  }
}
