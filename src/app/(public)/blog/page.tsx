"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import Blog from "@/components/Blog";

const BlogPage = () => {
  return (
    <>
      {/* Breadcrumb Section - Sfondo standard */}
      <div>
        <Breadcrumb
          pageName="Il Nostro Blog"
          description="Scopri il mondo della stampa digitale su ceramica  Scopri le ultime novità e tendenze del settore."
        />
      </div>

      {/* Blog Content - Sfondo standard */}
      <div>
        <section className="pt-20 pb-16 md:pt-24 md:pb-16 lg:pt-28 lg:pb-20">
          <div className="container">
            <div className="text-center mb-16">
              <h1 className="text-3xl font-bold text-black sm:text-4xl lg:text-5xl mb-6">
                Il Nostro Blog
              </h1>
              <p className="text-black/80 text-lg max-w-3xl mx-auto leading-relaxed">
                Scopri il mondo della stampa digitale su ceramica  
      
              </p>
            </div>
            <Blog />
          </div>
        </section>
      </div>
    </>
  );
};

export default BlogPage;
