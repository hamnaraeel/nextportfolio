import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const featured = searchParams.get("featured");

    const projects = await prisma.project.findMany({
      where: {
        ...(categoryId && { categoryId }),
        ...(featured && { featured: featured === "true" }),
      },
      include: {
        category: true,
        media: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      content,
      technologies,
      liveUrl,
      githubUrl,
      categoryId,
      featured,
      published,
    } = body;

    if (!title || !description || !categoryId) {
      return NextResponse.json(
        { error: "Title, description, and category are required" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        content,
        technologies: technologies || [],
        liveUrl,
        githubUrl,
        categoryId,
        featured: featured || false,
        published: published !== false,
      },
      include: {
        category: true,
        media: true,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
