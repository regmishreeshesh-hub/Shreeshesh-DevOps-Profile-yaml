import React from 'react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/50 transition-all duration-500 hover:bg-white/10">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="p-6 md:p-8 relative z-10">
        {/* Project index */}
        <div className="absolute top-4 right-4 text-xs font-mono-code text-white/30 group-hover:text-orange-500 transition-colors">
          #{index + 1}
        </div>

        {/* Project title */}
        <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-3 group-hover:text-orange-400 transition-colors">
          {project.title}
        </h3>

        {/* Project description */}
        <p className="text-white/70 mb-6 leading-relaxed">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies.map((tech, techIndex) => (
            <span 
              key={techIndex}
              className="px-3 py-1 text-xs font-mono-code bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-4">
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/15 hover:border-orange-500/50 transition-all duration-300 group-hover/link:translate-x-1"
            >
              <span className="text-orange-400 text-lg">🐙</span>
              <span className="text-sm">View Code</span>
            </a>
          )}
          {project.demoLink && (
            <a
              href={project.demoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/15 hover:border-blue-500/50 transition-all duration-300 group-hover/link:translate-x-1"
            >
              <span className="text-blue-400 text-lg">🌐</span>
              <span className="text-sm">Live Demo</span>
            </a>
          )}
        </div>
      </div>

      {/* Decorative bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500/0 to-transparent group-hover:via-orange-500/50 transition-all duration-500" />
    </div>
  );
};

export default ProjectCard;
