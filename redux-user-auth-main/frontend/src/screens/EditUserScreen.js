import {
  Alert,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { editUser, updateUsers } from "../features/auth/authActions";
import Spinner from "../components/Spinner";

const EditUserScreen = () => {
  const [state, setState] = useState();
  const { data, loading,  } = useSelector((state) => state.auth);
  const { id } = useParams();
  let dispatch = useDispatch();
  const navigate = useNavigate();
  console.log();
  useEffect(() => {
    dispatch(editUser(id));
  }, [dispatch, id]);
  useEffect(() => {
    if (data?.data?._id === id) {
      setState(data);
    }
  }, [setState, data]);

  const handleSubmit = () => {
    if (state.firstName == undefined) {
      alert("Please update firstName");
      return false;
    }
    let data = { firstName: state.firstName };
    if (data) {
      dispatch(updateUsers({ id, data }));
      navigate("/user-profile");
      window.location.reload();
    }
  };

  const changeHandler = (e) => {
    e.preventDefault();
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  return (
    state && (
      <div>
        <Container
          maxWidth="sm"
          sx={{ border: "2px solid", marginBlock: 2, borderRadius: 5 }}
        >
          <Grid>
            <Button
              onClick={() => navigate("/user-profile")}
              variant="contained"
              sx={{ marginLeft: "230px", marginTop: "20px" }}
              color="secondary"
            >
              Back
            </Button>

            <Typography sx={{ textAlign: "center", marginTop: "10px" }}>
              Edit Users
            </Typography>
            {loading ? (
              <Spinner />
            ) : (
              <>
                <TextField
                  disabled
                  onChange={changeHandler}
                  sx={{ width: "45ch", margin: 2 }}
                  variant="standard"
                  defaultValue={state?.data?._id}
                  name="id"
                  id="id"
                />
                <TextField
                  onChange={changeHandler}
                  defaultValue={state?.data?.firstName || ""}
                  sx={{ width: "45ch", margin: 2 }}
                  id="firsme"
                  variant="standard"
                  name="firstName"
                  type="text"
                />
                <TextField
                  onChange={changeHandler}
                  defaultValue={state?.data?.email || ""}
                  sx={{ width: "45ch", margin: 2 }}
                  id="Email"
                  variant="standard"
                  type="email"
                  name="email"
                />
                <TextField
                  disabled
                  onChange={changeHandler}
                  sx={{ margin: 2, width: "45ch" }}
                  id="Role"
                  variant="standard"
                  placeholder="Role"
                  name="role"
                  defaultValue={state?.data?.role || ""}
                />
              </>
            )}

            <Button
              variant="contained"
              sx={{
                marginLeft: "230px",
                marginBottom: "20px",
                marginTop: "10px",
              }}
              color="primary"
              onClick={handleSubmit}
            >
              Update
            </Button>
          </Grid>
        </Container>
      </div>
    )
  );
};

export default EditUserScreen;
