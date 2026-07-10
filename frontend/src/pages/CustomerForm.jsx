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

const CustomerForm = () => {
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
      const fetchCustomer = async () => {
        try {
          const response = await API.get(`/customers/${id}`);
          const customer = response.data.customer;
          setValue("name", customer.name);
          setValue("email", customer.email);
          setValue("phone", customer.phone || "");
          setValue("address", customer.address || "");
        } catch (err) {
          console.error(err);
          setErrorMsg("Failed to load customer details.");
          toast.error("Failed to load customer details.");
        } finally {
          setFetchLoading(false);
        }
      };

      fetchCustomer();
    }
  }, [id, isEdit, setValue]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setErrorMsg("");

      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        address: data.address || null,
      };

      if (isEdit) {
        await API.put(`/customers/${id}`, payload);
        toast.success("Customer updated successfully");
      } else {
        await API.post("/customers", payload);
        toast.success("Customer created successfully");
      }
      navigate("/customers");
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
          to="/customers"
          startIcon={<ArrowBackIcon />}
          sx={{ borderRadius: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" fontWeight="bold">
          {isEdit ? "Edit Customer" : "Create Customer"}
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
                label="Customer Name"
                variant="outlined"
                {...register("name", { required: "Customer name is required" })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email Address"
                variant="outlined"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Invalid email address format",
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                variant="outlined"
                placeholder="+15551234567"
                {...register("phone", {
                  pattern: {
                    value: /^\+?[0-9\s\-()]{7,20}$/,
                    message: "Invalid phone number (must be 7 to 20 digits)",
                  },
                })}
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Shipping Address"
                variant="outlined"
                multiline
                rows={3}
                {...register("address")}
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
                {loading ? <CircularProgress size={24} color="inherit" /> : "Save Customer"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CustomerForm;
