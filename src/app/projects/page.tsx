import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Github, Filter } from "lucide-react";
import { Suspense } from "react";

interface ProjectsPageProps {
  searchParams: { category?: string };
}

async function getProjects(categoryId?: string) {
  try {
    return await prisma.project.findMany({
      where: {
        published: true,
        ...(categoryId && { categoryId }),
      },
      include: {
        category: true,
        media: {
          where: { type: "THUMBNAIL" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.log("Database not ready yet:", error);
    return [];
  }
}

async function getCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.log("Database not ready yet:", error);
    return [];
  }
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const [projects, categories] = await Promise.all([
    getProjects(searchParams.category),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
              Portfolio
            </Link>
            <div className="flex items-center space-x-8">
              <Link href="/projects" className="text-blue-600 font-medium">
                Projects
              </Link>
              <Link href="/admin" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            All Projects
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Explore my complete portfolio of work
          </p>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              <Link
                href="/projects"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  !searchParams.category
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                }`}
              >
                All Categories
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/projects?category=${category.id}`}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    searchParams.category === category.id
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                  }`}
                  style={{
                    backgroundColor: searchParams.category === category.id ? category.color || "#3B82F6" : undefined,
                  }}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Projects Grid */}
        <Suspense fallback={<div>Loading projects...</div>}>
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                    {project.media[0] ? (
                      <Image
                        src={project.media[0].url}
                        alt={project.media[0].altText || project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <div className="text-center">
                          <Filter className="h-12 w-12 mx-auto mb-2" />
                          <p>No Image</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span 
                        className="px-3 py-1 text-white text-sm rounded-full"
                        style={{ backgroundColor: project.category.color || "#3B82F6" }}
                      >
                        {project.category.name}
                      </span>
                      {project.featured && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {project.description}
                    </p>
                    
                    {/* Technologies */}
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.technologies.slice(0, 3).map((tech, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                            +{project.technologies.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <Link
                        href={`/projects/${project.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View Details →
                      </Link>
                      <div className="flex items-center space-x-2">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Live Demo"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            title="Source Code"
                          >
                            <Github className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-4">
                <Filter className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Projects Found
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {searchParams.category 
                    ? "No projects found in this category." 
                    : "No projects available yet. Add some projects from the admin panel."
                  }
                </p>
              </div>
              <Link
                href="/admin"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Add Projects
              </Link>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
}
