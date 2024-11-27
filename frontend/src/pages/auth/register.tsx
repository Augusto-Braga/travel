import {
  Box,
  Button,
  FormHelperText,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const RegisterPage: React.FC = () => {
  const [serverError, setServerError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  const onSubmit = async ({
    name,
    email,
    password,
  }: {
    email: string;
    password: string;
    name: string;
  }) => {
    try {
      const response = await fetch("http://localhost:4000/api/users", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        navigate("/");
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
        Pagina de cadastro
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} className="w-96">
        <TextField
          {...register("name", {
            required: "Nome é obrigatória!",
            minLength: {
              value: 3,
              message: "Senha deve conter pelo menos 3 caracteres",
            },
            pattern: {
              value: /^[A-Za-zÀ-ÿ\s]+$/,
              message:
                "O nome não pode conter números ou caracteres especiais!",
            },
          })}
          type="name"
          label="Nome"
          placeholder="Seu Nome"
          color={errors.name ? "error" : "primary"}
          required
          fullWidth
          margin="normal"
        />
        {errors.name && (
          <FormHelperText error>{errors.name.message}</FormHelperText>
        )}
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
        <Button type="submit" variant="contained" color="primary">
          Cadastrar
        </Button>
        {serverError.length > 0 && (
          <FormHelperText error>{serverError}</FormHelperText>
        )}
      </form>
    </Box>
  );
};

export default RegisterPage;
