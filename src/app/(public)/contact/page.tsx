"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact";

const ContactPage = () => {
  return (
    <>
      {/* Breadcrumb Section */}
      <div className="text-white">
        <Breadcrumb
          pageName="Contattaci"
          description="LEM Solutions è il partner italiano di riferimento per la fotoceramica industriale: realizziamo targhe commemorative, rivestimenti ceramici personalizzati e progetti decorativi su misura per studi grafici, architetti e industrie artistiche."
        />
      </div>

      {/* Contact Section */}
      <div className="text-white">
        <section className="pt-20 pb-16 md:pt-24 md:pb-16 lg:pt-28 lg:pb-20">
          <div className="container">
            <Contact />
          </div>
        </section>
      </div>
    </>
  );
};

export default ContactPage;
