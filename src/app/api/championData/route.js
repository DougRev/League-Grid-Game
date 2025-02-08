// src/app/api/championData/route.js

export async function GET(request) {
  try {
    const version = '13.14.1'; // or dynamically fetch the latest version if desired
    const url = `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`;
    const response = await fetch(url);
    const data = await response.json();
    
    // Optionally process data here (e.g., extract Object.values(data.data))
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Error fetching champion data' }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
