import React from 'react'
import { Outlet, Navigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../slicers/authSlice"

const PrivateRoute = () => {
  const { userInfo } = useSelector(state => state.auth)

  const dispatch = useDispatch()
  const isCookieExists = new Date(userInfo?.loggedInTime).getTime() + 5 * 24 * 60 * 60 * 1000 > new Date().getTime()
  !isCookieExists && dispatch(logout())
  return userInfo && isCookieExists ? <Outlet /> : <Navigate to="/login" replace />
}

export default PrivateRoute
