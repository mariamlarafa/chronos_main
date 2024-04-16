import { Box } from '@mui/system'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import useGetAuthenticatedUser from '../../hooks/authenticated'
import useIsPathValid from '../../hooks/path'
import { toggleSideBar } from '../../store/reducers/sidebar.reducer'
import { styles } from './style'

const PageNotFound = () => {
  const classes = styles()
  const dispatch = useDispatch()
  const {user} = useGetAuthenticatedUser()
  const navigate = useNavigate()
  const isPathValid = useIsPathValid()


  useEffect(() => {
    dispatch(toggleSideBar(true))
    if ((!user || !user?.isAuthenticated) && isPathValid){
      navigate('/login')
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[user,isPathValid])

  return (
    <div className={classes.pageNotFound}>
      <Box className={classes.box}>
      <div className='number'>404</div>
      <div className='message'>Opps ! page non trouvée. vous pouvez aller sur votre page
    {" "}
      <NavLink to='/'>

      d'accueil
      </NavLink>
      </div>
      </Box>
    </div>
  )
}

export default PageNotFound