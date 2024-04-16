import express from 'express'
import {
    addUser,
    getAll,
    getUserInfo,
    updateProfile,
    updateProfileImage,
    authenticateUserWithToken,
    banUser,
    getPotentielProjectManager,
    changeUserRole,
    unBanUser,
    getPotentielIntervenants,
    getUserByID
} from '../controllers/users/user.controller.js'
import { checkUserRole, isUserAuthenticated } from '../middleware/auth.js'
// import uploader from '../middleware/imageUploader.js'
import createMulterMiddleware from '../middleware/uploader.js'
import { PROJECT_MANAGER_ROLE, SUPERUSER_ROLE } from '../constants/constants.js'


const router = express.Router()

const profileImageUploader = createMulterMiddleware('profileImage')

router
.get('/list',isUserAuthenticated,checkUserRole([SUPERUSER_ROLE]),getAll)
.post('/user_info',isUserAuthenticated,getUserInfo)
    .get("/user-info/:id",isUserAuthenticated,getUserByID)
.post('/add',isUserAuthenticated,checkUserRole([SUPERUSER_ROLE]),addUser)
.patch('/profile/change',isUserAuthenticated,profileImageUploader,updateProfile)
.patch('/profile/image/change',isUserAuthenticated,profileImageUploader,updateProfileImage)
.get('/confirmation/auth/1.0/token=:token',authenticateUserWithToken)
.patch('/change/user/role',isUserAuthenticated,checkUserRole([SUPERUSER_ROLE]),changeUserRole)
.patch('/ban/user/deactivate',isUserAuthenticated,checkUserRole([SUPERUSER_ROLE]),banUser)
.patch('/ban/user/activate',isUserAuthenticated,checkUserRole([SUPERUSER_ROLE]),unBanUser)
.get('/potentiel/manger/list',isUserAuthenticated,checkUserRole([SUPERUSER_ROLE,PROJECT_MANAGER_ROLE]),getPotentielProjectManager)
.get('/potentiel/intervenants/:projectID/list',isUserAuthenticated,checkUserRole([SUPERUSER_ROLE,PROJECT_MANAGER_ROLE]),getPotentielIntervenants)
export default router
