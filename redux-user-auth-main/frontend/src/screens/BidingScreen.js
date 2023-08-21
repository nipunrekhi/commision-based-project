import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  displayBid,
  highestBidPrice,
  showBid,
  startBid,
} from "../features/auth/authActions";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  Grid,
  Input,
  InputAdornment,
  InputLabel,
  Typography,
} from "@mui/material";
import io from "socket.io-client";

const BidingScreen = () => {
  const dispatch = useDispatch();
  const { data, success, showBidData, userInfo, highestBid } = useSelector(
    (state) => state.auth
  );
  const [bidName, setBidName] = useState();
  const [bid, setBid] = useState();
  const [inputData, setInputData] = useState([]);
  const [dateTime, setDateTime] = useState();
  const [remainingTime, setRemainingTime] = useState();
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [isCountdownFinished, setIsCountdownFinished] = useState(false);
  const [highBid, setHighbid] = useState([]);
  const [intervalIds, setIntervalIds] = useState({});
  const [disabledBids, setDisabledBids] = useState([]);
  const [socket, setSocket] = useState(null);

  const getHighestBidPrice = (bidId) => {
    const result = highestBid?.highestBidPrices?.find(
      (item) => item._id === bidId
    );
    return result?.highestBidPrice;
  };
  useEffect(() => {
    if (bid) {
      setInputData(Array(bid.length).fill(0));
    }
    if (success) {
      setBidName(data?.orgNames);
      setBid(data?.data);
      setDateTime(date);
      const highBidPrices = bid?.map((item, index) => {
        const highestBidPrice = getHighestBidPrice(item._id);
        return highestBidPrice;
      });
      setHighbid(highBidPrices);
    }
  }, [success, bid, setBid, setBidName, data, showBidData, setHighbid,socket]);

  const dates = showBidData?.data?.map((item) => item);
  const date = dates?.filter((value) => value !== undefined);
  useEffect(() => {
    dispatch(displayBid(data));
  }, [dispatch]);

  useEffect(() => {
    dispatch(showBid(showBidData));
  }, [dispatch]);

  useEffect(() => {
    const socket = io.connect("http://localhost:8080");
    setSocket(socket);

    socket.on("highestBid", (highestBidPrice) => {
      console.log(highestBidPrice, "highestBidPrice");
      setHighbid(highestBidPrice);
    });

    return () => {
      socket.off("highestBid");
    };
  }, []);
  useEffect(() => {
    dispatch(highestBidPrice());
  }, [dispatch]);

  const handleBid = (
    bidId,
    bidPrice,
    shareHolderName,
    sharePercentage,
    sharePrice,
    email
  ) => {
    dispatch(
      startBid({
        bidId,
        bidPrice,
        shareHolderName,
        sharePercentage,
        sharePrice,
        email,
      })
    );
    socket.emit("bid", { bidId, bidPrice });
  
  };

  const handleInputChange = (event, index) => {
    const newData = [...inputData];
    newData[index] = event.target.value;
    setInputData(newData);
  };

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        const now = new Date().getTime();
        const remainingTimes = dateTime?.map((time, index) => {
          const targetDate = new Date(time.dateTime).getTime();
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
            bidId: time.bidId,
            remainingTimer: `${days}d ${hours}h ${minutes}m ${seconds}s`,
          };
        });
        const updatedBid = bid?.map((item) => {
          const remaining = remainingTimes.find(
            (time) => time.bidId === item._id
          )?.remainingTimer;
          return {
            ...item,
            remaining:
              remaining && remaining >= "0d 0h 0m 0s"
                ? remaining
                : "0d 0h 0m 0s",
          };
        });
        setRemainingTime(updatedBid);
        const finishedBidId = remainingTimes?.find(
          (time) => time?.remainingTimer === "0d 0h 0m 0s"
        )?.bidId;

        if (finishedBidId) {
          clearInterval(intervalIds[finishedBidId]);
        }
        const disabledBidIds = remainingTimes
          .filter((time) => time.remainingTimer <= "0d 0h 0m 0s")
          .map((time) => time.bidId);
        setDisabledBids(disabledBidIds);
      }, 1000);

      setIntervalIds((prevState) => ({
        ...prevState,
        [bid?.map((item) => item._id)]: interval,
      }));
    }
    return () => clearInterval(interval);
  }, [dateTime, isTimerRunning]);
  console.log();

  useEffect(() => {
    setIsCountdownFinished(false);
  }, [dateTime]);
  return (
    <>
      {data?.data == null ? (
        <div className="scroll-bounce">
          <h1 style={{ color: "red", marginTop: "50%" }}>No Shares Found</h1>
        </div>
      ) : (
        <>
          {data && (
            <Grid
              container
              spacing={24}
              direction="row"
              justify="flex-start"
              alignItems="flex-start"
            >
              {bidName?.map((item1, index) => {
                return (
                  <Grid key={index} item xs={12} sm={3} md={3}>
                    <Card
                      variant="outlined"
                      key={index}
                      item1={item1}
                      item2={bid[index]}
                      sx={{
                        minWidth: 275,
                        borderRadius: 2,
                        border: "1px solid",
                      }}
                    >
                      <CardContent>
                        <Typography sx={{ fontSize: 14 }} gutterBottom>
                          ShareHolder Name:{bid[index]?.shareHolderName}
                        </Typography>

                        <Typography sx={{ fontSize: 14 }} gutterBottom>
                          Shares:{bid[index]?.sharePercentage}
                        </Typography>

                        <Typography sx={{ fontSize: 14 }} gutterBottom>
                          Share Prize:{Math.trunc(bid[index]?.sharePrice)}
                        </Typography>
                        {highBid && (
                          <>
                            {highBid[index] && (
                              <Typography
                                sx={{
                                  fontSize: 14,
                                  fontFamily: "monospace",
                                  color: "red",
                                }}
                                gutterBottom
                              >
                                Highest Bid: {highBid}
                              </Typography>
                            )}
                          </>
                        )}
                      </CardContent>
                      <CardActions>
                        <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                          <InputLabel htmlFor="standard-adornment-amount">
                            Amount
                          </InputLabel>
                          <Input
                            id="standard-adornment-amount"
                            name="bidPrice"
                            type="number"
                            value={inputData[index] || ""}
                            onChange={(event) =>
                              handleInputChange(event, index)
                            }
                            startAdornment={
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            }
                          />
                        </FormControl>
                        <Button
                          onClick={() => {
                            handleBid(
                              bid[index]?._id,
                              inputData[index],
                              bid[index]?.shareHolderName,
                              bid[index]?.sharePercentage,
                              bid[index]?.sharePrice,
                              userInfo?.email
                            );
                          }}
                          disabled={disabledBids.includes(bid[index]._id)} // Add this line
                          sx={{ marginTop: "15px" }}
                          variant="contained"
                          size="small"
                        >
                          Bid
                        </Button>
                      </CardActions>

                      {remainingTime && (
                        <>
                          {remainingTime[index] && (
                            <Typography
                              sx={{
                                fontSize: 14,
                                marginLeft: "28px",
                                color: "green",
                              }}
                              gutterBottom
                            >
                              Remaining Time: {remainingTime[index]?.remaining}
                            </Typography>
                          )}
                        </>
                      )}
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </>
      )}
    </>
  );
};

export default BidingScreen;
