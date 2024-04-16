import { BadRequestError, HttpError } from "../errors/http.js";

export const handleError = (err, req, res, next) => {
    console.error(err);
    if (err.type === "entity.parse.failed") {
        err = new BadRequestError();
    }
    if (err instanceof HttpError) {
        res.status(err.statusCode).json({
            error: err.httpMessage,
            message: err.userMessage,
        });
    } else {
        res.status(500).json({
            error: "Internal Server Error",
            message: null,
        });
    }
};
