"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import Shop from "@/components/Shop";

const ShopPage = () => {
  return (
    <>
      {/* Breadcrumb Section */}
      <div className="text-white">
        <Breadcrumb
          pageName="Shop"
          description="I nostri prodotti di qualità"
        />
      </div>

      {/* Shop Content */}
      <div className="text-white">
        <section className="py-16 lg:py-20">
          <div className="container">
            <Shop 
              products={[]}
            />
          </div>
        </section>
      </div>
    </>
  );
};

export default ShopPage;
