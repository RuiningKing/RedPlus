import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  FaHandHoldingHeart,
  FaHandHoldingWater,
  FaPhoneAlt,
  FaRegEnvelope
} from "react-icons/fa";

import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "./Auth.css";
import Spinner from "../components/Spinner";

import Select from "react-select";
import { postBloodRequest, reset } from "../features/blood/bloodSlice";

const bloodTypes = [
  { value: "O-", label: "O-" },
  { value: "O+", label: "O+" },
  { value: "B-", label: "B-" },
  { value: "B+", label: "B+" },
  { value: "A-", label: "A-" },
  { value: "A+", label: "A+" },
  { value: "AB-", label: "AB-" },
  { value: "AB+", label: "AB+" }
];

function BloodRequest() {
  const [formData, setFormData] = useState({
    bloodType: "",
    location: {
      lat: 0.0,
      lng: 0.0
    }
  });
  const [allow, setAllow] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isSuccess, isLoading } = useSelector((state) => state.blood);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          setFormData({
            ...formData,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          });
          setAllow(true);
        },
        function (_) {
          setAllow(false);
        }
      );
    } else {
      setAllow(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onBloodTypeChange = (bloodType) => {
    setFormData({ ...formData, bloodType: bloodType.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!allow) {
      toast.error(
        "You are not allowed to request, please provide your location"
      );
      return;
    }
    if (formData.bloodType === "") {
      toast.error("Please select your blood type first");
      return;
    }
    dispatch(
      postBloodRequest({ ...formData.location, bloodType: formData.bloodType })
    );
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(reset());
      navigate("/");
    }
  }, [isSuccess, dispatch, navigate]);

  if (!user || !allow || isLoading) return <Spinner />;

  return (
    <>
      <Container>
        <Row className="justify-content-center">
          <Col xs md={10} lg={6}>
            <h1 className="mt-5">Request blood transfusion</h1>
            <p>
              <FaHandHoldingHeart /> Thousands of donors using our platform are
              helpful <FaHandHoldingHeart />
            </p>
            <Form onSubmit={onSubmit}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="name">
                  <FaRegEnvelope /> Full name *
                </Form.Label>
                <Form.Control
                  type="text"
                  id="name"
                  name="name"
                  value={user.name}
                  disabled
                  placeholder="Enter your full name"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="phone">
                  <FaPhoneAlt /> Phone number *
                </Form.Label>
                <Form.Control
                  type="text"
                  onChange={onChange}
                  id="phone"
                  name="phone"
                  value={user.phone}
                  disabled
                  placeholder="Enter your phone number"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="bloodType">
                  <FaHandHoldingWater /> Please select your blood type
                </Form.Label>
                <Select
                  id="bloodType"
                  name="bloodType"
                  closeMenuOnSelect={true}
                  options={bloodTypes}
                  onChange={onBloodTypeChange}
                  placeholder="Select blood type"
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Request
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default BloodRequest;
