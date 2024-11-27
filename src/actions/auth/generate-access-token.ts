import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

export function generateAccessToken(user: User) {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.AUTH_SECRET!,
    { expiresIn: "5h" }
  );
}
