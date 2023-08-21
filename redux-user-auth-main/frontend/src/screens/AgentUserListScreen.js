import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import '../styles/table.css';
import {  useParams } from 'react-router-dom';
import { userOfAgent } from '../features/auth/authActions.js';


const AgentUserListScreen = () => {
  const dispatch = useDispatch();
  const { data, } = useSelector((state) => state.auth);
  const [state, setState] = useState();
  const { ref_email } = useParams();
  useEffect(() => {
    dispatch(userOfAgent(ref_email));
  }, [dispatch, ref_email]);

  useEffect(() => {
    if (data) {
      setState(data);
    }
  }, [setState, data]);



  return (
    <div>
      <h2 className="text-primary text-center">Users List</h2>
      <div>
        <table
          className="table table-hover"
          style={{ width: '100%', margin: 'auto' }}
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
                  <tr key={index}>
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
    </div>
  );
};

export default AgentUserListScreen;
