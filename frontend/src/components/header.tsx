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
  return (
    <Box display="flex" justifyContent="space-around" padding={4}>
      <Typography variant="h5">{`Olá ${userName}!`}</Typography>
      {isHomepage && (
        <Link to={"/rides"}>
          <Button>Ver minhas viagens</Button>
        </Link>
      )}
      {!isHomepage && (
        <Link to={"/home"}>
          <Button>Simular Viagem</Button>
        </Link>
      )}
    </Box>
  );
};

export default Header;
