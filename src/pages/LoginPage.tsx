import { useNavigate ,Navigate, Link } from 'react-router-dom';
import '../index.scss';
import { useState, ChangeEvent, FormEvent } from 'react';
import {validateLogin, type LoginErrors} from '../utils/validation';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { login, clearError } from '../store/authSlice';


const LoginPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { user, loading, error: formError, fieldErrors } = useAppSelector((state) => state.auth);
    const [validationErrors, setValidationErrors] = useState<LoginErrors>({});

    if (user) return <Navigate to="/dashboard" replace />;

    const errors: LoginErrors = { ...validationErrors , ...fieldErrors };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setValidationErrors(prev => ({ ...prev, [name]: undefined }));
        dispatch(clearError());
    };

    const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validation = validateLogin(formData);
    setValidationErrors(validation);
    if (Object.keys(validation).length > 0) return;

  const result =await dispatch(
    login({email:formData.email, password:formData.password}),
  );
  if (login.fulfilled.match(result)) {
    navigate('/dashboard', { replace: true });
  }
}


    return (
        <main className="auth-page">
            <form className="auth-card" onSubmit={handleSubmit}>
                <h1 className="auth-title">Sign in</h1>
                <p className='auth-subtitle'> Task Flow</p>
                <p>Continue to your work space</p>
                {formError && (<div className="auth-alert" role="alert">{formError}</div>)}
                <div className="form-group">
                <label htmlFor="email">email:</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                {errors.email && <span className="field-error">{errors.email}</span>}
                </div>
                <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" onChange={handleChange} value={formData.password} />
                {errors.password && <span className="field-error">{errors.password}</span>}
                </div>
                <button className="btn-primary" type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
                <p className="auth-footer">Don't have an account? <Link to="/register">Sign up</Link></p>
            </form>
        </main>
    );
}
export default LoginPage;


