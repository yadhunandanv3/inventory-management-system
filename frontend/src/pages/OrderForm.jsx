import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ShoppingCartCheckout as CheckoutIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";

const OrderForm = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Selected customer
  const [selectedCustomerId, setSelectedCustomerId] = useState("");

  // Items added to the order
  // Structure: { product: {}, quantity: 1 }
  const [orderItems, setOrderItems] = useState([]);

  // Form selection for adding an item
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [customersRes, productsRes] = await Promise.all([
          API.get("/customers", { params: { limit: 100 } }),
          API.get("/products", { params: { limit: 100 } }),
        ]);
        setCustomers(customersRes.data.customers);
        setProducts(productsRes.data.products);
      } catch (err) {
        console.error(err);
        setErrorMsg("Failed to load options.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddItem = () => {
    if (!selectedProductId) return;

    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return;

    // Check if product already in orderItems
    const exists = orderItems.find((item) => item.product.id === product.id);
    const newQty = exists ? exists.quantity + parseInt(selectedQuantity, 10) : parseInt(selectedQuantity, 10);

    // Validate inventory stock
    if (newQty > product.quantity) {
      toast.warning(`Cannot add. Only ${product.quantity} units of "${product.name}" are in stock.`);
      return;
    }

    if (exists) {
      setOrderItems(
        orderItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        )
      );
    } else {
      setOrderItems([...orderItems, { product, quantity: newQty }]);
    }

    // Reset selection fields
    setSelectedProductId("");
    setSelectedQuantity(1);
  };

  const handleRemoveItem = (productId) => {
    setOrderItems(orderItems.filter((item) => item.product.id !== productId));
  };

  const handleQuantityChange = (productId, newQty) => {
    const qty = parseInt(newQty, 10);
    if (isNaN(qty) || qty < 1) return;

    const item = orderItems.find((i) => i.product.id === productId);
    if (!item) return;

    if (qty > item.product.quantity) {
      toast.warning(`Maximum available stock is ${item.product.quantity}`);
      return;
    }

    setOrderItems(
      orderItems.map((i) =>
        i.product.id === productId ? { ...i, quantity: qty } : i
      )
    );
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => {
      return sum + parseFloat(item.product.price) * item.quantity;
    }, 0);
  };

  const handleSubmitOrder = async () => {
    if (!selectedCustomerId) {
      toast.error("Please select a customer");
      return;
    }
    if (orderItems.length === 0) {
      toast.error("Please add at least one product to the order");
      return;
    }

    try {
      setSubmitLoading(true);
      setErrorMsg("");

      const payload = {
        customerId: selectedCustomerId,
        items: orderItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      await API.post("/orders", payload);
      toast.success("Order created successfully!");
      navigate("/orders");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to create order";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
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
          to="/orders"
          startIcon={<ArrowBackIcon />}
          sx={{ borderRadius: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" fontWeight="bold">
          Create Order
        </Typography>
      </Box>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Customer & Item Selection */}
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 3, boxShadow: 1, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                1. Select Customer
              </Typography>
              <FormControl fullWidth sx={{ mt: 1 }}>
                <InputLabel id="customer-select-label">Customer</InputLabel>
                <Select
                  labelId="customer-select-label"
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  label="Customer"
                >
                  {customers.map((customer) => (
                    <MenuItem key={customer.id} value={customer.id}>
                      {customer.name} ({customer.email})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                2. Add Products
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="product-select-label">Product</InputLabel>
                    <Select
                      labelId="product-select-label"
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      label="Product"
                    >
                      {products.map((product) => (
                        <MenuItem key={product.id} value={product.id} disabled={product.quantity === 0}>
                          {product.name} (SKU: {product.sku}) - ${parseFloat(product.price).toFixed(2)} [Stock: {product.quantity}]
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    label="Quantity"
                    type="number"
                    value={selectedQuantity}
                    onChange={(e) => setSelectedQuantity(e.target.value)}
                    inputProps={{ min: 1 }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAddItem}
                    sx={{ height: "100%", borderRadius: 2 }}
                    disabled={!selectedProductId}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Order Items & Totals */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 1, minHeight: "100%" }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Order Items Summary
            </Typography>

            {orderItems.length > 0 ? (
              <>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Product Name</strong></TableCell>
                        <TableCell align="right"><strong>Price</strong></TableCell>
                        <TableCell align="center"><strong>Qty</strong></TableCell>
                        <TableCell align="right"><strong>Subtotal</strong></TableCell>
                        <TableCell align="center"><strong>Action</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderItems.map((item) => (
                        <TableRow key={item.product.id} hover>
                          <TableCell>{item.product.name}</TableCell>
                          <TableCell align="right">${parseFloat(item.product.price).toFixed(2)}</TableCell>
                          <TableCell align="center">
                            <TextField
                              type="number"
                              size="small"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.product.id, e.target.value)}
                              inputProps={{ min: 1, style: { textAlign: "center", width: "60px" } }}
                            />
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 500 }}>
                            ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton color="error" onClick={() => handleRemoveItem(item.product.id)} size="small">
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box display="flex" justifyContent="space-between" alignItems="center" mt={4} pt={2} sx={{ borderTop: "2px solid #eee" }}>
                  <Typography variant="h5" fontWeight="bold">
                    Running Total:
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    ${calculateTotal().toFixed(2)}
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<CheckoutIcon />}
                  onClick={handleSubmitOrder}
                  disabled={submitLoading}
                  sx={{ mt: 3, py: 1.5, borderRadius: 2, fontWeight: "bold" }}
                >
                  {submitLoading ? <CircularProgress size={24} color="inherit" /> : "Place Order"}
                </Button>
              </>
            ) : (
              <Box py={8} textAlign="center">
                <Typography variant="body1" color="text.secondary">
                  No items added to order yet. Select a product and quantity to get started.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderForm;
