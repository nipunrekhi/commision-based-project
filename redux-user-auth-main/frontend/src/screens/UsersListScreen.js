import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useGetUsersQuery } from '../app/services/userServices';
import { setUserList } from '../features/auth/authSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import '../styles/table.css';

const UsersListScreen = () => {
  const { data, isSuccess } = useGetUsersQuery('userList');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // redirect authenticated user to profile screen
  useEffect(() => {
    if (data) {
      dispatch(setUserList(data));
    }
  }, [dispatch, data]);

  const [state, setState] = useState({
    firstName: '',
    email: '',
    role: '',
  });

  const { firstName, email, role } = state;
  const handleChange = (e) => {
    e.preventDefault();
    let { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  return (
    <div>
      <h2 className="text-primary text-center">All Users List</h2>
      <div>
        <table
          className="table table-hover"
          style={{ width: '100%', margin: 'auto' ,marginBottom:'30px' }}
        >
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Views</th>
            </tr>
          </thead>
          {isSuccess && (
            <tbody>
              {data.user.map((item, index) => (
                <tr key={index + 1}>
                  <td>{index + 1}</td>
                  <td>{item?._id}</td>
                  <td>{item?.firstName}</td>
                  <td>{item?.email}</td>

                  {(() => {
                    switch (item?.role) {
                    case '1':
                      return (
                        <>
                          <td>{'Admin'}</td>
                        </>
                      );
                    case '2':
                      return (
                        <>
                          <td>{'Agent'}</td>
                        </>
                      );
                    case '3':
                      return (
                        <>
                          <td>{'User'}</td>
                        </>
                      );
                    }
                  })()}
                  <td>
                    <Tooltip title="Details" followCursor>
                      <Button
                        onClick={(e) =>
                          e.preventDefault(navigate(`/details/${item._id}`))
                        }
                      >
                        <VisibilityIcon></VisibilityIcon>
                      </Button>
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      <div className="modal fade" id="editModal" role="dialog" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title">Edit Employee</div>
              <button className="close" data-dismiss="modal">
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group row">
                <label htmlFor="txtName" className="col-sm-4">
                  Name
                </label>
                <div className="col-8">
                  <input
                    onChange={handleChange}
                    name="firstName"
                    value={firstName}
                    id="txtName"
                    type="text"
                    placeholder="Enter Name"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group row">
                <label htmlFor="txtAddress" className="col-sm-4">
                  Email
                </label>
                <div className="col-8">
                  <input
                    id="txtAddress"
                    type="text"
                    name="email"
                    placeholder="Enter Email"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group row">
                <label htmlFor="txtSalary" className="col-sm-4">
                  Salary
                </label>
                <div className="col-8">
                  <input
                    id="txtSalary"
                    type="text"
                    name="Salary"
                    placeholder="Enter Salary"
                    className="form-control"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-success" data-dismiss="modal">
                Update
              </button>
              <button className="btn btn-primary" data-dismiss="modal">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersListScreen;
