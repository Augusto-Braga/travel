import { Request, Response } from "express";
import prisma from "../models/prismaClient";
import bcrypt from "bcrypt";
import { IEmailError } from "../types/emailError";

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Nome, email e senha são obrigatórios!" });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    if (error && (error as IEmailError).code) {
      const emailError = error as IEmailError;
      if (
        emailError.code === "P2002" &&
        emailError.meta.target[0] === "email"
      ) {
        return res.status(409).json({ error: "Email já cadastrado" });
      }
    }
    res.status(500).json({ error });
  }
};

export const listUsers = async (req: Request, res: Response) => {
  const { id } = req.query;

  try {
    if (id) {
      const user = await prisma.user.findUnique({
        where: { id: id as string },
      });

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado!" });
      }

      res.status(200).json(user);
    } else {
      const users = await prisma.user.findMany();

      res.status(200).json(users);
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar usuários" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.query;

  try {
    const deletedUser = await prisma.user.delete({
      where: { id: id as string },
    });

    return res.json({ message: "Usuário deletado com sucesso!" });
  } catch (error) {
    return res.status(500).json({ message: "Falha ao deletar usuário" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.query;
  const { name, email, password } = req.body;

  const dataToUpdate: any = {};

  const saltRounds = 10;

  if (name) dataToUpdate.name = name;
  if (email) dataToUpdate.email = email;
  if (password) dataToUpdate.password = await bcrypt.hash(password, saltRounds);

  try {
    const updatedUser = await prisma.user.update({
      where: { id: id as string },
      data: dataToUpdate,
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar usuário!" });
  }
};
