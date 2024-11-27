import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import React from "react";

const Header = ({
  userName,
  isHomepage,
}: {
  userName: string;
  isHomepage: boolean;
}) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
  };

  return (
    <Box display="flex" justifyContent="space-around" padding={4}>
      <Typography variant="h5">{`Olá ${userName}!`}</Typography>
      <Box display="flex">
        {isHomepage && (
          <Link to={"/rides"}>
            <Button>Ver minhas viagens</Button>
          </Link>
        )}
        {!isHomepage && (
          <Link to={"/home"} onClick={handleLogout}>
            <Button>Simular Viagem</Button>
          </Link>
        )}
        <Link to={"/"}>
          <Button color="error">Sair</Button>
        </Link>
      </Box>
    </Box>
  );
};

export default Header;
