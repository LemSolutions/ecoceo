"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import AllAboutPosts from "@/components/About/AllAboutPosts";

const AboutPage = () => {
  return (
    <>
      {/* Breadcrumb Section */}
      <div className="text-white">
        <Breadcrumb
          pageName="Chi Siamo"
          description="Scopri la nostra storia, i nostri valori e la passione che ci guida nel creare soluzioni digitali innovative per il tuo business."
        />
      </div>

      {/* All About Posts from Sanity */}
      <div className="text-white">
        <section className="py-16 lg:py-20">
          <div className="container">
            <AllAboutPosts />
          </div>
        </section>
      </div>

    </>
  );
};

export default AboutPage;
