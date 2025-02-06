// /app/api/tour-packages/index.js

import { db } from '@/app/lib/firebase'; // Adjust the import path as necessary
import { collection, getDocs } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const snapshot = await getDocs(collection(db, 'tour-packages'));
      const tourPackages = snapshot.docs.map(doc => ({
        id: doc.id, // Ensure 'id' is set to 'doc.id'
        ...doc.data(),
      }));
      res.status(200).json({ tourPackages });
    } catch (error) {
      console.error('Error fetching tour packages:', error);
      res.status(500).json({ error: 'Failed to fetch tour packages' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
