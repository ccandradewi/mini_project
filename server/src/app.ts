import cors from "cors";
import { PORT, corsOptions } from "./config/config";
import express, {
    type Application,
    type NextFunction,
    type Request,
    type Response,
  } from "express";

export  class App {
    private app: Application;
    constructor() {
        this.app = express();
        this.configure();
        this.routes();
        this.errorHandler;
    }

    private routes() {
        this.app.use("/*", (req: Request, res:Response) => {
            res.send("Welcome to Ticketing App API!");
        });
        // this.app.use("/users", userRouter.getRouter());
        // this.app.use("/event", eventRouter.getRouter())
    }

    private errorHandler()  {
        this.app.use("/*", (req:Request, res:Response) => {
            res.status(404).send("Page not found");
        });

        this.app.use((error: unknown, req:Request, res: Response, next:NextFunction) => {
            if (error instanceof Error) res.status(500).send({
                message: error.message,
            });
        })

    }

    private configure() {
        this.app.use(express.json());
        this.app.use(express.urlencoded());
        this.app.use(cors(corsOptions));
    }

    public start() {
        this.app.listen(PORT, () => {
            console.log("API is running on port", PORT);
        });
    }
}