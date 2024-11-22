import { Request, Response, NextFunction } from "express";

export const validateJwtToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ error: "Acesso negado" });
  }

  next();
};
