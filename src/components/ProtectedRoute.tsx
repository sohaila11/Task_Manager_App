import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";


const ProtectedRoute=()=>{
    const user = useAppSelector(state => state.auth.user);
    return user ? <Outlet /> : <Navigate to="/login" replace />

}
export default ProtectedRoute;