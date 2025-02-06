// /app/api/tour-packages/[id].js

import { db } from '@/app/lib/firebase'; // Adjust the import path as necessary
import { doc, getDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  const { id } = req.query;
  
  if (req.method === 'GET') {
    try {
      const docRef = doc(db, 'tour-packages', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        res.status(200).json({ tourPackage: { id: docSnap.id, ...docSnap.data() } });
      } else {
        res.status(404).json({ error: 'Tour package not found' });
      }
    } catch (error) {
      console.error('Error fetching tour package:', error);
      res.status(500).json({ error: 'Failed to fetch tour package' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
