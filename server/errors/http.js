class HttpError extends Error {
    statusCode = null;
    httpMessage = null;
    userMessage = null;
    constructor({ statusCode, httpMessage, userMessage } = {}) {
        super();
        if (statusCode) this.statusCode = statusCode;
        if (httpMessage) this.httpMessage = httpMessage;
        if (userMessage) this.userMessage = userMessage;
    }
}

class NotFoundError extends HttpError {
    statusCode = 404;
    httpMessage = "Not Found";
}

class BadRequestError extends HttpError {
    statusCode = 400;
    httpMessage = "Bad Request";
}

class UnauthorizedError extends HttpError {
    statusCode = 401;
    httpMessage = "You are not authorized for this action.";
}

class InternalServerError extends HttpError {
    statusCode = 500;
    httpMessage = "Internal Server Error";
}

class ForbiddenError extends HttpError {
    statusCode = 403;
    httpMessage = "Forbidden";
}

class ConflictError extends HttpError {
    statusCode = 409;
    httpMessage = "Conflict";
}

export {
    HttpError,
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
    InternalServerError,
    ForbiddenError,
    ConflictError,
};
