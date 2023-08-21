import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Error from "../components/Error";
import Spinner from "../components/Spinner";
import { referenceList, registerUser } from "../features/auth/authActions";

const RegisterScreen = () => {
  const [customError, setCustomError] = useState(null);
  const [options, setOptions] = useState();

  const { loading, userInfo, error, success, data } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(referenceList(data));
    setOptions(data);
  }, []);
  useEffect(() => {
    // redirect authenticated user to profile screen
    if (userInfo) navigate("/user-profile");
    setOptions(data);
    // redirect user to login page if registration was successful
    // if (!success) navigate("/login");
  }, [userInfo, navigate, data]);

  const submitForm = (data) => {
    // check if passwords match
    if (data.password !== data.confirmPassword) {
      setCustomError("Password mismatch");
      return;
    }
    // transform email string to lowercase to avoid case sensitivity issues in login
    data.email = data.email.toLowerCase();
    if (error) {
      setCustomError(error);
    }
    if (success) {
      setTimeout(() => {
        dispatch(registerUser(data));
        navigate("/login");
      }, 1000);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      {error && <Error>{error}</Error>}
      {customError && <Error>{customError}</Error>}

      <div className="form-group">
        <label htmlFor="firstName">
          First Name <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className="form-input"
          {...register("firstName", { required: true, minLength: 5 })}
        />
        {errors.firstName?.type === "required" && (
          <span className="text-danger">Name is required</span>
        )}
        {errors.firstName?.type === "minLength" && (
          <span className="text-danger">
            Name must be at least 5 characters long
          </span>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="email">
          Email <span className="text-danger">*</span>
        </label>
        <input
          type="email"
          className="form-input"
          {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
        />
        {errors.email?.type === "required" && (
          <span className="text-danger">Email is required</span>
        )}
        {errors.email?.type === "pattern" && (
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
          {...register("password", { required: true, minLength: 8 })}
        />
        {errors.password?.type === "required" && (
          <span className="text-danger">Password is required</span>
        )}
        {errors.password?.type === "minLength" && (
          <span className="text-danger">
            Password must be at least 8 characters long
          </span>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="email">
          Confirm Password <span className="text-danger">*</span>
        </label>
        <input
          type="password"
          className="form-input"
          {...register("confirmPassword", {
            required: true,
            minLength: 8,
            validate: (value) =>
              value === getValues("password") || "Passwords do not match",
          })}
        />
        {errors.confirmPassword && (
          <span className="text-danger">{errors.confirmPassword.message}</span>
        )}
        {errors.confirmPassword?.type === "required" && (
          <span className="text-danger">Confirm Password is required</span>
        )}
        {errors.confirmPassword?.type === "minLength" && (
          <span className="text-danger">
            Confirm Password must be at least 8 characters long
          </span>
        )}
      </div>
      {data && (
        <div className="form-group">
          <select
            {...register("ref_email", { required: true })}
            className="form-input"
            name="ref_email"
          >
            <option value="" disabled selected>
              Select your Reference
            </option>
            {options?.map((option, index) => (
              <option key={index} value={option.email}>
                {option.email}
              </option>
            ))}
          </select>
          {errors.ref_email && (
            <span className="text-danger">
              Please Select Your Referal Email
            </span>
          )}
        </div>
      )}
      {data && (
        <>
          <div className="form-group">
            <select
              {...register("role", { required: true })}
              className="form-input"
              name="role"
            >
              <option value="" disabled selected>
                Select your Role
              </option>
              <option value={1}>Admin</option>
              <option value={2}>Agent</option>
              <option value={3}>User</option>
            </select>
            {errors.role && (
              <span className="text-danger">Please Select Your Role </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="orgName">Organisation</label>
            <input
              type="text"
              className="form-input"
              {...register("orgName")}
            />
          </div>
        </>
      )}

      <button type="submit" className="button" disabled={loading}>
        {loading ? <Spinner /> : "Register"}
      </button>
    </form>
  );
};

export default RegisterScreen;
