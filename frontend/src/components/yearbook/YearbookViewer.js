import React, { useEffect } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import api from '../../utils/api';
import {
  setCurrentYearbook,
  setError,
  setLoading,
  setPage,
  setZoom,
} from '../../redux/slices/yearbookSlice';

const YearbookViewer = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentYearbook, currentPage, zoom, error } = useSelector(
    (state) => state.yearbook
  );

  useEffect(() => {
    let active = true;

    const fetchYearbook = async () => {
      dispatch(setLoading());

      try {
        const response = await api.get(`/api/yearbooks/${id}`);
        if (active) {
          dispatch(setCurrentYearbook(response.data));
        }
      } catch (err) {
        if (active) {
          dispatch(
            setError(
              err.response?.data?.message ||
                'Could not load the selected yearbook. The backend may not be running yet.'
            )
          );
        }
      }
    };

    fetchYearbook();

    return () => {
      active = false;
    };
  }, [dispatch, id]);

  return (
    <Container sx={{ py: 6 }}>
      <Stack spacing={3}>
        <Typography variant="h4">
          {currentYearbook?.title || 'Yearbook Viewer'}
        </Typography>

        {error ? <Alert severity="warning">{error}</Alert> : null}

        <Paper sx={{ p: 4 }}>
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <Button variant="outlined" onClick={() => dispatch(setPage(Math.max(1, currentPage - 1)))}>
              Previous
            </Button>
            <Button variant="outlined" onClick={() => dispatch(setPage(currentPage + 1))}>
              Next
            </Button>
            <Button variant="outlined" onClick={() => dispatch(setZoom(Math.max(0.5, zoom - 0.1)))}>
              Zoom Out
            </Button>
            <Button variant="outlined" onClick={() => dispatch(setZoom(zoom + 0.1))}>
              Zoom In
            </Button>
          </Stack>

          <Box
            sx={{
              minHeight: 420,
              borderRadius: 2,
              border: '1px dashed',
              borderColor: 'divider',
              display: 'grid',
              placeItems: 'center',
              bgcolor: '#fafafa',
              textAlign: 'center',
              p: 4,
            }}
          >
            <Stack spacing={1}>
              <Typography variant="h6">Page {currentPage}</Typography>
              <Typography color="text.secondary">
                Zoom: {zoom.toFixed(1)}x
              </Typography>
              <Typography color="text.secondary">
                PDF rendering can be wired back in once the full backend and asset flow are restored.
              </Typography>
            </Stack>
          </Box>
        </Paper>
      </Stack>
    </Container>
  );
};

export default YearbookViewer;
