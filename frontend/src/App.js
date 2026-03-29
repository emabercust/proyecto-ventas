import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { Toaster } from "sonner";

import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from 'routes/AdminRoute';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import { CartProvider } from './context/CartContext';
import {AuthProvider} from './context/AuthContext'
import CheckoutPage from './pages/CheckoutPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import TestPage from "./pages/TestPage";

function App() {
  return (
    <AuthProvider>
    <CartProvider>   
    <BrowserRouter> 
        <Routes>
          {/*  tienda publica  */}
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetailPage/>} /> {/**El :id es una variable dinámica*/}         
          <Route path="/checkout"
                element={
                       <PrivateRoute>
                         <CheckoutPage/>
                       </PrivateRoute>  
                }
          /> 

          {/*  LoginAdmin  */}
          <Route path="/admin/login" element={<AdminLoginPage/>} />
          
          {/*  Dashboard protegido  */}
          <Route path="/admin/*"
                 element={
                      <AdminRoute>
                         <AdminDashboard/>
                      </AdminRoute>
                 }
          />
          <Route path="/test" element={<TestPage/>}/>
        </Routes>
        <Toaster/>
      </BrowserRouter>
 </CartProvider>
 </AuthProvider>
 
  );
}

export default App;
