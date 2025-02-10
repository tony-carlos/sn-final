// app/api/users/route.js
// Example: Fetch a Firestore doc using the REST API
export async function GET() {
    const PROJECT_ID = 'serengetinexus25';
    const COLLECTION = 'users';
    const DOCUMENT_ID = '12345';
  
    // Construct the REST endpoint
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}/${DOCUMENT_ID}`;
  
    // Include an OAuth2 token or Firebase Auth token if needed for authentication
    // (You can get a custom token from a service account off-platform, or use
    // the "Firebase App Check" or "Firebase Auth" approaches. It's simpler if
    // your Firestore rules allow unauthenticated read, but that's rarely recommended.)
  
    // For demonstration, let's say we have a Bearer token in an env variable
    const token = process.env.FIREBASE_BEARER_TOKEN;
  
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,  // or any needed auth
      },
    });
  
    if (!resp.ok) {
      return new Response('Error fetching Firestore doc', { status: 500 });
    }
  
    const docData = await resp.json();
    return new Response(JSON.stringify(docData), { status: 200 });
  }
  