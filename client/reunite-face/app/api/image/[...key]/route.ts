// // File: app/api/image/[key]/route.ts
// import { NextResponse, NextRequest } from "next/server";
// import { S3 } from "@aws-sdk/client-s3";

// export async function GET(req: NextRequest, { params }: { params: { key: string } }) {
//   const s3Client = new S3({
//     region: process.env.AWS_REGION,
//     credentials: {
//       accessKeyId: process.env.AWS_ACCESS_KEY!,
//       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//     },
//   });
//   console.log('BUCKET NAME',process.env.AWS_BUCKET_NAME)
//   const bucketName = process.env.AWS_BUCKET_NAME;
//   const s3Key = params.key; // Use the key directly
//   const s3Params = { Bucket: bucketName, Key: s3Key };
//   console.log('S3 PARAM' , s3Params)
//   try {
//     const data = await s3Client.getObject(s3Params);
//     if (!data.Body) {
//       return new NextResponse("Image not found", { status: 404 });
//     }

//     // Convert ReadableStream to Buffer
//     const body = Buffer.from(await data.Body.transformToByteArray());

//     // Validate Content-Type
//     const contentType = data.ContentType;
//     if (!contentType?.startsWith("image/")) {
//       return new NextResponse("Invalid image content type", { status: 400 });
//     }

//     // Validate buffer is not empty
//     if (body.length === 0) {
//       return new NextResponse("Empty image data", { status: 400 });
//     }

//     const headers = new Headers();
//     headers.set("Content-Type", contentType);
//     return new NextResponse(body, { status: 200, headers });
//   } catch (error: any) {
//     console.error("Error fetching image from S3:", error);
//     return new NextResponse(`Error fetching image from S3: ${error?.message}`, { status: 500 });
//   }
// }

import { NextResponse, NextRequest } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

export async function GET(req: NextRequest, { params }: { params: { key: string | string[] } }) {
  console.log('API route hit')
  const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
  const bucketName = process.env.AWS_BUCKET_NAME;
  let s3Key = Array.isArray(params.key) ? params.key.join('/') : params.key;
  if (s3Key.startsWith('posts/')) {
    s3Key = s3Key.replace(/^posts\//, 'imgs/');
  }
  
  console.log('Fetching S3 object:', { bucket: bucketName, key: s3Key });

  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
    });

    const data = await s3Client.send(command);
    if (!data.Body) {
      console.error('No data body returned from S3 for key:', s3Key);
      return new NextResponse('Image not found', { status: 404 });
    }

    const body = Buffer.from(await data.Body.transformToByteArray());
    if (body.length === 0) {
      console.error('Empty image data for key:', s3Key);
      return new NextResponse('Image data is empty', { status: 404 });
    }

    const headers = new Headers();
    headers.set('Content-Type', data.ContentType || 'image/jpeg');
    headers.set('Cache-Control', 'public, max-age=31536000');

    return new NextResponse(body, { status: 200, headers });
  } catch (error: any) {
    console.error('Error fetching image from S3:', {
      key: s3Key,
      error: error.message,
      code: error.name,
    });
    return new NextResponse(`Error fetching image from S3: ${error.message}`, { status: 500 });
  }
}