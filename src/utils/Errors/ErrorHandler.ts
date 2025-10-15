import { InternalAppError } from "./InternalAppError";
import { ErrorRequestHandler } from "express";
import { ZodError, treeifyError  } from "zod";

export const errorHandler: ErrorRequestHandler = (e, req, res, _n) => {
    if(e instanceof InternalAppError){
        res.status(e.statusCode).json({message: e.message });
        return
    }
    if(e instanceof ZodError){
        res.status(400)
            .json({message: "Validation error",
                errors: treeifyError(e),
            });
        return
    } 
    return res.status(500).json({message: e.message });
}