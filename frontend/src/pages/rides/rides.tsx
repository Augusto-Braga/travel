import { Box, Card, CardContent, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useUser } from "../../contexts/userContext";
import Header from "../../components/header";

interface IRide {
  id: string;
  customer_id: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver_id: string;
  value: number;
  createdAt: string;
  updatedAt: string;
  driver: {
    id: string;
    name: string;
  };
}

const RidesPage: React.FC = () => {
  const [rides, setRides] = useState<IRide[]>();
  const user = useUser();

  const formatDuration = (duration: string) => {
    if (duration) {
      const match = duration.match(/\d+/);
      if (match) {
        const time = Number(match[0]);
        const minutes = Math.floor(Number(time / 60));
        const seconds = Number(time % 60);

        return `${minutes}m:${seconds}s`;
      }
    } else {
      return undefined;
    }
  };

  const fetchRides = async () => {
    const params = new URLSearchParams({
      customer_id: user.id as string,
    });
    try {
      const response = await fetch(`http://localhost:8080/ride?${params}`);

      if (response.ok) {
        const data = await response.json();
        setRides(data);
      }
    } catch (error) {
      console.error("erro na requisição:", error);
    }
  };

  useEffect(() => {
    if (!user.id) {
      user.fetchUser();
    } else {
      fetchRides();
    }
  }, [user]);

  return (
    <Box display="flex" flexDirection="column" minWidth="100vw">
      {user.name && <Header userName={user.name} isHomepage={false} />}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        marginTop={5}
      >
        <Typography variant="h4">Minhas viagens</Typography>
        <Box
          gap={3}
          display="grid"
          gridTemplateColumns={{
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          }}
          width="70%"
          marginTop="30px"
        >
          {rides?.length === 0 && (
            <Typography variant="h5">Nenhuma viagem cadastrada!</Typography>
          )}
          {rides?.map((ride: any) => (
            <Card
              key={ride.id}
              sx={{
                width: "100%",
                height: "220px",
                display: "flex",
                alignItems: "center",
                overflow: "auto",
              }}
            >
              <CardContent>
                <Typography variant="body2">{`Origem: ${ride.origin}`}</Typography>
                <Typography variant="body2">{`Destino: ${ride.destination}`}</Typography>
                <Typography variant="body2">{`Distância: ${ride.distance.toFixed(
                  2
                )} km`}</Typography>
                <Typography variant="body2">{`Duração da corrida: ${formatDuration(
                  ride.duration
                )}`}</Typography>
                <Typography variant="body2">{`Valor pago: R$${ride.value}`}</Typography>
                <Typography variant="body2">{`Motorista: ${ride.driver.name}`}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default RidesPage;
