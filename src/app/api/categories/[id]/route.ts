import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    console.log('Attempting to delete category with ID:', id);

    // First, check if the category exists and get project count
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { projects: true },
        },
      },
    });

    if (!category) {
      console.log('Category not found:', id);
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    console.log(`Found category: ${category.name} with ${category._count.projects} projects`);

    // Delete the category (this will cascade delete all related projects due to schema constraints)
    await prisma.category.delete({
      where: { id },
    });

    console.log('Category deleted successfully');

    return NextResponse.json({ 
      message: "Category deleted successfully",
      deletedProjects: category._count.projects 
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
