import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await API.get("/orders", {
        params: {
          page: page + 1,
          limit: rowsPerPage,
        },
      });
      setOrders(response.data.orders);
      setTotalOrders(response.data.count);
    } catch (err) {
      console.error(err);
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "COMPLETED":
        return <Chip label="COMPLETED" color="success" size="small" sx={{ fontWeight: "bold" }} />;
      case "CANCELLED":
        return <Chip label="CANCELLED" color="error" size="small" sx={{ fontWeight: "bold" }} />;
      case "PENDING":
      default:
        return <Chip label="PENDING" color="warning" size="small" sx={{ fontWeight: "bold" }} />;
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order? If it is not cancelled, the inventory stock will be restored.")) return;
    try {
      await API.delete(`/orders/${id}`);
      toast.success("Order deleted successfully");
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete order");
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Orders
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Process invoices, track shipment status, and review billing history.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={Link}
          to="/orders/new"
          sx={{ borderRadius: 2, fontWeight: "bold" }}
        >
          Create Order
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 1 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={8}>
            <CircularProgress />
          </Box>
        ) : orders.length > 0 ? (
          <>
            <Table>
              <TableHead sx={{ bgcolor: "#fafafa" }}>
                <TableRow>
                  <TableCell><strong>Order ID</strong></TableCell>
                  <TableCell><strong>Customer</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell align="right"><strong>Total Amount</strong></TableCell>
                  <TableCell align="center"><strong>Status</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>
                      {order.customer ? order.customer.name : "Unknown"}
                    </TableCell>
                    <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      ${parseFloat(order.totalAmount).toFixed(2)}
                    </TableCell>
                    <TableCell align="center">{getStatusChip(order.status)}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/orders/${order.id}`)}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteOrder(order.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalOrders}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        ) : (
          <Box py={8} textAlign="center">
            <Typography variant="body1" color="text.secondary">
              No orders found.
            </Typography>
          </Box>
        )}
      </TableContainer>
    </Box>
  );
};

export default Orders;
