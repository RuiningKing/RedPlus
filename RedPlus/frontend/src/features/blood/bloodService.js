import axios from "axios";

const getBloodRequests = async (location, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: location
  };

  const response = await axios.get("/api/blood", config);
  console.log("getBloodRequests", response);
  return response.data;
};

const postBloodRequest = async (load, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const response = await axios.post("/api/blood", load, config);
  return response.data;
};

const postDonation = async (requestId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const response = await axios.post(
    "/api/blood/donation",
    { requestId },
    config
  );

  return response.data;
};

const acceptDonationRequest = async (donationId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const response = await axios.post(
    "/api/blood/donation/accept",
    { donationId },
    config
  );
  return response.data;
};

const donationTransferToFacility = async (options, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const response = await axios.post(
    "/api/blood/donation/transfer",
    options,
    config
  );
  console.log(response);
  return response.data;
};

const getDonations = async (location, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: location
  };

  const response = await axios.get("/api/blood/donation", config);
  return response.data;
};

const bloodService = {
  getBloodRequests,
  postBloodRequest,
  postDonation,
  acceptDonationRequest,
  getDonations,
  donationTransferToFacility
};

export default bloodService;
