import { createUser } from "../src/controllers/userController";
import { Request, Response } from "express";
import prisma from "../src/models/prismaClient";

jest.mock("../src/models/prismaClient", () => ({
  user: {
    create: jest.fn(),
  },
}));

describe("User Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new user", async () => {
    const reqBody = {
      name: "Test Name",
      email: "test@example.com",
      password: "12345",
    };

    const req = {
      body: reqBody,
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: "some-unique-id",
      name: reqBody.name,
      email: reqBody.email,
      password: reqBody.password,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: true,
      role: "user",
    });

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ email: "test@example.com" })
    );
  });
});
