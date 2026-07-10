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
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search & Pagination State
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);

  // Delete Dialog State
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await API.get("/products", {
        params: {
          search: search,
          page: page + 1,
          limit: rowsPerPage,
        },
      });
      setProducts(response.data.products);
      setTotalProducts(response.data.count);
    } catch (err) {
      console.error(err);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, page, rowsPerPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(inputValue);
    setPage(0);
  };

  const handleClearSearch = () => {
    setInputValue("");
    setSearch("");
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDelete = (id) => {
    setSelectedProductId(id);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setSelectedProductId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProductId) return;
    try {
      setDeleteLoading(true);
      await API.delete(`/products/${selectedProductId}`);
      toast.success("Product deleted successfully");
      handleCloseDelete();
      // If last product on page was deleted, go back a page
      if (products.length === 1 && page > 0) {
        setPage(page - 1);
      } else {
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to delete product";
      toast.error(msg);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Products
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage inventory item details, stock quantities, and pricing.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={Link}
          to="/products/new"
          sx={{ borderRadius: 2, fontWeight: "bold" }}
        >
          Add Product
        </Button>
      </Box>

      {/* Search Header */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 3, boxShadow: 1 }}>
        <form onSubmit={handleSearchSubmit}>
          <TextField
            fullWidth
            placeholder="Search by Name or SKU..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: inputValue && (
                <InputAdornment position="end">
                  <IconButton onClick={handleClearSearch} size="small">
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ "& fieldset": { borderRadius: "10px" } }}
          />
        </form>
      </Paper>

      {/* Main Table */}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 1 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={8}>
            <CircularProgress />
          </Box>
        ) : products.length > 0 ? (
          <>
            <Table>
              <TableHead sx={{ bgcolor: "#fafafa" }}>
                <TableRow>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Product Name</strong></TableCell>
                  <TableCell><strong>SKU</strong></TableCell>
                  <TableCell align="right"><strong>Price</strong></TableCell>
                  <TableCell align="right"><strong>Stock Qty</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell>{product.id}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{product.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell align="right">${parseFloat(product.price).toFixed(2)}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold", color: product.quantity < 10 ? "error.main" : "inherit" }}>
                      {product.quantity}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/products/edit/${product.id}`)}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDelete(product.id)}
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
              count={totalProducts}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        ) : (
          <Box py={8} textAlign="center">
            <Typography variant="body1" color="text.secondary">
              No products found.
            </Typography>
          </Box>
        )}
      </TableContainer>

      {/* Delete Dialog */}
      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDelete} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteLoading}
            sx={{ fontWeight: "bold" }}
          >
            {deleteLoading ? <CircularProgress size={20} color="inherit" /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products;
