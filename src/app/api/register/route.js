import { User } from "@/models/User";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
export async function POST(req) {
  const body = await req.json();
  const MONGODB_URI = process.env.MONGO_URL;

  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local"
    );
  }
  mongoose.connect(MONGODB_URI);

  const pass = body.password;
  if (!pass?.length || pass.length < 5) {
    new Error("password must be  at least 5 charachters");
  }

  const notHashedPassword = pass;
  const salt = bcrypt.genSaltSync(10);
  body.password = bcrypt.hashSync(notHashedPassword, salt);

  const createdUser = await User.create(body);
  return Response.json(createdUser);
}
