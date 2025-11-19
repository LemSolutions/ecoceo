"use client";

import Link from 'next/link';
import Image from 'next/image';
import { safeFetch } from '@/sanity/lib/client';
import { projectsQuery } from '@/sanity/lib/queries';
import { useSanityUIComponents } from '@/hooks/useSanityUIComponents';
import SanityStyledComponent from '@/components/Common/SanityStyledComponent';
import SingleProject from './SingleProject';
import { useState, useEffect } from 'react';
import { Project, ProjectCardProps, ProjectGridProps } from '@/types/project';
import { getImageUrl, getTextValue } from '@/sanity/lib/image';

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
  variant = 'default',
}: ProjectGridProps & { variant?: 'default' | 'homepage' }) => {
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
            variant === 'homepage'
              ? 'grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3 auto-rows-fr'
              : 'grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3',
            gridClassName,
          )}
        >
          {projects.map((project, index) =>
            variant === 'homepage' ? (
              <HomepageProjectCard key={project._id} project={project} index={index} />
            ) : (
              <SingleProject key={project._id} project={project} index={index} />
            ),
          )}
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

const HomepageProjectCard = ({ project, index }: ProjectCardProps) => {
  const isSpotlight = index === 0;
  const detailUrl = `/projects/${project.slug?.current || project._id}`;
  const serviceUrl = project.service?.slug?.current ? `/services/${project.service.slug.current}` : undefined;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-white/10 transition-all duration-300 hover:-translate-y-2 ${
        isSpotlight
          ? 'lg:col-span-2 xl:col-span-3 bg-gradient-to-r from-white/15 via-white/5 to-white/10 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.85)] lg:flex lg:min-h-[360px]'
          : 'bg-white/10 backdrop-blur-lg shadow-[0_25px_60px_-30px_rgba(0,0,0,0.8)]'
      }`}
    >
      <div
        className={`relative overflow-hidden ${
          isSpotlight ? 'h-64 lg:h-auto lg:min-h-[360px] lg:w-1/2' : 'h-56'
        }`}
      >
        {project.mainImage ? (
          <div className="relative h-full w-full overflow-hidden">
            <Image
              src={getImageUrl(project.mainImage)}
              alt={getTextValue(project.title)}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes={
                isSpotlight
                  ? '(min-width: 1280px) 50vw, (min-width: 1024px) 55vw, 100vw'
                  : '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw'
              }
              priority={isSpotlight}
            />
          </div>
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-orange-400/60 to-red-500/80 flex items-center justify-center text-white font-semibold text-lg">
            Fotoceramica
          </div>
        )}
        <div
          className={`absolute inset-0 ${
            isSpotlight
              ? 'bg-gradient-to-r from-black/80 via-black/40 to-transparent'
              : 'bg-gradient-to-t from-black/70 via-black/20 to-transparent'
          }`}
        />

        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {project.service?.name && (
            <Link
              href={serviceUrl || '#'}
              className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-600"
            >
              {project.service.name}
            </Link>
          )}
          {project.featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-lg shadow-orange-500/60">
              In evidenza
            </span>
          )}
        </div>
      </div>

      <div
        className={`p-6 space-y-4 ${
          isSpotlight ? 'lg:w-1/2 lg:p-8 lg:space-y-6' : ''
        }`}
      >
        <div>
          <h3
            className={`font-bold text-white mb-2 ${
              isSpotlight ? 'text-3xl lg:text-4xl' : 'text-2xl'
            }`}
          >
            {getTextValue(project.title)}
          </h3>
          {project.client && (
            <p
              className={`text-white/70 uppercase tracking-widest ${
                isSpotlight ? 'text-base' : 'text-sm'
              }`}
            >
              Cliente: {project.client}
            </p>
          )}
        </div>

        {project.shortDescription && (
          <p
            className={`text-white/80 leading-relaxed ${
              isSpotlight ? 'text-lg line-clamp-4' : 'text-base line-clamp-3'
            }`}
          >
            {getTextValue(project.shortDescription)}
          </p>
        )}

        <div className="flex flex-wrap gap-4 text-sm text-white/70">
          {project.completionDate && (
            <div>
              <span className="text-white/50">Completato:</span>{' '}
              {new Date(project.completionDate).toLocaleDateString('it-IT')}
            </div>
          )}
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.technologies.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 3 && (
                <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
                  +{project.technologies.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={detailUrl}
            className="flex-1 inline-flex justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/40 transition hover:brightness-110"
          >
            Scopri il progetto
          </Link>

          <Link
            href={`/contact?subject=${encodeURIComponent(`PROGETTO ${getTextValue(project.title)}`)}`}
            className="inline-flex items-center justify-center rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/15"
          >
            Richiedi una demo
          </Link>
        </div>
      </div>
    </div>
  );
};
