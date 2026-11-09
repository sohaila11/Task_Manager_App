import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { RegisterErrors, validateRegister } from "../utils/validation";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { clearError, register } from "../store/authSlice";


const RegisterPage = () => {

const dispatch = useAppDispatch();
const navigate = useNavigate();

const [formData, setFormData] = useState({
  fullname: '',
  email: '',
  password: '',
  confirmPassword: ''
});


const [validationErrors, setValidationErrors] = useState({});

const {user, loading, error: formError, fieldErrors } = useAppSelector((state) => state.auth);

const errors : RegisterErrors = { ...validationErrors , ...fieldErrors };

useEffect(() => {
 dispatch(clearError());
}, [dispatch]);

if(user) return <Navigate to="/dashboard" replace/>;

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
  setValidationErrors(prev => ({ ...prev, [name]: undefined }));
  dispatch(clearError())
};

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
   const validation = validateRegister(formData);
   setValidationErrors(validation);
   if (Object.keys(validation).length > 0) return;

   const result = await dispatch(
     register({ 
       fullname: formData.fullname,
       email: formData.email,
       password: formData.password,
       confirmPassword: formData.confirmPassword
     })
   );
   if (register.fulfilled.match(result)) {
       navigate('/login', { replace: true });
     }
};


  return (
    <main className="auth-page">
        <form className="auth-card" onSubmit={handleSubmit} noValidate>
          <h1 className="auth-title">Sign up</h1>
          <p className="auth-subtitle">Create your account to get started with Task Flow </p>
          {formError && (<div className="auth-alert" role="alert">{formError}</div>)}
          <div className="form-group">
          <label htmlFor="fullname">Full Name:</label>
          <input type="text" id="fullname" name="fullname" value={formData.fullname} onChange={handleChange} />
          {errors.fullname && (<div className="form-error">{errors.fullname}</div>)}
          </div>
          <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
          </div>
          {errors.email && (<div className="form-error">{errors.email}</div>)}
          <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
          </div>
          {errors.password && (<div className="form-error">{errors.password}</div>)}
          <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}/>
          </div>
          {errors.confirmPassword && (<div className="form-error">{errors.confirmPassword}</div>)}
          <button className="btn-primary" type="submit">Sign up</button>
          <p className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></p>
        </form>
    </main>
  );
};

export default RegisterPage;
