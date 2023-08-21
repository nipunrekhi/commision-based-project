import ModeEditOutline from '@mui/icons-material/ModeEditOutline';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  Grid,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { Container } from '@mui/system';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetDetailsQuery } from '../app/services/auth/authService';
import { setCredentials, setUserList } from '../features/auth/authSlice';
import '../styles/profile.css';
import {
  bid,
  deletExpiredBid,
  highestBidWinner,
  purchaseBid,
  renew,
  reopenAccount,
  reqAgentCom,
  reqCom,
  requestApprove,
  sendCom,
  sendUserCom,
  shareInsert,
} from '../features/auth/authActions';
import Error from '../components/Error';
import Spinner from '../components/Spinner';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfileScreen = () => {
  const {
    userInfo,
    success,
    error,
    loading,
    data,
    sendCommission,
    highestBidWin,
  } = useSelector((state) => state.auth);
  const { id } = useParams();
  const { isFetching } = useGetDetailsQuery('userDetails');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [customError, setCustomError] = useState(null);
  const [reqApprove, setReqApprove] = useState();
  const [selectedOption, setSelectedOption] = useState(10);
  const [highestBid, setHighestbid] = useState();
  const [highestBidName, setHighestbidName] = useState();
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [remainingTime, setRemainingTime] = useState();

  //RemainingTime Filter
  const filterRemainingTime = remainingTime?.filter(
    (item) => item?.email === userInfo?.email
  );
  useEffect(() => {
   
    filterRemainingTime?.map((item, index) => {
      if (item?.remainingTimer <= '0d 0h 0m 0s') {
        window.alert('Purchase Time ended');
        dispatch(deletExpiredBid());
        window.location.reload();
      }
    });
  }, [dispatch,remainingTime]);
  useEffect(() => {
    if (userInfo) {
      dispatch(setCredentials(userInfo));
      dispatch(highestBidWinner());
      setReqApprove(sendCommission?.sendCommission);
    }
  }, [userInfo, dispatch, sendCommission,remainingTime]);

  //HighestBidName FIlter
  const highestBidNameMap = highestBidName?.map((item) => item);
  const filteHighestBidUser = highestBidNameMap?.filter(
    (item) => item.email === userInfo.email
  );

  //HighestBid Filter

  const highestBidMap = highestBid?.map((item) => item);
  const filterHighestBid = highestBidMap?.filter(
    (item) => item.userEmail === userInfo.email
  );

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        const now = new Date().getTime();
        const remainingTimes = highestBidWin?.highestBidPrices?.map(
          (time, index) => {
            const targetDate = new Date(time.dateTime).getTime() + 60000;
            const distance = targetDate - now;
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
              (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor(
              (distance % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            return {
              id: time._id,
              email: time.userEmail,
              remainingTimer: `${days}d ${hours}h ${minutes}m ${seconds}s`,
            };
          }
        );

        setRemainingTime(remainingTimes);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [highestBidWin, isTimerRunning, remainingTime]);

  useEffect(() => {
    if (userInfo.role == 1) {
      dispatch(requestApprove(sendCommission));
    } else if (userInfo.role == 2 || userInfo.role == 3) {
      dispatch(renew(id));
    }
  }, [dispatch]);

  useEffect(() => {
    setHighestbid(highestBidWin?.highestBidPrices);
    setHighestbidName(highestBidWin?.users);
  }, [highestBidWin]);

  function getName() {
    if (userInfo.role == 0) {
      return 'Super Admin';
    } else if (userInfo.role == 1) {
      return 'Admin';
    } else if (userInfo.role == 2) {
      return 'Agent';
    } else if (userInfo.role == 3) {
      return 'User';
    } else {
      return 'Unknown';
    }
  }

  function getAdminCom() {
    if (userInfo.adminCom == undefined) {
      return '0';
    } else {
      return userInfo.adminCom;
    }
  }

  function getAgentCom() {
    if (userInfo.agentCom == undefined) {
      return '0';
    } else {
      return userInfo.agentCom;
    }
  }
  function getSupAdminCom() {
    if (userInfo.superAdminCom == undefined) {
      return '0';
    } else {
      return userInfo.superAdminCom;
    }
  }

  function getUserCom() {
    if (userInfo.userCom == undefined) {
      return '0';
    } else {
      return userInfo.userCom;
    }
  }

  const requestClick = (id) => {
    if (error) {
      setTimeout(() => {
        setCustomError(error);
      }, 1000);
    }
    if (success) {
      dispatch(reqCom(id));
    } else {
      alert('Request Not Send');
    }
  };
  const notify = () => {
    toast.success('🦄 Request Send Successfully!', {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
  };

  const requestAgentCommission = (id) => {
    if (error) {
      setCustomError(error);
    } else {
      dispatch(reqAgentCom(id));
    }
  };

  const sendAgentCom = () => {
    dispatch(sendCom(data));
    window.location.reload();
  };
  const senduserCom = () => {
    dispatch(sendUserCom(data));
    window.location.reload();
  };

  const reopen = () => {
    dispatch(reopenAccount(data));
    window.location.reload();
  };

  const reopenAgent = () => {
    dispatch(reopenAccount(data));
    window.location.reload();
  };
  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = () => {
    dispatch(shareInsert(selectedOption));
  };

  const handleBid = () => {
    dispatch(bid(data));
  };

  const handlePurchase = (bidId) => {
    console.log(bidId, 'bidId');

    dispatch(purchaseBid(bidId));
  };
  return (
    userInfo && (
      <>
        {userInfo.role == 1 && (
          <Grid sx={{ marginRight: '90px' }}>
            <Card variant="outlined" sx={{ minWidth: 275 }}>
              <CardContent>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Share Percentage
                  </InputLabel>
                  <Select
                    value={selectedOption}
                    onChange={handleSelectChange}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Share Percentage"
                    name="totalShares"
                  >
                    <MenuItem value={10}>10%</MenuItem>
                    <MenuItem value={20}>20%</MenuItem>
                    <MenuItem value={30}>30%</MenuItem>
                    <MenuItem value={40}>40%</MenuItem>
                  </Select>
                </FormControl>
              </CardContent>
              <CardActions>
                <Button onClick={handleSubmit} variant="contained" size="small">
                  SellOut
                </Button>
              </CardActions>
            </Card>
          </Grid>
        )}
        <></>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Container
          maxWidth="sm"
          sx={{ border: '1px solid', marginBlock: 0, borderRadius: 5 }}
        >
          <Grid2>
            {error && (
              <Error>
                {' '}
                <Alert
                  sx={{
                    margin: '30px',
                    padding: '-20px',
                    textAlignLast: 'center',
                  }}
                  severity="error"
                >
                  {error}
                </Alert>
              </Error>
            )}
            <div>
              <div>
                <Button
                  onClick={(e) =>
                    e.preventDefault(navigate(`/editUser/${userInfo?.id}`))
                  }
                >
                  Edit Profile
                  <ModeEditOutline></ModeEditOutline>
                </Button>
              </div>

              <figure style={{ padding: '20px' }}>
                {userInfo?.firstName.charAt(0).toUpperCase()}
              </figure>

              <span>
                Welcome <strong>{userInfo?.firstName}!</strong> You can view
                this page because you're logged in
              </span>
              <br />
              <br />
              <Typography className="text-center" style={{ color: 'black' }}>
                {isFetching
                  ? 'Fetching your role...'
                  : userInfo !== null
                    ? `Role: ${getName()}`
                    : 'You\'re not logged in'}
              </Typography>
              {userInfo.role != 0 && (
                <h3 className="text-center" style={{ color: 'black' }}>
                  {isFetching
                    ? 'Fetching your Reference...'
                    : userInfo !== null
                      ? `Reference: ${userInfo?.ref_email}`
                      : 'You\'re not logged in'}
                </h3>
              )}
              {userInfo.role == 1 && (
                <h4 className="text-center " style={{ color: 'black' }}>
                  {isFetching
                    ? 'Fetching your Organisation Commission...'
                    : userInfo !== null
                      ? `Organisation Name: ${userInfo?.orgName}`
                      : 'You\'re not logged in'}
                </h4>
              )}
              {userInfo.role == 1 && (
                <h4 className="text-center " style={{ color: 'black' }}>
                  {isFetching
                    ? 'Fetching your Organisation Commission...'
                    : userInfo !== null
                      ? `Organisation Commission: ${userInfo?.orgCom}`
                      : 'You\'re not logged in'}
                </h4>
              )}

              {userInfo.role == 0 && (
                <h4 className="text-center " style={{ color: 'black' }}>
                  {isFetching
                    ? 'Fetching your Commission...'
                    : userInfo !== null
                      ? `My Commission: ${getSupAdminCom()}`
                      : 'You\'re not logged in'}
                </h4>
              )}
              {userInfo.role == 1 && (
                <h4 className="text-center " style={{ color: 'black' }}>
                  {isFetching
                    ? 'Fetching your Commission...'
                    : userInfo !== null
                      ? `My Commission: ${getAdminCom()}`
                      : 'You\'re not logged in'}
                </h4>
              )}
              {userInfo.role == 2 && (
                <h4 className="text-center " style={{ color: 'black' }}>
                  {isFetching
                    ? 'Fetching your Commission...'
                    : userInfo !== null
                      ? `My Commission: ${getAgentCom()}`
                      : 'You\'re not logged in'}
                </h4>
              )}
              {userInfo.role == 3 && (
                <h4 className="text-center " style={{ color: 'black' }}>
                  {isFetching
                    ? 'Fetching your Commission...'
                    : userInfo !== null
                      ? `My Commission: ${getUserCom()}`
                      : 'You\'re not logged in'}
                </h4>
              )}

              <h4 className="text-center " style={{ color: 'black' }}>
                {isFetching
                  ? 'Fetching your Commission...'
                  : userInfo !== null
                    ? `My Shares: ${userInfo?.share}`
                    : 'You\'re not logged in'}
              </h4>

              {userInfo.role == 1 && (
                <div className="">
                  <p className="text text-danger text-right">
                    User Request Count : {data?.userCount}
                  </p>
                  <p className="text text-danger text-right">
                    Agent Request Count : {data?.agentCount}
                  </p>
                </div>
              )}
              <Button onClick={handleBid} variant="contained" color="success">
                Bid
              </Button>
              {/* User Button */}

              {data?.userpending == true ? (
                <>
                  <Button
                    sx={{
                      marginLeft: '160px',
                      marginTop: '0px',
                      marginBlock: '40px',
                    }}
                    disabled
                    variant="contained"
                    size="small"
                    color="success"
                  >
                    Request Under Process
                  </Button>
                </>
              ) : (
                <>
                  {data?.renewUser == true ? (
                    <>
                      <Box
                        sx={{
                          marginLeft: '230px',
                          marginTop: '0px',
                          marginBlock: '40px',
                        }}
                      >
                        {userInfo.role == 3 && (
                          <Button
                            onClick={reopen}
                            variant="contained"
                            size="small"
                            color="success"
                          >
                            Renew
                          </Button>
                        )}
                      </Box>
                    </>
                  ) : (
                    <>
                      {' '}
                      {userInfo.role == 3 && (
                        <Box sx={{ marginBlock: '40px' }} textAlign="center">
                          {error ? (
                            <>
                              <div />
                            </>
                          ) : (
                            <>
                              <Button
                                onClick={() => {
                                  requestClick(userInfo.id);
                                  notify();
                                }}
                                variant="contained"
                                size="small"
                                color="success"
                              >
                                Request User Commission
                              </Button>
                            </>
                          )}
                        </Box>
                      )}
                    </>
                  )}
                </>
              )}

              {/* AgentButton */}

              {data?.agentpending == true ? (
                <>
                  <Button
                    sx={{
                      marginLeft: '160px',
                      marginTop: '0px',
                      marginBlock: '40px',
                    }}
                    disabled
                    variant="contained"
                    size="small"
                    color="success"
                  >
                    Request Under Process
                  </Button>
                </>
              ) : (
                <>
                  {data?.renew == true ? (
                    <>
                      <Box
                        sx={{
                          marginLeft: '230px',
                          marginTop: '0px',
                          marginBlock: '40px',
                        }}
                      >
                        {userInfo.role == 2 && (
                          <Button
                            onClick={reopenAgent}
                            variant="contained"
                            size="small"
                            color="success"
                          >
                            Renew
                          </Button>
                        )}
                      </Box>
                    </>
                  ) : (
                    <>
                      {' '}
                      {userInfo.role == 2 && (
                        <Box sx={{ marginBlock: '40px' }} textAlign="center">
                          {error ? (
                            <>
                              <div />
                            </>
                          ) : (
                            <>
                              <Button
                                onClick={() => {
                                  requestAgentCommission(userInfo?.id);
                                  notify();
                                }}
                                variant="contained"
                                size="small"
                                color="success"
                              >
                                Request Agent Commission
                              </Button>
                            </>
                          )}
                        </Box>
                      )}
                    </>
                  )}
                </>
              )}

              {/* Admin Buttons */}

              {data?.CommissionSent == true ? (
                <></>
              ) : (
                <>
                  {sendCommission && (
                    <>
                      {userInfo.role == 1 && (
                        <Box
                          sx={{ marginLeft: '200px', marginTop: '0px' }}
                          textAlign="center"
                        >
                          {data?.agentCount === 3 ? (
                            <>
                              <Button
                                onClick={sendAgentCom}
                                variant="contained"
                                size="small"
                                color="success"
                                sx={{ marginRight: '200px' }}
                              >
                                Send Agent
                              </Button>
                            </>
                          ) : (
                            <div />
                          )}
                        </Box>
                      )}
                    </>
                  )}
                </>
              )}
              {data?.UserCommissionSent == true ? (
                <></>
              ) : (
                <>
                  {sendCommission && (
                    <>
                      {userInfo.role == 1 && (
                        <Box
                          sx={{ marginLeft: '200px', marginTop: '0px' }}
                          textAlign="center"
                        >
                          {data?.userCount === 3 ? (
                            <>
                              <Button
                                onClick={senduserCom}
                                variant="contained"
                                size="small"
                                color="success"
                                sx={{ marginTop: '10px', marginRight: '200px' }}
                              >
                                Send User
                              </Button>
                            </>
                          ) : (
                            <div />
                          )}
                        </Box>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </Grid2>
        </Container>
        <>
          {' '}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Grid container>
              {filterHighestBid?.map((item1, index) => {
                return (
                  <Grid key={index}>
                    <Card
                      variant="outlined"
                      key={index}
                      item1={item1}
                      item2={filteHighestBidUser[index]}
                      sx={{
                        minWidth: 275,
                        borderRadius: 2,
                        border: '1px solid',
                        margin: '10px',
                      }}
                    >
                      <CardContent>
                        <Typography
                          sx={{ fontSize: 14 }}
                          color="secondary"
                          gutterBottom
                        >
                          ShareHolderName Bid:{item1?.shareHolderName}
                        </Typography>
                        <Typography
                          sx={{ fontSize: 14 }}
                          color="secondary"
                          gutterBottom
                        >
                          {' '}
                          BidId:{item1?._id}
                        </Typography>
                        <Typography
                          sx={{ fontSize: 14 }}
                          color="secondary"
                          gutterBottom
                        >
                          Your Bid:{item1?.highestBidPrice}
                        </Typography>{' '}
                        <Typography
                          sx={{ fontSize: 14 }}
                          color="secondary"
                          gutterBottom
                        >
                          Share Price:{Math.trunc(item1?.sharePrice)}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        {remainingTime && (
                          <>
                            {remainingTime[index] && (
                              <Button
                                disabled={
                                  filterRemainingTime[index].remainingTimer <=
                                  '0d 0h 0m 0s'
                                }
                                variant="contained"
                                size="small"
                                onClick={() => handlePurchase(item1?._id)}
                              >
                                Purchase
                              </Button>
                            )}
                          </>
                        )}
                      </CardActions>

                      {remainingTime && (
                        <>
                          {remainingTime[index] && (
                            <Typography
                              sx={{
                                fontSize: 14,
                                marginLeft: '28px',
                                color: 'green',
                              }}
                              gutterBottom
                            >
                              Remaining Time:{' '}
                              {filterRemainingTime[index].remainingTimer <=
                              '0d 0h 0m 0s'
                                ? 'Closed'
                                : filterRemainingTime[index].remainingTimer}
                            </Typography>
                          )}
                        </>
                      )}
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </div>
        </>
      </>
    )
  );
};

export default ProfileScreen;
