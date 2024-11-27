import {
  Box,
  Button,
  FormHelperText,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/userContext";

const LoginPage: React.FC = () => {
  const [serverError, setServerError] = useState<string>("");
  const { fetchUser } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  const onSubmit = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);

        await fetchUser();

        navigate("/home");
      } else {
        const errorData = await response.json();
        setServerError(errorData.error);
      }
    } catch (error) {
      console.error("erro na requisição:", error);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      padding={3}
    >
      <Typography variant="h4" gutterBottom>
        Login page
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} className="w-96">
        <TextField
          {...register("email", {
            required: "Email é obrigatório!",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Precisa ser um email válido!",
            },
          })}
          type="text"
          label="Email"
          placeholder="voce@exemplo.com"
          color={errors.email ? "error" : "primary"}
          required
          fullWidth
          margin="normal"
        />
        {errors.email && (
          <FormHelperText error>{errors.email.message}</FormHelperText>
        )}
        <TextField
          {...register("password", {
            required: "senha é obrigatória!",
            minLength: {
              value: 5,
              message: "Senha deve conter pelo menos 5 caracteres",
            },
          })}
          type="password"
          label="Senha"
          placeholder="********"
          color={errors.password ? "error" : "primary"}
          required
          fullWidth
          margin="normal"
        />
        {errors.password && (
          <FormHelperText error>{errors.password.message}</FormHelperText>
        )}
        <Button type="submit" variant="contained" color="primary">
          Login
        </Button>
        <Link to={"/register"}>
          <Button variant="contained" color="secondary">
            register
          </Button>
        </Link>
        {serverError.length > 0 && (
          <FormHelperText error>{serverError}</FormHelperText>
        )}
      </form>
    </Box>
  );
};

export default LoginPage;
