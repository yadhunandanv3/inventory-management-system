import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthContext } from "../context/AuthContext";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import { toast } from "react-toastify";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg("");
    const res = await login(data.email, data.password);
    setLoading(false);

    if (res.success) {
      toast.success("Welcome to Inventory Management System!");
      navigate("/");
    } else {
      setErrorMsg(res.message);
      toast.error(res.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1a237e 0%, #0d47a1 50%, #01579b 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="xs">
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box textAlign="center" mb={3}>
              <Typography
                variant="h4"
                fontWeight="bold"
                color="primary"
                gutterBottom
              >
                Sign In
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Inventory & Order Management System
              </Typography>
            </Box>

            {errorMsg && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMsg}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                fullWidth
                label="Email Address"
                margin="normal"
                type="email"
                variant="outlined"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Invalid email format",
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              <TextField
                fullWidth
                label="Password"
                margin="normal"
                type="password"
                variant="outlined"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 3,
                  py: 1.5,
                  fontWeight: "bold",
                  borderRadius: 2,
                  boxShadow: "0 4px 14px 0 rgba(21, 101, 192, 0.4)",
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
              </Button>
            </form>

            <Box mt={3} textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Use <strong>admin@example.com</strong> / <strong>admin123</strong> to log in.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
