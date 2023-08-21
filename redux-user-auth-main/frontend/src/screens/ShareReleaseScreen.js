import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { buyShares, displayShare } from '../features/auth/authActions';
import '../styles/table.css';
import Error from '../components/Error';

const ShareReleaseScreen = () => {
  const dispatch = useDispatch();
  const { data, success, userInfo, error, message } = useSelector(
    (state) => state.auth
  );
  const [sharesName, setSharesName] = useState();
  const [shares, setShares] = useState();
  useEffect(() => {
    if (success) {
      setSharesName(data?.orgNames);
      setShares(data?.data);
    }
  }, [ success, setSharesName, setShares, data]);
  useEffect(() => {
    dispatch(displayShare(data));
  }, [dispatch]);

  const buyingShares = (id) => {
    if (success) {
      dispatch(buyShares(id));
    }
  };
  return (
    <>
      {data?.data == null ? (
        <div className="scroll-bounce">
          <h1 style={{ color: 'red', marginTop: '50%' }}>No Shares Found</h1>
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
              {sharesName?.map((item1, index) => {
                return (
                  <Grid key={index} item xs={12} sm={3} md={3}>
                    <Card
                      variant="outlined"
                      key={index}
                      item1={item1}
                      item2={shares[index]}
                      sx={{
                        minWidth: 275,
                        borderRadius: 2,
                        border: '1px solid',
                      }}
                    >
                      <CardContent>
                        <Typography
                          sx={{ fontSize: 14 }}
                          color="secondary"
                          gutterBottom
                        >
                          Organisation Name:{item1}
                        </Typography>
                        <Typography
                          sx={{ fontSize: 14 }}
                          color="secondary"
                          gutterBottom
                        >
                          Total Shares:{shares[index]?.totalShares}
                        </Typography>

                        <Typography
                          sx={{ fontSize: 14 }}
                          color="secondary"
                          gutterBottom
                        >
                          Share Prize:{shares[index]?.sharePrize}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          onClick={(e) => 
                            buyingShares(shares[index]?._id,e)
                          }
                          variant="contained"
                          size="small"
                        >
                          Buy
                        </Button>
                      </CardActions>
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

export default ShareReleaseScreen;
