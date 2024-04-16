import express from 'express'
import { checkUserRole, isUserAuthenticated } from '../middleware/auth.js'
import { ALL_ROLES, SUPERUSER_ROLE } from '../constants/constants.js'

import { addLot, filterLot, getAllLot } from '../controllers/projects/lot.controller.js'



const router= express.Router()


router
.get('/all',isUserAuthenticated,checkUserRole(ALL_ROLES),getAllLot)
.get('/filter',isUserAuthenticated,checkUserRole([SUPERUSER_ROLE]),filterLot)
.post('/add',isUserAuthenticated,checkUserRole([SUPERUSER_ROLE]),addLot)


export default router