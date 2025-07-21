import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ExternalLink, Github } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  liveUrl: string | null;
  githubUrl: string | null;
  category: {
    name: string;
  };
  media: Array<{
    url: string;
    altText: string | null;
  }>;
}

async function getFeaturedProjects(): Promise<Project[]> {
  try {
    return await prisma.project.findMany({
      where: { featured: true, published: true },
      include: {
        category: true,
        media: {
          where: { type: "THUMBNAIL" },
          take: 1,
        },
      },
      take: 6,
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.log("Database not ready yet:", error);
    return [];
  }
}

export default async function Home() {
  const featuredProjects = await getFeaturedProjects();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
              Portfolio
            </Link>
            <div className="flex items-center space-x-8">
              <Link href="/projects" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Projects
              </Link>
              <Link href="/admin" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to My <span className="text-blue-600">Portfolio</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            I create exceptional digital experiences through innovative web development. 
            Explore my projects and see how I bring ideas to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/projects"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              View My Work
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Projects
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              A showcase of my recent work and achievements
            </p>
          </div>

          {featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project: Project) => (
                <div
                  key={project.id}
                  className="bg-white dark:bg-slate-900 rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
                >
                  <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative">
                    {project.media[0] ? (
                      <Image
                        src={project.media[0].url}
                        alt={project.media[0].altText || project.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                        {project.category.name}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/projects/${project.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View Details
                      </Link>
                      <div className="flex items-center space-x-2">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
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
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                No featured projects yet. Add some projects from the admin panel.
              </p>
              <Link
                href="/admin"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Add Projects
              </Link>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/projects"
              className="inline-flex items-center px-6 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
            >
              View All Projects
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
