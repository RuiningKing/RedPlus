import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  acceptDonationRequest,
  donationTransferToFacility,
  getDonations,
  reset
} from "../features/blood/bloodSlice";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row
} from "react-bootstrap";

import moment from "moment";
import { FaBuilding, FaHandHoldingHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import Select from "react-select";
import axios from "axios";

function Pending() {
  const [facilities, setFacilities] = useState([{ value: "", label: "" }]);
  const [facility, setFacility] = useState("");
  const [donationId, setDonationId] = useState("");
  const [loadingFac, setLoadingFac] = useState(false);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { donations, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.blood
  );

  useEffect(() => {
    if (isSuccess) {
      toast.success("Success");
      dispatch(reset());
      navigate(0);
    }
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }
  }, [isSuccess, isError, message, dispatch, navigate]);

  useEffect(() => {
    if (!user) navigate("/login");
    else {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const { latitude: lat, longitude: lng } = position.coords;
          dispatch(getDonations({ lat, lng }));
          dispatch(reset());

          // Get nearby facilities
          const config = {
            params: {
              lat,
              lng
            }
          };
          axios
            .get("/api/blood/facility", config)
            .then((response) => {
              console.log(response.data);
              setFacilities(
                response.data.map((fac) => ({
                  value: fac._id,
                  label: fac.name
                }))
              );
            })
            .catch((err) => {
              toast.error(err);
            });
        },
        function (err) {
          console.log("Donate get location error", err);
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectChange = (newSelection) => {
    setFacility(newSelection.value);
  };

  const onInputChange = (newInput) => {
    setLoadingFac(true);
    const config = {
      params: {
        keyword: newInput
      }
    };
    axios
      .get("/api/blood/facility", config)
      .then((response) => {
        console.log(response.data);
        setFacilities(
          response.data.map((fac) => ({
            value: fac._id,
            label: fac.name
          }))
        );
        setLoadingFac(false);
      })
      .catch((err) => {
        toast.error(err);
        setLoadingFac(false);
      });
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    if (!facility) toast.error("Facility not selected");
    else {
      axios
        .post("/api/blood/facility", { facilityId: facility })
        .then((response) => {
          console.log(response.data);
          toast.success("Donation success we will be in contact with you");
          setFacility("");
        })
        .catch((err) => console.log(err));
    }
  };

  const onAccept = (donationId) => {
    dispatch(acceptDonationRequest(donationId));
  };

  const handleTransferSubmit = () => {
    dispatch(donationTransferToFacility({ donationId, facility }));
  };

  const posted = (date) => {
    const startDate = moment(date);
    const endDate = moment(Date.now());
    const diff = endDate.diff(startDate);
    const diffDuration = moment.duration(diff);
    if (diffDuration.days() > 0)
      return `Posted ${diffDuration.days()} days ago`;
    if (diffDuration.hours() > 0)
      return `Posted ${diffDuration.hours()} hours ago`;
    else return `Posted ${diffDuration.minutes()} minutes ago`;
  };

  if (!user || !donations || isLoading) return <Spinner />;
  return (
    <Container>
      <h1 className="mt-5">Approve donations</h1>
      <p className="mb-5">
        <FaHandHoldingHeart /> A single blood drop can give a new life{" "}
        <FaHandHoldingHeart />
      </p>
      {/* <Row>
        <Col md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
          <Form onSubmit={onFormSubmit}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="diseases">
                <FaBuilding /> Facility
              </Form.Label>
              <Select
                id="diseases"
                name="diseases"
                closeMenuOnSelect={false}
                isMulti
                options={facilities}
                onChange={onSelectChange}
                onInputChange={onInputChange}
                placeholder="Select facility"
                noOptionsMessage={() =>
                  loadingFac ? "Loading..." : "No option"
                }
              />
              <Button
                className="mt-1"
                type="submit"
                variant="dark"
                style={{ display: "block", margin: "auto" }}
              >
                Submit
              </Button>
            </Form.Group>
          </Form>
        </Col>
      </Row> */}
      <Row>
        {donations &&
          donations.length > 0 &&
          donations.map((req) => {
            return (
              <Col xs={12} sm={6} md={4} lg={3} className="mb-3">
                <Card style={{ width: "100%" }} bg={"success"} text={"light"}>
                  <Card.Header className="mb-2">
                    Donor:{" "}
                    <span style={{ color: "#ccc" }}>{req.donor.phone}</span> (
                    {req.donor.bloodType})
                  </Card.Header>
                  <Card.Body>
                    {req.faciltiy && (
                      <Card.Subtitle>{req.facility.name}</Card.Subtitle>
                    )}
                    {req.receiver && (
                      <Card.Subtitle>
                        Receiver: {req.receiver.receiver.phone} (
                        {req.receiver.bloodType})
                      </Card.Subtitle>
                    )}

                    <Card.Text>
                      <p style={{ color: "white", textAlign: "left" }}>
                        {posted(req.createdAt)}
                      </p>
                    </Card.Text>
                    <Button
                      onClick={() => {
                        onAccept(req._id);
                      }}
                      variant="light"
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={() => {
                        setDonationId(req._id);
                        handleShow();
                      }}
                      style={{ marginLeft: "15px" }}
                    >
                      Transfer
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
      </Row>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Transfer to a facility</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={onFormSubmit}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="diseases">
                <FaBuilding /> Facility
              </Form.Label>
              <Select
                id="diseases"
                name="diseases"
                closeMenuOnSelect={false}
                isMulti
                options={facilities}
                onChange={onSelectChange}
                onInputChange={onInputChange}
                placeholder="Select facility"
                noOptionsMessage={() =>
                  loadingFac ? "Loading..." : "No option"
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setDonationId("");
              handleClose();
            }}
          >
            Close
          </Button>
          <Button variant="primary" onClick={handleTransferSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Pending;
