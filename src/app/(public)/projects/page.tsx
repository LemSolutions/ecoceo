"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import Projects from "@/components/Projects";

const ProjectsPage = () => {
  return (
    <>
      {/* Breadcrumb Section */}
      <div className="text-white">
        <Breadcrumb
          pageName="I Nostri Progetti"
          description="Scopri i nostri lavori realizzati per clienti soddisfatti. Ogni progetto racconta una storia di successo e innovazione."
        />
      </div>

      {/* Projects Content */}
      <div className="text-white">
        <section className="pt-20 pb-16 md:pt-24 md:pb-16 lg:pt-28 lg:pb-20">
          <div className="container">
            <Projects />
          </div>
        </section>
      </div>
    </>
  );
};

export default ProjectsPage;
