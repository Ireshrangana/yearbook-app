import React, { useEffect } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../utils/api';
import {
  setError,
  setLoading,
  setYearbooks,
} from '../../redux/slices/yearbookSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { yearbooks, loading, error } = useSelector((state) => state.yearbook);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let active = true;

    const fetchYearbooks = async () => {
      dispatch(setLoading());

      try {
        const response = await api.get('/api/yearbooks');
        if (active) {
          dispatch(setYearbooks(response.data || []));
        }
      } catch (err) {
        if (active) {
          dispatch(
            setError(
              err.response?.data?.message ||
                'Could not load yearbooks. The backend may not be running yet.'
            )
          );
        }
      }
    };

    fetchYearbooks();

    return () => {
      active = false;
    };
  }, [dispatch, isAuthenticated]);

  return (
    <Container sx={{ py: 6 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h3" gutterBottom>
            Digital Yearbook Library
          </Typography>
          <Typography color="text.secondary">
            Browse protected yearbooks once you are signed in.
          </Typography>
        </Box>

        {!isAuthenticated ? (
          <Alert severity="info">
            Sign in first to load yearbooks from the API.
          </Alert>
        ) : null}

        {error ? <Alert severity="warning">{error}</Alert> : null}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : null}

        <Grid container spacing={3}>
          {yearbooks.map((yearbook) => (
            <Grid item xs={12} md={6} lg={4} key={yearbook._id || yearbook.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h5">
                    {yearbook.title || 'Untitled Yearbook'}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    {yearbook.description || 'No description available.'}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    component={RouterLink}
                    to={`/yearbook/${yearbook._id || yearbook.id}`}
                    size="small"
                    variant="contained"
                  >
                    Open
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {isAuthenticated && !loading && !yearbooks.length ? (
          <PaperPlaceholder />
        ) : null}
      </Stack>
    </Container>
  );
};

const PaperPlaceholder = () => (
  <Box
    sx={{
      border: '1px dashed',
      borderColor: 'divider',
      borderRadius: 2,
      p: 4,
      textAlign: 'center',
      bgcolor: 'background.paper',
    }}
  >
    <Typography variant="h6" gutterBottom>
      No yearbooks loaded yet
    </Typography>
    <Typography color="text.secondary" sx={{ mb: 2 }}>
      Once the backend API is available and has records, they will appear here.
    </Typography>
    <Button component={RouterLink} to="/login" variant="outlined">
      Check login
    </Button>
  </Box>
);

export default Home;
