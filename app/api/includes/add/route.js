// /app/api/includes/add/route.js

import { NextResponse } from 'next/server';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
export async function POST(request) {
  try {
    const { label, value } = await request.json();

    if (!label || !value) {
      return NextResponse.json({ error: 'Missing label or value in request body' }, { status: 400 });
    }

    // Check if the include already exists
    const q = query(collection(db, 'includes_options'), where('value', '==', value));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return NextResponse.json({ error: 'Include option already exists' }, { status: 409 });
    }

    // Add new include option
    const docRef = await addDoc(collection(db, 'includes_options'), { label, value });

    return NextResponse.json({ success: true, id: docRef.id }, { status: 201 });
  } catch (error) {
    console.error('Add Include Error:', error);
    return NextResponse.json({ error: 'Failed to add include option' }, { status: 500 });
  }
}
