import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { logout } from "../store/authSlice";

const dashboardPage = () =>{
   const dispatch = useAppDispatch();
   const navigate = useNavigate();

   const handleLogout = () => {
      dispatch(logout());
      navigate("/login");
   };

   return( <div>
      <h1>Dashboard Page</h1>
      <button type="button" onClick={handleLogout}>Log out</button>
    </div>
  );
}

export default dashboardPage;