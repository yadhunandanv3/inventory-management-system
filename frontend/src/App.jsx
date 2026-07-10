import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ProductForm from "./pages/ProductForm";
import Customers from "./pages/Customers";
import CustomerForm from "./pages/CustomerForm";
import Orders from "./pages/Orders";
import OrderForm from "./pages/OrderForm";
import OrderDetails from "./pages/OrderDetails";

// Material UI theme overrides
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1e3a8a", // navy blue
      light: "#3b82f6",
      dark: "#1e40af",
    },
    secondary: {
      main: "#f59e0b", // amber
    },
    background: {
      default: "#f3f4f6",
    },
  },
  typography: {
    fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        elevation1: {
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* Protected Dashboard Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Products />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/new"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ProductForm />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/edit/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ProductForm />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/customers"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Customers />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/customers/new"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CustomerForm />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/customers/edit/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CustomerForm />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Orders />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/new"
              element={
                <ProtectedRoute>
                  <Layout>
                    <OrderForm />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <OrderDetails />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
