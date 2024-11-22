import { Typography } from "@mui/material";
import React from "react";
import { useUser } from "../contexts/userContext";

const HomePage: React.FC = () => {
  const { name } = useUser();

  return <Typography variant="h1">{`Hello ${name}`}</Typography>;
};

export default HomePage;
