"use client";

import Link from 'next/link';
import { safeFetch } from '@/sanity/lib/client';
import { projectsQuery } from '@/sanity/lib/queries';
import { useSanityUIComponents } from '@/hooks/useSanityUIComponents';
import SanityStyledComponent from '@/components/Common/SanityStyledComponent';
import SingleProject from './SingleProject';
import { useState, useEffect } from 'react';
import { Project, ProjectGridProps } from '@/types/project';

const classNames = (...classes: Array<string | undefined | null | false>) =>
  classes.filter(Boolean).join(' ');

const Projects = ({
  projects: initialProjects,
  title,
  subtitle,
  className,
  containerClassName,
  headingWrapperClassName,
  titleClassName,
  subtitleClassName,
  gridClassName,
}: ProjectGridProps) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects || []);
  const [loading, setLoading] = useState(!initialProjects);
  const { getComponent } = useSanityUIComponents();

  useEffect(() => {
    const fetchProjects = async () => {
      if (!initialProjects) {
        try {
          const projectsData = await safeFetch(projectsQuery);
          setProjects(projectsData || []);
        } catch (error) {
          console.error('Error fetching projects data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProjects();
  }, [initialProjects]);

  // Get UI components for Projects section
  const projectsSectionComponent = getComponent('ProjectsSection');
  const projectsTitleComponent = getComponent('ProjectsTitle');
  const projectsSubtitleComponent = getComponent('ProjectsSubtitle');

  if (loading) {
    return (
      <div className="text-center py-12">
        <p>Caricamento progetti...</p>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-4">Sezione Progetti</h3>
        <p className="text-gray-600 mb-6">Crea i tuoi progetti in Sanity Studio per iniziare.</p>
        <button 
          onClick={() => window.location.href = '/studio'}
          className="inline-block bg-primary text-white px-6 py-3 rounded hover:bg-primary/80 transition"
        >
          Vai a Sanity Studio
        </button>
      </div>
    );
  }

  return (
    <SanityStyledComponent
      component={projectsSectionComponent}
      componentName="ProjectsSection"
      className={className}
    >
      <div className={classNames('container', containerClassName)}>
        {(title || subtitle) && (
          <div className={classNames('text-center mb-16', headingWrapperClassName)}>
            {title && (
              <SanityStyledComponent
                component={projectsTitleComponent}
                componentName="ProjectsTitle"
                as="h2"
                className={classNames(
                  'text-3xl font-bold text-black sm:text-4xl lg:text-5xl mb-4',
                  titleClassName,
                )}
              >
                {title}
              </SanityStyledComponent>
            )}
            {subtitle && (
              <SanityStyledComponent
                component={projectsSubtitleComponent}
                componentName="ProjectsSubtitle"
                as="p"
                className={classNames(
                  'text-black/80 text-lg max-w-2xl mx-auto',
                  subtitleClassName,
                )}
              >
                {subtitle}
              </SanityStyledComponent>
            )}
          </div>
        )}
        
        <div
          className={classNames(
            'grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3',
            gridClassName,
          )}
        >
          {projects.map((project, index) => (
            <SingleProject key={project._id} project={project} index={index} />
          ))}
        </div>

        <div className="mt-16 flex flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:justify-center">
          <a
            href="mailto:commerciale@lemsolutions.it?subject=QUOTE LEM SOLUTIONS CERAMIC SYSTEMS"
            className="hero-button-flash inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 px-8 py-3 text-base font-semibold text-white shadow-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          >
            Richiedi Preventivo Gratuito
          </a>
          <Link
            href="/contact?subject=CONSULTING"
            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-3 text-base font-semibold text-white backdrop-blur transition-all duration-200 hover:border-white/40 hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            Prenota una Consulenza
          </Link>
          <Link
            href="/contact?subject=INFO"
            className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-base font-semibold text-primary shadow-lg shadow-white/30 transition-all duration-200 hover:translate-y-[-2px] hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            Parlaci del Tuo Progetto
          </Link>
        </div>
      </div>
    </SanityStyledComponent>
  );
};

export default Projects;
