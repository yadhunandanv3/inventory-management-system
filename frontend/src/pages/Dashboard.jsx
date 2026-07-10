import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import {
  Grid,
  Paper,
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Inventory as InventoryIcon,
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await API.get("/dashboard/stats");
      setStats(response.data.stats);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const statCards = [
    {
      title: "Total Products",
      value: stats?.totalProducts ?? 0,
      icon: <InventoryIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
      bgColor: "#e3f2fd",
    },
    {
      title: "Total Customers",
      value: stats?.totalCustomers ?? 0,
      icon: <PeopleIcon sx={{ fontSize: 40, color: "#2e7d32" }} />,
      bgColor: "#e8f5e9",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders ?? 0,
      icon: <ShoppingCartIcon sx={{ fontSize: 40, color: "#ed6c02" }} />,
      bgColor: "#fff3e0",
    },
    {
      title: "Low Stock Products",
      value: stats?.lowStockCount ?? 0,
      icon: <WarningIcon sx={{ fontSize: 40, color: "#d32f2f" }} />,
      bgColor: "#ffebee",
    },
  ];

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's a quick look at your inventory health and activity.
        </Typography>
      </Box>

      {/* KPI Stats Grid */}
      <Grid container spacing={3} mb={4}>
        {statCards.map((card, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight="medium" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="h3" fontWeight="bold">
                      {card.value}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: card.bgColor, display: "flex" }}>
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Low Stock Alerts */}
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <WarningIcon color="error" />
            <Typography variant="h6" fontWeight="bold">
              Low Stock Alerts (Stock &lt; 10)
            </Typography>
          </Box>
          <Chip label={`${stats?.lowStockCount ?? 0} items`} color="error" size="small" />
        </Box>
        <Divider sx={{ mb: 2 }} />

        {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Product Name</strong></TableCell>
                  <TableCell><strong>SKU</strong></TableCell>
                  <TableCell align="right"><strong>Price</strong></TableCell>
                  <TableCell align="right"><strong>Stock Status</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats.lowStockProducts.map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell>
                      <Link to={`/products`} style={{ textDecoration: "none", color: "#1976d2", fontWeight: 500 }}>
                        {product.name}
                      </Link>
                    </TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell align="right">${parseFloat(product.price).toFixed(2)}</TableCell>
                    <TableCell align="right">
                      <Chip
                        label={`${product.quantity} remaining`}
                        color={product.quantity === 0 ? "error" : "warning"}
                        size="small"
                        sx={{ fontWeight: "bold" }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box py={4} textAlign="center">
            <Typography variant="body1" color="text.secondary">
              All products are fully stocked! No low stock alerts.
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

import { Divider } from "@mui/material";

export default Dashboard;
