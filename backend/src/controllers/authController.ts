import { Request, Response } from "express";
import prisma from "../models/prismaClient";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUser } from "../types/user";
import { IJwtUserDecodedUser } from "../types/jwtDecodedUser";

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ error: "Usuário não encontrado" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ error: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      { userId: user.id },
      "qB5cH06sghEz27g0aoRt7fFnL6MzefAkdrg7MaxS0BhlVZ9RDOrU9V4Cgkrz4lxqY8ForeqhgUteET0NmXZmXA==",
      {
        expiresIn: "5h",
      }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Erro ao efetuar login" });
  }
};

export const getLoggedUser = async (req: Request, res: Response) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  let jwtDecodedUser: IJwtUserDecodedUser = { userId: "", iat: 0, exp: 0 };

  if (!token) {
    return res.status(403).json({ error: "Acesso negado" });
  }

  jwt.verify(
    token as string,
    "qB5cH06sghEz27g0aoRt7fFnL6MzefAkdrg7MaxS0BhlVZ9RDOrU9V4Cgkrz4lxqY8ForeqhgUteET0NmXZmXA==",
    (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Token inválido" });
      }

      (req as Request & { user: IUser }).user = decoded as IUser;
      jwtDecodedUser = decoded as IJwtUserDecodedUser;
    }
  );

  const userId = jwtDecodedUser.userId;

  if (!userId) {
    return res
      .status(400)
      .json({ error: "ID do usuário não encontrado no token" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const response: Partial<IUser> = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
};
