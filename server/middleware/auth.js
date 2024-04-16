import passport from "passport";
import { getUserByEmail } from "../controllers/users/lib.js";
import logger from "../log/config.js";
import { ForbiddenError, UnauthorizedError } from "../errors/http.js";
import { UnAuthorized } from "../Utils/appError.js";

//passport strategy connection
export const authenticateUser = async (payload, done) => {
    try {
      const user = await getUserByEmail(payload.email);

      if (!user) return done(null, false);
      return done(null, user.dataValues);
    } catch (error) {
      logger.error(error)
      return done(null, false);
    }
  };


  export const isUserAuthenticated = (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err) {
        // Handle unexpected errors
        logger.error(err);
        return next(err);
      }
      if (!user) {
        // Custom response when user is not authenticated
        // throw new UnauthorizedError()
        next(new UnAuthorized("You are not authorized for this action."))
      }
      // If authentication succeeds, store user in request object
      req.user = user;
      next();
    })(req, res, next);
  };

  export const checkUserRole =(roles) =>(req, res, next) => {
    if (!roles.includes(req.user.role)){
        throw new ForbiddenError()

    }else{
        next();
    }
  };
