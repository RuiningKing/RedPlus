import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getBloodRequests,
  postDonation,
  reset
} from "../features/blood/bloodSlice";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";

import moment from "moment";
import { FaBuilding, FaHandHoldingHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import Select from "react-select";
import axios from "axios";

function Donate() {
  const [facilities, setFacilities] = useState([{ value: "", label: "" }]);
  const [facility, setFacility] = useState("");
  const [loadingFac, setLoadingFac] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { bloodRequests, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.blood
  );

  useEffect(() => {
    if (isSuccess) {
      toast.success("Success");
      dispatch(reset());
      navigate(0);
    }
    if (isError) {
      console.log("Err", message);
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
          dispatch(getBloodRequests({ lat, lng }));
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

  const onDonateClick = (requestId) => {
    dispatch(postDonation(requestId));
  };

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

  const isValidDonation = (donor, receiver) => {
    if (donor === "O-") return true;
    if (donor === "O+") return receiver.endsWith("+");
    if (donor === "B-") return receiver.includes("B");
    if (donor === "B+") return receiver.includes("B") && receiver.endsWith("+");
    if (donor === "A-") return receiver.includes("A");
    if (donor === "A+") return receiver.includes("A") && receiver.endsWith("+");
    if (donor === "AB-") return receiver.includes("AB");
    if (donor === "AB+")
      return receiver.includes("AB") && receiver.endsWith("+");
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

  if (!user || !bloodRequests || isLoading) return <Spinner />;
  return (
    <Container>
      <h1 className="mt-5">Donate your blood</h1>
      <p className="mb-5">
        <FaHandHoldingHeart /> A single blood drop can give a new life{" "}
        <FaHandHoldingHeart />
      </p>
      <Row>
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
      </Row>
      <h1 className="mt-3 mb-3">Donate to people in need</h1>
      <Row>
        {bloodRequests &&
          bloodRequests.length > 0 &&
          bloodRequests.map((req) => {
            const isValid = isValidDonation(user.bloodType, req.bloodType);
            return (
              <Col xs={12} sm={6} md={4} lg={3} className="mb-3">
                <Card
                  style={{ width: "100%" }}
                  bg={isValid ? "success" : "light"}
                  text={isValid ? "white" : "dark"}
                >
                  <Card.Header className="mb-2">
                    Blood Type: {req.bloodType}
                  </Card.Header>
                  <Card.Body>
                    <Card.Text>
                      <p
                        style={{
                          color: isValid ? "white" : "#1a1a1a",
                          textAlign: "left"
                        }}
                      >
                        {posted(req.createdAt)}
                      </p>
                    </Card.Text>
                    <Button
                      variant={isValid ? "light" : "secondary"}
                      disabled={!isValid}
                      onClick={() => onDonateClick(req._id)}
                    >
                      Donate
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
      </Row>
    </Container>
  );
}

export default Donate;
