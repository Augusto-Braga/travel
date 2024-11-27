import { Request, Response } from "express";
import prisma from "../models/prismaClient";
import axios from "axios";

export const rideEstimate = async (req: Request, res: Response) => {
  const { customer_id, origin, destination } = req.body;

  try {
    if (!customer_id) {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "id do usuário não pode estar em branco!",
      });
    }

    if (!origin) {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "Endereço de saída está em branco!",
      });
    }

    if (!destination) {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "Endereço de destino está em branco!",
      });
    }

    if (destination === origin) {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description:
          "Os endereços de origem e destino não podem ser os mesmos!",
      });
    }

    const apiResponse = await axios.post(
      "https://routes.googleapis.com/directions/v2:computeRoutes",
      {
        origin: {
          address: origin,
        },
        destination: {
          address: destination,
        },
        travelMode: "DRIVE",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.GOOGLE_API_KEY,
          "X-Goog-FieldMask":
            "routes.duration,routes.distanceMeters,routes.legs.endLocation,routes.legs.startLocation,routes.polyline.encodedPolyline",
        },
      }
    );

    const drivers = await prisma.driver.findMany({
      orderBy: { price_per_km: "asc" },
    });

    const distanceKm = apiResponse.data.routes[0].distanceMeters / 1000;

    const driversResponse = drivers.map((driver) => ({
      ...driver,
      value: parseFloat((driver.price_per_km * distanceKm).toFixed(2)),
    }));

    const response = {
      origin: {
        latitude:
          apiResponse.data.routes[0].legs[0].startLocation.latLng.latitude,
        longitude:
          apiResponse.data.routes[0].legs[0].startLocation.latLng.longitude,
      },
      destination: {
        latitude:
          apiResponse.data.routes[0].legs[0].endLocation.latLng.latitude,
        longitude:
          apiResponse.data.routes[0].legs[0].endLocation.latLng.longitude,
      },
      distance: `${apiResponse.data.routes[0].distanceMeters}`,
      duration: apiResponse.data.routes[0].duration,
      options: driversResponse,
      encodedPolyline: apiResponse.data.routes[0].polyline.encodedPolyline,
      routeResponse: apiResponse.data,
    };

    res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      error_code: "SERVER_ERROR",
      error_description: "Erro do servidor",
      error,
    });
  }
};

export const rideConfirm = async (req: Request, res: Response) => {
  const {
    customer_id,
    origin,
    destination,
    distance,
    duration,
    driver_id,
    value,
  } = req.body;

  try {
    if (!customer_id) {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "id do usuário não pode estar em branco!",
      });
    }

    if (!origin) {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "Endereço de saída está em branco!",
      });
    }

    if (!destination) {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "Endereço de destino está em branco!",
      });
    }

    if (destination === origin) {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description:
          "Os endereços de origem e destino não podem ser os mesmos!",
      });
    }

    const driver = await prisma.driver.findUnique({
      where: { id: driver_id as string },
    });

    if (!driver) {
      return res.status(400).json({
        error_code: "INVALID_DRIVER",
        error_description: "id do motorista inválido",
      });
    }

    if (driver.min_km > distance) {
      return res.status(400).json({
        error_code: "INVALID_DISTANCE",
        error_description:
          "Distância mínima do motorista é incompatível com essa viagem",
      });
    }
    const newTrip = await prisma.trip.create({
      data: {
        customer_id,
        origin,
        destination,
        distance,
        duration,
        driver_id,
        value,
      },
    });

    res.status(201).json({ success: true });
  } catch (error) {
    return res.status(400).json({
      error_code: "SERVER_ERROR",
      error_description: "Erro do servidor",
      error,
    });
  }
};

export const listRides = async (req: Request, res: Response) => {
  const { customer_id, driver_id } = req.query;

  try {
    const user = await prisma.user.findUnique({
      where: { id: customer_id as string },
    });

    if (!user) {
      return res.status(400).json({
        error_code: "INVALID_CUSTOMER",
        error_description: "id do usuário inválido",
      });
    }

    if (driver_id) {
      const driver = await prisma.driver.findUnique({
        where: { id: driver_id as string },
      });

      if (!driver) {
        return res.status(400).json({
          error_code: "INVALID_DRIVER",
          error_description: "id do motorista inválido",
        });
      }

      const trips = await prisma.trip.findMany({
        where: {
          customer_id: customer_id as string,
          driver_id: driver_id as string,
        },
        include: {
          driver: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      return res.status(200).json(trips);
    }

    const trips = await prisma.trip.findMany({
      where: {
        customer_id: customer_id as string,
      },
      include: {
        driver: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return res.status(200).json(trips);
  } catch (error) {
    return res.status(400).json({
      error_code: "SERVER_ERROR",
      error_description: "Erro do servidor",
      error,
    });
  }
};

export const listDrivers = async (req: Request, res: Response) => {
  try {
    const response = await prisma.driver.findMany({
      orderBy: { price_per_km: "asc" },
    });

    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({
      error_code: "SERVER_ERROR",
      error_description: "Erro do servidor",
      error,
    });
  }
};
