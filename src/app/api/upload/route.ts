import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const projectId = formData.get("projectId") as string;
    const type = formData.get("type") as string; // 'IMAGE', 'VIDEO', or 'THUMBNAIL'
    const altText = formData.get("altText") as string;

    if (!file) {
      return NextResponse.json({ error: "No file received" }, { status: 400 });
    }

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = {
      IMAGE: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
      VIDEO: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'],
      THUMBNAIL: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    };

    const mediaType = type as keyof typeof allowedTypes;
    if (!allowedTypes[mediaType]?.includes(file.type)) {
      return NextResponse.json({ 
        error: `Invalid file type. Allowed types for ${type}: ${allowedTypes[mediaType]?.join(', ')}` 
      }, { status: 400 });
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size too large. Maximum 10MB allowed." }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = path.extname(file.name);
    const filename = `${projectId}_${timestamp}_${Math.random().toString(36).substring(7)}${fileExtension}`;
    const filepath = path.join(uploadsDir, filename);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Save to database
    const projectMedia = await prisma.projectMedia.create({
      data: {
        projectId,
        type: mediaType,
        url: `/uploads/${filename}`,
        altText: altText || file.name,
        order: 0, // You might want to calculate this based on existing media
      },
    });

    return NextResponse.json({
      message: "File uploaded successfully",
      media: projectMedia,
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
