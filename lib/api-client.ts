// lib/api-client.ts

// This function centralizes fetching data from our own API routes.
// It's designed to be called from Server Components.
export async function fetchFromApi(endpoint: string) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const url = `${baseUrl}/api/${endpoint}`;
    console.log(url)
    try {
      const res = await fetch(url, {
        // Use a short cache lifetime for dynamic, user-specific data
        next: { revalidate: 60 }, 
      });
  
      if (!res.ok) {
        // The API route will return specific error messages and statuses
        const errorData = await res.json();
        throw new Error(errorData.error || `API error: ${res.status}`);
      }
  
      return await res.json();
    } catch (error) {
      console.error(`Failed to fetch from API endpoint: ${endpoint}`, error);
      // Return null or an empty array to prevent page crashes
      return null;
    }
  }