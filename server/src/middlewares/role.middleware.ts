import { NextFunction, Request, Response } from "express";
import { prisma } from "../libs/prisma";

export const verifySeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
    });
    if (user?.role !== "seller") {
      return res
        .status(403)
        .json({ message: "Forbidden: Access is allowed for sellers only" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyBuyer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: No user ID found" });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (user?.role !== "buyer") {
      return res
        .status(403)
        .json({ message: "Forbidden: Access is allowed for buyers only" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
