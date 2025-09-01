import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const RotaPrivadaLayout = () => {
    const usuario = localStorage.getItem("usuario") ? true : false
    
    return (
        usuario?<Outlet/> : <Navigate to="/login" replace/>
    )
}

export default RotaPrivadaLayout