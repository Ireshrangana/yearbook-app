import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  yearbooks: [],
  currentYearbook: null,
  currentPage: 1,
  zoom: 1,
  loading: false,
  error: null,
  bookmarks: [],
  comments: [],
};

const yearbookSlice = createSlice({
  name: 'yearbook',
  initialState,
  reducers: {
    setYearbooks: (state, action) => {
      state.yearbooks = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCurrentYearbook: (state, action) => {
      state.currentYearbook = action.payload;
      state.loading = false;
      state.error = null;
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setZoom: (state, action) => {
      state.zoom = action.payload;
    },
    setLoading: (state) => {
      state.loading = true;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setYearbooks,
  setCurrentYearbook,
  setPage,
  setZoom,
  setLoading,
  setError,
} = yearbookSlice.actions;

export default yearbookSlice.reducer;
