import {
  AppError,
  MalformedObjectId,
  MissingParameter
} from "../../Utils/appError.js";
import { catchAsync } from "../../Utils/catchAsync.js";
import Phase from "../../models/project/Phase.model.js";
/*
 * an api to get all the phases
 */
export const getAllPhases = catchAsync(async (req, res, next) => {
  const phases = await Phase.findAll(
   { attributes: ["name","abbreviation"]}
  );
  if (!phases) return next(new AppError(messages["500"], 500));
  return res.status(200).json({ status: "success", phases });
});
/*
 * an api to add a phase :
 * accepts an object :
 * {
 *  name: string (UNIQUE)
 * }
 */
export const addPhase = catchAsync(async (req, res, next) => {
  const phase = req.body;

  if (!phase.name)
    return next(new MissingParameter("the phase name is mandatory"));
  if (phase.name.length !== 3)
    return next(
      new MalformedObjectId(
        "The name of the phase must be at most 3 characters"
      )
    );

  const isPhaseExist = await Phase.findOne({where:{name:phase.name.toUpperCase()}})

  if (isPhaseExist) return next(new AppError("Phase already exist",400))


  if (!phase.abbreviation) {
    phase.abbreviation = phase.name[1];
  }
  console.log(phase);
  const newPhase = await Phase.create({ ...phase });
  if (!newPhase) return next(new AppError(messages["500"], 500));
  return res.status(200).json({ status: "success", phase: newPhase });
});
/*
* an api to a a filters on the phases
* probably won't need it
* it accepts a param query
*/
export const filterPhase = catchAsync(async (req, res, next) => {
const filters= req.query
  const phases = await Phase.findAll({where:filters});
  if (!phases) return next(new AppError(messages["500"], 500));
  return res.status(200).json({ status: "success", phases });

});


export const getPhaseByName=async (name)=>{
  const phase = await Phase.findOne({where:{name}})
  return phase


}

