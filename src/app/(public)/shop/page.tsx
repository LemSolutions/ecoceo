"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import Shop from "@/components/Shop";
import { useStripeProducts } from "@/hooks/useStripeProducts";

const ShopPage = () => {
  const { products, loading, error } = useStripeProducts();

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
              products={products}
              loading={loading}
              error={error}
            />
          </div>
        </section>
      </div>
    </>
  );
};

export default ShopPage;
