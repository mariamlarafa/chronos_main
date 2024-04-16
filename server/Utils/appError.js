class AppError extends Error {
    constructor(message,statusCode){
        super(message);
        this.statusCode=statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : "error";
    }

}

 class MissingParameter extends Error {
    constructor(message, param) {
      super(message);
      this.name = 'MissingParameter';
      this.code = 422;
      this.param = param;
    }
  }
  class ElementNotFound extends Error {
    constructor(message, param) {
      super(message);
      this.name = 'ElementNotFound';
      this.code = 404;
      this.param = param;
    }
  }
 class MalformedObjectId extends Error {
    constructor(message, param) {
      super(message);
      this.name = 'MalformedObjectId';
      this.code = 400;
      this.param = param;
    }
  }
 class UnknownError extends Error {
    constructor(message) {
      super(message);
      this.name = 'UnknownError';
      this.code = 500;
    }
  }
 class UnAuthorized extends Error {
    constructor(message) {
      super(message);
      this.name = 'UnAuthorized';
      this.code = 500;
    }
  }
 class NothingChanged extends Error {
    constructor(message) {
      super(message);
      this.name = 'No changes has been made';
      this.code = 304;
    }
  }


export {
    UnAuthorized,
    UnknownError,
    MalformedObjectId,
    ElementNotFound,
    MissingParameter,
    AppError,
    NothingChanged

};