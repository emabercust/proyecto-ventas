import React from "react";
import CategoriesAdmin from "../components/admin/CategoriesAdmin";
import ProductsAdmin from "../components/admin/ProductsAdmin";
import OrdersAdmin from "../components/admin/OrdersAdmin";

const TestPage = () => {
  return (
    <div>
      <h1>Test de componentes</h1>

      <CategoriesAdmin />
      <ProductsAdmin/>
      <OrdersAdmin/>

    </div>
  );
};

export default TestPage;