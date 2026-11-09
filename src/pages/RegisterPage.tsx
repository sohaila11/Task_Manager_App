import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { RegisterErrors, validateRegister } from "../utils/validation";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { clearError, register } from "../store/authSlice";


const RegisterPage = () => {

const dispatch = useAppDispatch();
const navigate = useNavigate();

useEffect(() => {
 dispatch(clearError());
}, [dispatch]);


const [formData, setFormData] = useState({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
});


const [validationErrors, setValidationErrors] = useState({});

const {user, loading, error: formError, fieldErrors } = useAppSelector((state) => state.auth);

const errors : RegisterErrors = { ...validationErrors , ...fieldErrors };

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
       name: formData.name.trim(),
       email: formData.email.trim(),
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
          <label htmlFor="name">Full Name:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
          {errors.name && (<div className="field-error">{errors.name}</div>)}
          </div>
          <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
          </div>
          {errors.email && (<div className="field-error">{errors.email}</div>)}
          <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
          </div>
          {errors.password && (<div className="field-error">{errors.password}</div>)}
          <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}/>
          </div>
          {errors.confirmPassword && (<div className="field-error">{errors.confirmPassword}</div>)}
          <button className="btn-primary" type="submit">Sign up</button>
          <p className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></p>
        </form>
    </main>
  );
};

export default RegisterPage;
