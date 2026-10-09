'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ownerProfile, Project } from '@/lib/ownerProfile';
import { ExternalLink, Github, CheckCircle2, ArrowUpRight } from 'lucide-react';

export const ProjectsApp: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project>(ownerProfile.projects[0]);

  return (
    <div className="space-y-6 select-text">
      {/* Top App Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700/50">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <span>Projects Drive</span>
            <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              MAIN DRIVE
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Production web platforms, full-stack applications, and technical interventions engineered by {ownerProfile.identity.fullName}.
          </p>
        </div>

        <a
          href={ownerProfile.conversion.secondaryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-lg active:scale-95 transition-all w-fit"
        >
          <span>Start a Project</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ownerProfile.projects.map((project) => (
          <div
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
              selectedProject.id === project.id
                ? 'bg-slate-900/90 border-indigo-500 ring-2 ring-indigo-500/30 shadow-xl'
                : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900/70 hover:border-slate-700'
            }`}
          >
            {/* Image Preview Container */}
            <div className="relative w-full h-44 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
              <Image
                src={project.image}
                alt={project.name}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute top-2 right-2 px-2 py-1 rounded bg-slate-950/80 backdrop-blur-md text-[10px] font-mono text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span className="capitalize">{project.outcomeStatus}</span>
              </div>
            </div>

            {/* Project Details */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-indigo-400 font-semibold">{project.dates}</span>
                <span className="text-[11px] font-mono text-slate-400">{project.role}</span>
              </div>
              <h3 className="text-base font-bold text-slate-100">{project.name}</h3>
              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{project.problem}</p>
            </div>

            {/* Tech Badges */}
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/60">
              {project.stack.map((tech, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-indigo-300 border border-slate-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Project Deep Dive Drawer */}
      {selectedProject && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">DETAILED CASE OVERVIEW</span>
              <h3 className="text-lg font-extrabold text-white">{selectedProject.name}</h3>
            </div>

            <div className="flex items-center space-x-2">
              {selectedProject.url && (
                <a
                  href={selectedProject.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center space-x-1 transition-all"
                >
                  <span>Live Site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {selectedProject.repository && (
                <a
                  href={selectedProject.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center space-x-1 transition-all"
                >
                  <span>Repository</span>
                  <Github className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="font-mono text-indigo-400 font-bold uppercase text-[10px]">Problem & Constraint</span>
              <p className="text-slate-300 leading-relaxed">{selectedProject.problem}</p>
            </div>
            <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="font-mono text-emerald-400 font-bold uppercase text-[10px]">Technical Solution</span>
              <p className="text-slate-300 leading-relaxed">{selectedProject.intervention}</p>
            </div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-emerald-500/20 text-xs">
            <span className="font-mono text-emerald-400 font-bold uppercase text-[10px] block mb-1">Delivered Outcome</span>
            <p className="text-emerald-200 font-semibold">{selectedProject.outcome}</p>
          </div>
        </div>
      )}
    </div>
  );
};
