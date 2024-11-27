import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useUser } from "../contexts/userContext";
import Header from "../components/header";
import { MapContainer, Polyline, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngTuple } from "leaflet";
import polyline from "@mapbox/polyline";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [ismodalOpen, setIsModalOpen] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string>("");
  const [selectedDriver, setSelectedDriver] = useState<any>();
  const [route, setRoute] = useState<any[]>();
  const [startMap, setStartMap] = useState<LatLngTuple>([0, 0]);
  const [drivers, setDrivers] = useState<any[]>();
  const [distance, setDistance] = useState<string>();
  const [duration, setDuration] = useState<string>();
  const [ride, setRide] = useState<any>();
  const user = useUser();

  useEffect(() => {
    if (!user.id) user.fetchUser();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      origin: "",
      destination: "",
    },
  });

  const handleDriverChange = (selectedId: string) => {
    if (drivers) {
      const selectedDriver = drivers.find((driver) => driver.id === selectedId);
      setSelectedDriver(selectedDriver);
    }
  };

  const onSubmit = async ({
    origin,
    destination,
  }: {
    origin: string;
    destination: string;
  }) => {
    setServerError("");
    try {
      const response = await fetch("http://localhost:4000/ride/estimate", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ customer_id: user.id, origin, destination }),
      });

      if (response.ok) {
        const data = await response.json();
        setStartMap([data.origin.latitude, data.origin.longitude]);
        setDrivers(data.options);
        setDistance(`${(data.distance / 1000).toFixed(2)}km`);

        const time = data.duration.match(/\d+/)[0];
        const minutes = Math.floor(Number(time / 60));
        const seconds = Number(time % 60);
        setDuration(`${minutes}m:${seconds}s`);

        const decodedRoute = polyline.decode(data.encodedPolyline);

        setRoute(decodedRoute);

        setRide({
          customer_id: user.id,
          origin,
          destination,
          distance: data.distance / 1000,
          duration: data.duration,
        });
      } else {
        const errorData = await response.json();
        setServerError(errorData.error_description);
      }

      setIsModalOpen(true);
    } catch (error) {
      console.error("erro na requisição:", error);
    }
  };

  const confirmRide = async () => {
    try {
      const response = await fetch("http://localhost:4000/ride/confirm", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          customer_id: ride.customer_id,
          origin: ride.origin,
          destination: ride.destination,
          distance: ride.distance,
          duration: ride.duration,
          driver_id: selectedDriver.id,
          value: selectedDriver.value,
        }),
      });

      if (response.ok) {
        navigate("/rides");
      }
    } catch (error) {
      console.error("erro na requisição:", error);
    }
  };

  return (
    <>
      <Box display="flex" flexDirection="column" minHeight="100vh" padding={0}>
        {user.name && <Header userName={user.name} isHomepage={true} />}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          flexGrow={1}
        >
          <Typography variant="h4" gutterBottom>
            Simule sua viagem
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} className="w-96">
            <TextField
              {...register("origin", {
                required: "Endereço obrigatório!",
              })}
              type="text"
              label="Origem"
              placeholder="Rua Papa João XXIII, 361, São José dos Campos"
              color={errors.origin ? "error" : "primary"}
              required
              fullWidth
              margin="normal"
            />
            {errors.origin && (
              <FormHelperText error>{errors.origin.message}</FormHelperText>
            )}
            <TextField
              {...register("destination", {
                required: "Endereço obrigatório!",
              })}
              type="text"
              label="Destino"
              placeholder="Rua Deocliciano Borges de Oliveira, 126, São José dos Campos"
              color={errors.destination ? "error" : "primary"}
              required
              fullWidth
              margin="normal"
            />
            {errors.destination && (
              <FormHelperText error>
                {errors.destination.message}
              </FormHelperText>
            )}
            <Button type="submit" variant="contained" color="primary">
              Simular
            </Button>
            {serverError.length > 0 && (
              <FormHelperText error>{serverError}</FormHelperText>
            )}
          </form>
        </Box>
      </Box>
      <Dialog
        open={ismodalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="lg"
        sx={{
          width: "100vw",
        }}
      >
        <DialogTitle sx={{ width: "100vw" }}>Detalhes da viagem</DialogTitle>
        <DialogContent>
          <Typography variant="h6">Mapa</Typography>
          <Box height="300px" marginBottom={3}>
            <MapContainer
              center={startMap}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {route && (
                <Polyline positions={route.map((pos) => pos as LatLngTuple)} />
              )}
            </MapContainer>
          </Box>
          <Typography variant="body1">Duração da viagem: {duration}</Typography>
          <Typography variant="body1">
            Distância da viagem: {distance}
          </Typography>

          <Typography variant="h6">Selecione o Motorista</Typography>
          <RadioGroup
            value={selectedDriver}
            onChange={(e) => handleDriverChange(e.target.value)}
          >
            {drivers &&
              drivers.map((driver) => (
                <Card
                  key={driver.id}
                  variant="outlined"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                    p: 2,
                    gap: 2,
                  }}
                >
                  <FormControlLabel
                    value={driver.id}
                    control={<Radio />}
                    label=""
                    sx={{ alignSelf: "flex-start" }}
                  />

                  <CardContent>
                    <Typography variant="h6">{driver.name}</Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Veículo: {driver.vehicle}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {driver.description}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Preço por km: R$ {driver.price_per_km.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Distância mínima aceita pelo motorista: {driver.min_km}km
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Avaliação: {driver.review.rating} estrelas
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      "{driver.review.comment}"
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Valor da corrida: R${driver.value}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
          </RadioGroup>
          <Button
            variant="contained"
            color="primary"
            disabled={!selectedDriver}
            onClick={() => {
              confirmRide();
            }}
          >
            Confirmar
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HomePage;
