import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userLogin } from '../features/auth/authActions';
import { useEffect } from 'react';
import Error from '../components/Error';
import Spinner from '../components/Spinner';
import { setCredentials } from '../features/auth/authSlice';

const LoginScreen = () => {
  const { loading, userInfo, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { register, handleSubmit ,formState: {errors},getValues} = useForm();

  const navigate = useNavigate();

  // redirect authenticated user to profile screen
  useEffect(() => {
    console.log(userInfo,"userInfo");
    if (userInfo) {
      navigate('/user-profile');
    }
  }, [navigate, userInfo]);

  const submitForm = (data) => {
    dispatch(userLogin(data));
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      {error && <Error>{error}</Error>}
      <div className="form-group">
        <label htmlFor="email">
          Email <span className="text-danger">*</span>
        </label>
        <input
          type="email"
          className="form-input"
          {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
        />
        {errors.email?.type === 'required' && (
          <span className="text-danger">Email is required</span>
        )}
        {errors.email?.type === 'pattern' && (
          <span className="text-danger">Invalid email format</span>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="password">
          Password <span className="text-danger">*</span>
        </label>
        <input
          type="password"
          className="form-input"
          {...register('password', { required: true })}
        />
        {errors.password?.type === 'required' && (
          <span className="text-danger">Password is required</span>
        )}
        {errors.password?.type === 'minLength' && (
          <span className="text-danger">
            Password must be at least 8 characters long
          </span>
        )}
      </div>
      <button type="submit" className="btn btn-success" disabled={loading}>
        {loading ? <Spinner /> : 'Login'}
      </button>
    </form>
  );
};

export default LoginScreen;
