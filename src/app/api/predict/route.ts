// app/api/predict/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { bathrooms, bedrooms, sqft, region } = await request.json();

  // forward to your local R/Plumber server
  const rRes = await fetch(
    "https://rent-prediction-3183c6426934.herokuapp.com/predict",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bathrooms, bedrooms, sqft, region: region }),
    }
  );

  if (!rRes.ok) {
    return NextResponse.json(
      { error: `R server returned ${rRes.status}` },
      { status: 502 }
    );
  }

  const data = await rRes.json();
  return NextResponse.json(data);
}
