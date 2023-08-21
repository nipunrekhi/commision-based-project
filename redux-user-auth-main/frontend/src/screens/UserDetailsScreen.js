import { Container } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {  useParams } from 'react-router-dom';
import { userDetails } from '../features/auth/authActions';

const UserDetailsScreen = () => {
  const [state, setState] = useState();
  
  const { data } = useSelector((state) => state.auth);
  const { id } = useParams();
  let dispatch = useDispatch();

  useEffect(() => {
    dispatch(userDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (data) {
      setState(data);
    }
  }, [setState, data]);

  function adminCom(){
    if(state?.adminCom?.length==null){
      return '0';
    }else{
      return state?.adminCom;
    }
  }
  function agentCom() {
    if (state?.agentCom== null) {
      return '0';
    } else {
      return state?.agentCom;
    }
  }

  return (
    <div>
      <Container
        maxWidth="sm"
        sx={{ border: '1px solid', marginBlock: 6, borderRadius: 5 }}
      >
        <h1 className="text-primary p-2 m-2">User Details</h1>
        {data && (
          <div className="center">
            <div>
              <p style={{ textAlign: 'center' }}>
                <strong>Id: {state?.id}</strong>
              </p>

              <p style={{ textAlign: 'center' }}>
                <strong> Name: {state?.firstName} </strong>
              </p>

              <p style={{ textAlign: 'center' }}>
                <strong>Email: {state?.email} </strong>
              </p>
              <p style={{ textAlign: 'center' }}>
                <strong>Reference: {state?.ref_email} </strong>
              </p>
              {(() => {
                switch (state?.role) {
                case '1':
                  return (
                    <>
                      <p style={{ textAlign: 'center' }}>
                        <strong>Organisation Name: {state?.orgName}</strong>
                      </p>
                      <p style={{ textAlign: 'center' }}>
                        <strong>
                            Organisation Commission: {state?.orgCom}
                        </strong>
                      </p>
                        
                      <p style={{ textAlign: 'center' }}>
                        <strong>Admin Commission: {adminCom()}</strong>
                      </p>
                    </>
                  );
                case '2':
                  return (
                    <>
                      <p style={{ textAlign: 'center' }}>
                        <strong>Agent Commission: {agentCom()}</strong>
                      </p>
                    </>
                  );
                case'3':
                  return (
                    <>
                      <p style={{ textAlign: 'center' }}>
                        <strong>User Commission: {state?.userCom}</strong>
                      </p>
                    </>
                  );
                    
                }
              })()}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default UserDetailsScreen;
