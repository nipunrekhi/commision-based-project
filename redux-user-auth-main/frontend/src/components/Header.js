import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { useGetDetailsQuery } from '../app/services/auth/authService';
import { logout, setCredentials } from '../features/auth/authSlice';
import '../styles/header.css';
import { Button } from '@mui/material';

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [state, setState] = useState();

  // automatically authenticate user if token is found
  const { data, isFetching, isSuccess } = useGetDetailsQuery('userDetails', {
    pollingInterval: 900000, // 15mins
  });
  const navigate = useNavigate();

  useEffect(() => {
    {
      data && dispatch(setCredentials(data));
    }
  }, [dispatch, data]);

  const logOut = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header>
      <div className="header-status">
        <span>
          {isFetching
            ? 'Fetching your profile...'
            : userInfo !== null
              ? `Logged in as ${userInfo.email}`
              : 'You\'re not logged in'}
        </span>

        <div className="cta">
          <>
            <Button
              style={{ marginRight: '20px' }}
              variant="contained"
              href="/displayShares"
            >
              Shares
            </Button>

            <Button
              style={{ marginRight: '20px' }}
              variant="contained"
              href="/biding"
            >
              Biding
            </Button>
          </>

          {userInfo ? (
            <>
              <button className=" btn btn-danger" onClick={() => logOut()}>
                Logout
              </button>
            </>
          ) : (
            <NavLink className="btn btn-success" to="/login">
              Login
            </NavLink>
          )}
        </div>
      </div>
      <nav className="container navigation">
        {(() => {
          switch (userInfo?.role) {
          case '0':
            return (
              <>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/user-profile">Profile</NavLink>
                <NavLink to="/usersList">All Users List</NavLink>
              </>
            );
          case '1':
            return (
              <>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/user-profile">Profile</NavLink>
                <NavLink to={`/agentList/${userInfo?.email}`}>
                    Agentist
                </NavLink>
              </>
            );
          case '2':
            return (
              <>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/user-profile">Profile</NavLink>
                <NavLink to={`/userOfAgent/${userInfo?.email}`}>
                    UserList
                </NavLink>
              </>
            );
          case '3':
            return (
              <>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/user-profile">Profile</NavLink>
              </>
            );
          default:
            return (
              <>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/user-profile">Profile</NavLink>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/register">Register</NavLink>
              </>
            );
          }
        })()}
      </nav>
    </header>
  );
};

export default Header;
