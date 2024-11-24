import { Request, Response } from "express";
import prisma from "../models/prismaClient";
import axios from "axios";

export const rideEstimate = async (req: Request, res: Response) => {
  const { customer_id, origin, destination } = req.body;

  try {
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
            "routes.duration,routes.distanceMeters,routes.legs.endLocation,routes.legs.startLocation",
        },
      }
    );

    const driversResponse = await prisma.driver.findMany();

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
      distance: `${apiResponse.data.routes[0].distanceMeters}m`,
      duration: apiResponse.data.routes[0].duration,
      options: driversResponse,
      routeResponse: apiResponse.data,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
  }
};
