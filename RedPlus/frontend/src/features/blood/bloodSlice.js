import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import bloodService from "./bloodService";

const initialState = {
  bloodRequests: [],
  donations: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ""
};

export const getBloodRequests = createAsyncThunk(
  "blood/getBlood",
  async (location, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await bloodService.getBloodRequests(location, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const postBloodRequest = createAsyncThunk(
  "blood/postBloodRequest",
  async (load, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await bloodService.postBloodRequest(load, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getDonations = createAsyncThunk(
  "blood/getDonations",
  async (location, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await bloodService.getDonations(location, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const postDonation = createAsyncThunk(
  "blood/postDonation",
  async (requestId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await bloodService.postDonation(requestId, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const acceptDonationRequest = createAsyncThunk(
  "blood/acceptDonationRequest",
  async (donationId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await bloodService.acceptDonationRequest(donationId, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const donationTransferToFacility = createAsyncThunk(
  "blood/donationTransferToFacility",
  async (options, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await bloodService.donationTransferToFacility(options, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const bloodSlice = createSlice({
  name: "blood",
  initialState,
  reducers: {
    reset: (state) => ({
      ...state,
      isError: false,
      isSuccess: false,
      isLoading: false,
      message: ""
    })
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBloodRequests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBloodRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bloodRequests = action.payload;
      })
      .addCase(getBloodRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(postBloodRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(postBloodRequest.fulfilled, (state, _) => {
        state.isSuccess = true;
      })
      .addCase(postBloodRequest.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(postDonation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(postDonation.fulfilled, (state, _) => {
        state.isSuccess = true;
      })
      .addCase(postDonation.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getDonations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDonations.fulfilled, (state, action) => {
        state.donations = action.payload;
      })
      .addCase(getDonations.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(acceptDonationRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(acceptDonationRequest.fulfilled, (state, _) => {
        state.isSuccess = true;
      })
      .addCase(acceptDonationRequest.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(donationTransferToFacility.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(donationTransferToFacility.fulfilled, (state, _) => {
        state.isSuccess = true;
      })
      .addCase(donationTransferToFacility.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { reset } = bloodSlice.actions;

export default bloodSlice.reducer;
