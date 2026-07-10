import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import API from "../services/api";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from "@mui/icons-material";
import { toast } from "react-toastify";

const ProductForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isEdit) {
      const fetchProduct = async () => {
        try {
          const response = await API.get(`/products/${id}`);
          const product = response.data.product;
          setValue("name", product.name);
          setValue("sku", product.sku);
          setValue("description", product.description || "");
          setValue("price", product.price);
          setValue("quantity", product.quantity);
        } catch (err) {
          console.error(err);
          setErrorMsg("Failed to load product details.");
          toast.error("Failed to load product details.");
        } finally {
          setFetchLoading(false);
        }
      };

      fetchProduct();
    }
  }, [id, isEdit, setValue]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setErrorMsg("");

      const payload = {
        name: data.name,
        sku: data.sku,
        description: data.description,
        price: parseFloat(data.price),
        quantity: parseInt(data.quantity, 10),
      };

      if (isEdit) {
        await API.put(`/products/${id}`, payload);
        toast.success("Product updated successfully");
      } else {
        await API.post("/products", payload);
        toast.success("Product created successfully");
      }
      navigate("/products");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 
        (err.response?.data?.errors && err.response.data.errors[0]?.message) || 
        "Something went wrong";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <Button
          variant="outlined"
          color="inherit"
          component={Link}
          to="/products"
          startIcon={<ArrowBackIcon />}
          sx={{ borderRadius: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" fontWeight="bold">
          {isEdit ? "Edit Product" : "Create Product"}
        </Typography>
      </Box>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 1 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Product Name"
                variant="outlined"
                {...register("name", { required: "Product name is required" })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="SKU"
                variant="outlined"
                {...register("sku", { required: "SKU is required" })}
                error={!!errors.sku}
                helperText={errors.sku?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price ($)"
                variant="outlined"
                type="number"
                inputProps={{ step: "0.01", min: "0.01" }}
                {...register("price", {
                  required: "Price is required",
                  min: { value: 0.01, message: "Price must be greater than 0" },
                })}
                error={!!errors.price}
                helperText={errors.price?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stock Quantity"
                variant="outlined"
                type="number"
                inputProps={{ min: "0" }}
                {...register("quantity", {
                  required: "Quantity is required",
                  min: { value: 0, message: "Quantity cannot be negative" },
                })}
                error={!!errors.quantity}
                helperText={errors.quantity?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                variant="outlined"
                multiline
                rows={4}
                {...register("description")}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                startIcon={<SaveIcon />}
                disabled={loading}
                sx={{ borderRadius: 2, fontWeight: "bold", px: 4 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Save Product"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default ProductForm;
