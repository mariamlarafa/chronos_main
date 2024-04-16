import express from 'express'
import { checkUserRole, isUserAuthenticated } from '../middleware/auth.js'
import { ALL_ROLES, SUPERUSER_ROLE } from '../constants/constants.js'
import { addPhase, filterPhase, getAllPhases } from '../controllers/projects/phase.controller.js'



const router= express.Router()


router
.get('/all',isUserAuthenticated,checkUserRole(ALL_ROLES),getAllPhases)
.get('/filter',isUserAuthenticated,checkUserRole([SUPERUSER_ROLE]),filterPhase)
.post('/add',isUserAuthenticated,checkUserRole([SUPERUSER_ROLE]),addPhase)


export default router