import "dotenv/config";
import { CorsOptions } from "cors";

export const PORT = process.env.PORT || 6000;

export const SECRET_KEY = process.env.SECRET_KEY || "";

export const corsOptions: CorsOptions = {
    origin: ["http://localhost:3000"], //url localhost frontend
    credentials: true,
}