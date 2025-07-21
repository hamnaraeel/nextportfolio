import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Github, ArrowLeft, Calendar, Tag } from "lucide-react";
import { notFound } from "next/navigation";

interface ProjectPageProps {
  params: { id: string };
}

async function getProject(id: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        category: true,
        media: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!project || !project.published) {
      return null;
    }

    return project;
  } catch (error) {
    console.log("Database not ready yet:", error);
    return null;
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProject(params.id);

  if (!project) {
    notFound();
  }

  const thumbnails = project.media.filter(m => m.type === "THUMBNAIL");
  const images = project.media.filter(m => m.type === "IMAGE");
  const videos = project.media.filter(m => m.type === "VIDEO");

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <Link
          href="/projects"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Link>

        {/* Project Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="mb-4 lg:mb-0">
              <div className="flex items-center mb-2">
                <span 
                  className="px-3 py-1 text-white text-sm rounded-full mr-3"
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
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {project.title}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
                {project.description}
              </p>
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(project.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
                >
                  <Github className="h-4 w-4 mr-2" />
                  Source Code
                </a>
              )}
            </div>
          </div>

          {/* Technologies */}
          {project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              <Tag className="h-4 w-4 text-gray-400 mr-2 mt-1" />
              {project.technologies.map((tech: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Project Media */}
        <div className="space-y-8">
          {/* Main Thumbnail/Hero Image */}
          {thumbnails.length > 0 && (
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden">
              <Image
                src={thumbnails[0].url}
                alt={thumbnails[0].altText || project.title}
                width={1200}
                height={675}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Project Content */}
          {project.content && (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                About This Project
              </h2>
              <div 
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: project.content }}
              />
            </div>
          )}

          {/* Additional Images */}
          {images.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Project Screenshots
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {images.map((image) => (
                  <div key={image.id} className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <Image
                      src={image.url}
                      alt={image.altText || `${project.title} screenshot`}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Videos */}
          {videos.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Project Videos
              </h2>
              <div className="space-y-6">
                {videos.map((video) => (
                  <div key={video.id} className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <video
                      src={video.url}
                      controls
                      className="w-full h-full"
                      poster={thumbnails[0]?.url}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation to Other Projects */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <Link
              href="/projects"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              View More Projects
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
