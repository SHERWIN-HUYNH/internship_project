import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const token = cookies().get("access_token")?.value;
    const formData = await req.formData();
    
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    console.log('RUN 1')
    const flaskRes = await fetch(`${process.env.FLASK_API_URL}/posts`, 
        { headers: { Authorization: `Bearer ${token}` },
            method: "POST",
            body: formData,
        });
    console.log('FLASK RESPONSE:', {
      status: flaskRes.status,
      statusText: flaskRes.statusText,
    });

    const data = await flaskRes.json().catch(() => ({}));

    if (!flaskRes.ok) {
      console.log('FLASK ERROR RESPONSE:', data); // Debug lỗi từ Flask
      return NextResponse.json(
        { error: data.error || 'Failed to create post' },
        { status: flaskRes.status }
      );
    }
    
    return NextResponse.json(data, { status: flaskRes.status });

}