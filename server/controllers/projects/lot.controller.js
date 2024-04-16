import { Op } from "sequelize";
import { AppError, MissingParameter } from "../../Utils/appError.js";
import { catchAsync } from "../../Utils/catchAsync.js";
import { Lot } from "../../db/relations.js";
import { messages } from "../../i18n/messages.js";

/*
 * an api to get all the lots
 */
export const getAllLot = catchAsync(async (req, res, next) => {
  const lots = await Lot.findAll({

    attributes: ["name"]
  });
  if (!lots) return next(new AppError(messages["500"], 500));
  return res.status(200).json({ status: "success", lots });
});

/*
 * an api to add a lot :
 * accepts an object :
 * {
 *  name: string (UNIQUE)
 * }
 */

export const addLot = catchAsync(async (req, res, next) => {
  const lot = req.body;

  if (!lot.name) return next(new MissingParameter("the lot name is mandatory"));

  const isLotExist = await Lot.findOne({ where: { name: lot.name } });

  if (isLotExist) return next(new AppError("lot already exist", 400));

  const newLot = await Lot.create({ ...lot });

  if (!newLot) return next(new AppError("Something went wrong", 500));
  return res.status(200).json({ status: "success", lot: newLot });
});


/*
* an api to a a filters on the lot
* probably won't need it
* it accepts a param query
*/
export const filterLot = catchAsync(async (req, res, next) => {
  const filters = req.query;
  const lots = await Lot.findAll({ where: filters });
  if (!lots) return next(new AppError("Something went wrong", 500));
  return res.status(200).json({ status: "success", lots });
});

/*
 * accepts an  array  of lots to verify if all of them are real
 */
export const isLotsValid = async (lotsArray) => {

  if (!Array.isArray(lotsArray)) lotsArray = new Array(lotsArray);
  var lotsIDs = [];
  const queryParams = []
    lotsArray.forEach((element) => {
      queryParams.push({
        name: element
      })
    })

    const query = await Lot.findAll({
      where: {
        [Op.or]: queryParams
      }
    });
   if (!query) return null
   if (query.length !== lotsArray.length) return null

   query.forEach((element) => {
    lotsIDs.push(element.id)
  })

  return lotsIDs

};
