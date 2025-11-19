"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import Offers from "@/components/Offers";

const OffersPage = () => {
  return (
    <>
      <div className="text-white">
        <Breadcrumb
          pageName="Offerte"
          description="Pacchetti e promozioni dedicate alla fotoceramica industriale: consulta le offerte attive e richiedi subito un preventivo personalizzato."
        />
      </div>
      <div className="text-white">
        <section className="py-16 lg:py-20">
          <div className="container">
            <Offers variant="archive" />
          </div>
        </section>
      </div>
    </>
  );
};

export default OffersPage;

