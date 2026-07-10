import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { toast } from "react-toastify";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const response = await API.get(`/orders/${id}`);
      setOrder(response.data.order);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to load order details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      setStatusLoading(true);
      setErrorMsg("");
      await API.put(`/orders/${id}/status`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrderDetails();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to update order status";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setStatusLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "success";
      case "CANCELLED":
        return "error";
      case "PENDING":
      default:
        return "warning";
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (errorMsg && !order) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>{errorMsg}</Alert>
        <Button variant="outlined" color="inherit" component={Link} to="/orders" startIcon={<ArrowBackIcon />}>
          Back to Orders
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={3} justifyContent="space-between">
        <Box display="flex" alignItems="center" gap={1}>
          <Button
            variant="outlined"
            color="inherit"
            component={Link}
            to="/orders"
            startIcon={<ArrowBackIcon />}
            sx={{ borderRadius: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" fontWeight="bold">
            Order #{order.id}
          </Typography>
          <Chip label={order.status} color={getStatusColor(order.status)} sx={{ fontWeight: "bold", ml: 1 }} />
        </Box>

        {/* Change Status Control */}
        <Box display="flex" alignItems="center" gap={2}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="change-status-label">Update Status</InputLabel>
            <Select
              labelId="change-status-label"
              value={order.status}
              label="Update Status"
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={statusLoading}
            >
              <MenuItem value="PENDING">PENDING</MenuItem>
              <MenuItem value="COMPLETED">COMPLETED</MenuItem>
              <MenuItem value="CANCELLED">CANCELLED</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Customer Information Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 1, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Customer Details
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              {order.customer ? (
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {order.customer.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    <strong>Email:</strong> {order.customer.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    <strong>Phone:</strong> {order.customer.phone || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    <strong>Address:</strong> {order.customer.address || "N/A"}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No customer information linked.
                </Typography>
              )}
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Order Summary
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="text.secondary">Order Date:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {new Date(order.orderDate).toLocaleString()}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="text.secondary">Total Items:</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {order.items ? order.items.reduce((sum, item) => sum + item.quantity, 0) : 0}
                </Typography>
              </Box>
              <Divider sx={{ my: 1.5 }} />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1" fontWeight="bold">Total Amount:</Typography>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  ${parseFloat(order.totalAmount).toFixed(2)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Order Items Table Card */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 1 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Line Items
            </Typography>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: "#fafafa" }}>
                  <TableRow>
                    <TableCell><strong>Product Name</strong></TableCell>
                    <TableCell><strong>SKU</strong></TableCell>
                    <TableCell align="right"><strong>Unit Price</strong></TableCell>
                    <TableCell align="center"><strong>Quantity</strong></TableCell>
                    <TableCell align="right"><strong>Subtotal</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items && order.items.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {item.product ? item.product.name : "Product Deleted"}
                      </TableCell>
                      <TableCell>
                        {item.product ? item.product.sku : "-"}
                      </TableCell>
                      <TableCell align="right">${parseFloat(item.price).toFixed(2)}</TableCell>
                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderDetails;
