


import React from 'react'
import { Navigate, Outlet } from 'react-router'
import Loading from '../Components/loading/Loading'
import useGetAuthenticatedUser from '../../hooks/authenticated';

const ProtectedRoute = ({redirectPath='/login',children}) => {

    const user = useGetAuthenticatedUser()


    if (user.loading) return <Loading/>

    if (!user?.isAuthenticated){
        return <Navigate to={redirectPath} replace />
    }

    return children?children:<Outlet/>
}

export default ProtectedRoute