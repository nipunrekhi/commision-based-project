import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import "../styles/table.css";
import {  useParams } from "react-router-dom";
import { userByRef } from "../features/auth/authActions.js";

const AgentListScreen = () => {
  const dispatch = useDispatch();
  const {  data,  } = useSelector((state) => state.auth);
  const [state, setState] = useState();
  const { ref_email } = useParams();

  useEffect(() => {
    dispatch(userByRef(ref_email));
  }, [dispatch, ref_email]);

  useEffect(() => {
    if (data) {
      setState(data);
    }
  }, [setState, data]);

  const handleChange = (e) => {
    e.preventDefault();

    let { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  return (
    <div>
      <h2 className="text-primary text-center">Agents List</h2>
      <div>
        <table
          className="table  table-hover"
          style={{ width: "100%", margin: "auto" }}
        >
          <thead>
            <tr>
              <th className="m-2">Sr No.</th>
              <th>Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>

          {data && (
            <tbody>
              {state?.data?.map((item, index) => {
                return (
                  <tr className="table table-hover" key={index}>
                    <td>{index + 1}</td>
                    <td>{item?._id}</td>
                    <td>{item?.firstName}</td>
                    <td>{item?.email}</td>
                    {(() => {
                      switch (item?.role) {
                        case "1":
                          return (
                            <>
                              <td>{"Admin"}</td>
                            </>
                          );
                        case "2":
                          return (
                            <>
                              <td>{"Agent"}</td>
                            </>
                          );
                        case "3":
                          return (
                            <>
                              <td>{"User"}</td>
                            </>
                          );
                          default:<></>
                      }
                    })()}
                  </tr>
                );
              })}
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

export default AgentListScreen;
