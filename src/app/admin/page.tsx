"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import FileUpload from "@/components/FileUpload";
import {
  FolderOpen,
  Tags,
  Upload,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  StarOff,
  ExternalLink,
  Github,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string | null;
  color: string;
  _count: { projects: number };
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  liveUrl: string | null;
  githubUrl: string | null;
  featured: boolean;
  published: boolean;
  category: { name: string; color: string };
  media: any[];
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedProjectForMedia, setSelectedProjectForMedia] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({ name: "", description: "", color: "#3B82F6" });
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    content: "",
    technologies: "",
    liveUrl: "",
    githubUrl: "",
    categoryId: "",
    featured: false,
    published: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, projectsRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/projects"),
      ]);
      
      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
      }
      
      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        setProjects(projectsData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      });

      if (response.ok) {
        await fetchData();
        setNewCategory({ name: "", description: "", color: "#3B82F6" });
        setShowCategoryForm(false);
      }
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const projectData = {
        ...newProject,
        technologies: newProject.technologies.split(",").map(tech => tech.trim()).filter(Boolean),
      };

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        await fetchData();
        setNewProject({
          title: "",
          description: "",
          content: "",
          technologies: "",
          liveUrl: "",
          githubUrl: "",
          categoryId: "",
          featured: false,
          published: true,
        });
        setShowProjectForm(false);
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const toggleProjectFeature = async (projectId: string, featured: boolean) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !featured }),
      });

      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const toggleProjectVisibility = async (projectId: string, published: boolean) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !published }),
      });

      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "projects", label: "Projects", icon: FolderOpen },
    { id: "categories", label: "Categories", icon: Tags },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Portfolio Admin
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900"
              >
                View Site
              </Link>
              <Link
                href="/projects"
                className="text-gray-600 hover:text-gray-900"
              >
                Projects
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Vertical Sidebar */}
        <div className="w-64 bg-white h-screen shadow-sm border-r border-gray-200">
          <div className="p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === "overview" && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <FolderOpen className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Projects</p>
                      <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <Star className="h-8 w-8 text-yellow-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Featured Projects</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {projects.filter(p => p.featured).length}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <Tags className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Categories</p>
                      <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <Eye className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Published</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {projects.filter(p => p.published).length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Projects */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Projects</h2>
                </div>
                <div className="p-6">
                  {projects.slice(0, 5).map((project) => (
                    <div key={project.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div>
                        <h3 className="font-medium text-gray-900">{project.title}</h3>
                        <p className="text-sm text-gray-600">{project.category.name}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {project.featured && <Star className="h-4 w-4 text-yellow-500" />}
                        {project.published ? (
                          <Eye className="h-4 w-4 text-green-500" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "projects" && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
                <button
                  onClick={() => setShowProjectForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project
                </button>
              </div>

              {showProjectForm && (
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-4">Add New Project</h2>
                  <form onSubmit={handleCreateProject} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={newProject.title}
                          onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <select
                          value={newProject.categoryId}
                          onChange={(e) => setNewProject({...newProject, categoryId: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                          required
                        >
                          <option value="">Select a category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={newProject.description}
                        onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Technologies (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={newProject.technologies}
                        onChange={(e) => setNewProject({...newProject, technologies: e.target.value})}
                        placeholder="React, TypeScript, Node.js"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Live URL
                        </label>
                        <input
                          type="url"
                          value={newProject.liveUrl}
                          onChange={(e) => setNewProject({...newProject, liveUrl: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          GitHub URL
                        </label>
                        <input
                          type="url"
                          value={newProject.githubUrl}
                          onChange={(e) => setNewProject({...newProject, githubUrl: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newProject.featured}
                          onChange={(e) => setNewProject({...newProject, featured: e.target.checked})}
                          className="mr-2"
                        />
                        Featured Project
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newProject.published}
                          onChange={(e) => setNewProject({...newProject, published: e.target.checked})}
                          className="mr-2"
                        />
                        Published
                      </label>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowProjectForm(false)}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Create Project
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Projects List */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">All Projects</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Project
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Technologies
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {projects.map((project) => (
                        <tr key={project.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{project.title}</div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">{project.description}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="relative group">
                              <span 
                                className="px-2 py-1 text-white text-xs rounded-full cursor-help"
                                style={{ backgroundColor: project.category.color }}
                              >
                                {project.category.name}
                              </span>
                              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap mb-1">
                                Category: {project.category.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {project.technologies.slice(0, 3).map((tech: string, index: number) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                                >
                                  {tech}
                                </span>
                              ))}
                              {project.technologies.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                  +{project.technologies.length - 3}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              {project.featured && (
                                <div className="relative group">
                                  <Star className="h-4 w-4 text-yellow-500" />
                                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap mb-1">
                                    Featured Project
                                  </span>
                                </div>
                              )}
                              {project.published ? (
                                <div className="relative group">
                                  <Eye className="h-4 w-4 text-green-500" />
                                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap mb-1">
                                    Published
                                  </span>
                                </div>
                              ) : (
                                <div className="relative group">
                                  <EyeOff className="h-4 w-4 text-gray-400" />
                                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap mb-1">
                                    Unpublished
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <Link
                                href={`/projects/${project.id}`}
                                className="text-blue-600 hover:text-blue-900 relative group"
                                title="View Project"
                              >
                                <Eye className="h-4 w-4" />
                                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap mb-1">
                                  View Project
                                </span>
                              </Link>
                              <button
                                onClick={() => setEditingProject(project)}
                                className="text-gray-600 hover:text-gray-900 relative group"
                                title="Edit Project"
                              >
                                <Edit className="h-4 w-4" />
                                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap mb-1">
                                  Edit Project
                                </span>
                              </button>
                              <button
                                onClick={() => setSelectedProjectForMedia(project.id)}
                                className="text-indigo-600 hover:text-indigo-900 relative group"
                                title="Upload Media"
                              >
                                <Upload className="h-4 w-4" />
                                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap mb-1">
                                  Upload Media
                                </span>
                              </button>
                              <button
                                onClick={() => toggleProjectFeature(project.id, project.featured)}
                                className="text-yellow-600 hover:text-yellow-900 relative group"
                                title={project.featured ? "Remove from Featured" : "Add to Featured"}
                              >
                                {project.featured ? <StarOff className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap mb-1">
                                  {project.featured ? "Remove from Featured" : "Add to Featured"}
                                </span>
                              </button>
                              <button
                                onClick={() => toggleProjectVisibility(project.id, project.published)}
                                className="text-green-600 hover:text-green-900 relative group"
                                title={project.published ? "Unpublish" : "Publish"}
                              >
                                {project.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap mb-1">
                                  {project.published ? "Unpublish" : "Publish"}
                                </span>
                              </button>
                              {project.liveUrl && (
                                <a
                                  href={project.liveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-purple-600 hover:text-purple-900 relative group"
                                  title="Live Demo"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap mb-1">
                                    Live Demo
                                  </span>
                                </a>
                              )}
                              {project.githubUrl && (
                                <a
                                  href={project.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-600 hover:text-gray-900 relative group"
                                  title="Source Code"
                                >
                                  <Github className="h-4 w-4" />
                                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap mb-1">
                                    Source Code
                                  </span>
                                </a>
                              )}
                              <button
                                onClick={() => deleteProject(project.id)}
                                className="text-red-600 hover:text-red-900 relative group"
                                title="Delete Project"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap mb-1">
                                  Delete Project
                                </span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "categories" && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
                <button
                  onClick={() => setShowCategoryForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </button>
              </div>

              {showCategoryForm && (
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
                  <form onSubmit={handleCreateCategory} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={newCategory.description}
                        onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Color
                      </label>
                      <input
                        type="color"
                        value={newCategory.color}
                        onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
                        className="w-20 h-10 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowCategoryForm(false)}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Create Category
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <div key={category.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm text-gray-500">
                        {category._count.projects} projects
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-gray-600 text-sm mb-4">
                        {category.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Project</h2>
              <button
                onClick={() => setEditingProject(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  defaultValue={editingProject.title}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  defaultValue={editingProject.description}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Technologies (comma-separated)
                </label>
                <input
                  type="text"
                  defaultValue={editingProject.technologies.join(', ')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Live URL
                </label>
                <input
                  type="url"
                  defaultValue={editingProject.liveUrl || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub URL
                </label>
                <input
                  type="url"
                  defaultValue={editingProject.githubUrl || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Upload Modal */}
      {selectedProjectForMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Upload Media for Project</h2>
              <button
                onClick={() => setSelectedProjectForMedia(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <FileUpload 
              projectId={selectedProjectForMedia}
              onUploadSuccess={() => {
                setSelectedProjectForMedia(null);
                fetchData(); // Refresh projects to show new media
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
