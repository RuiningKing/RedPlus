import { useDispatch, useSelector } from "react-redux";
import { register, reset } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { phone as phonenumber } from "phone";

import {
  FaEye,
  FaHandHoldingHeart,
  FaHandHoldingWater,
  FaKey,
  FaPhoneAlt,
  FaRegEnvelope,
  FaVirus
} from "react-icons/fa";

import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "./Auth.css";
import Spinner from "../components/Spinner";

import Select from "react-select";

const diseases = [
  { value: "Babesiosis", label: "Babesiosis" },
  { value: "Chagas Disease", label: "Chagas Disease" },
  { value: "Leishmaniasis", label: "Leishmaniasis" },
  { value: "Malaria", label: "Malaria" },
  { value: "ChikV", label: "Chikungunya Virus" },
  { value: "DF", label: "Dengue Fever" },
  { value: "HAV", label: "Hepatitis A Virus" },
  { value: "HBV", label: "Hepatitis B Virus" },
  { value: "HCV", label: "Hepatitis C Virus" },
  { value: "HEV", label: "Hepatitis E Virus" },
  { value: "HIV", label: "Human Immunodeficiency Virus" },
  { value: "HTLV", label: "Human T-Cell Lymphotrophic Virus" },
  { value: "WNV", label: "West Nile Virus" },
  { value: "ZIKV", label: "Zika Virus" }
];

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

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password2: "",
    diseases: [],
    bloodType: "",
    location: {
      lat: 0.0,
      lng: 0.0
    }
  });
  const [allow, setAllow] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) toast.error(message);
    if (isSuccess || user) navigate("/");
  }, [user, isError, isSuccess, message, navigate]);

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

  const onDiseaseChange = (diseases) => {
    setFormData({ ...formData, diseases: diseases.map((dis) => dis.value) });
  };

  const onBloodTypeChange = (bloodType) => {
    setFormData({ ...formData, bloodType: bloodType.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!allow) {
      toast.error(
        "You are not allowed to register, please provide your location"
      );
      return;
    }
    const {
      name,
      email,
      phone,
      password,
      password2,
      diseases,
      bloodType,
      location
    } = formData;
    const phoneObj = phonenumber(phone);
    // eslint-disable-next-line no-useless-escape
    const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!name || name === "" || name.length < 3) {
      toast.error("Invalid name");
    } else if (email && !emailPattern.test(email)) {
      toast.error("Invalid email address");
    } else if (!phone || !phoneObj.isValid) {
      toast.error("Invalid phone number");
    } else if (!password || password.length < 4) {
      toast.error("Password is empty or too short");
    } else if (password2 !== password) {
      toast.error("Passwords do not match");
    } else {
      dispatch(
        register({
          name,
          email,
          phone: phoneObj.phoneNumber,
          password,
          diseases,
          bloodType,
          location
        })
      );
      dispatch(reset());
    }
  };

  if (isLoading || user) return <Spinner />;

  return (
    <>
      <Container>
        <Row className="justify-content-center">
          <Col xs md={10} lg={6}>
            <h1 className="mt-5">Register</h1>
            <p>
              <FaHandHoldingHeart /> Register to RedPlus <FaHandHoldingHeart />
            </p>
            <Form onSubmit={onSubmit}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="name">
                  <FaRegEnvelope /> Full name *
                </Form.Label>
                <Form.Control
                  type="text"
                  onChange={onChange}
                  id="name"
                  name="name"
                  value={formData.name}
                  placeholder="Enter your full name"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="email">
                  <FaRegEnvelope /> Email address
                </Form.Label>
                <Form.Control
                  type="email"
                  onChange={onChange}
                  id="email"
                  name="email"
                  value={formData.email}
                  placeholder="Enter email"
                />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
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
                  value={formData.phone}
                  placeholder="Enter your phone number"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="password">
                  <FaKey /> Password *
                </Form.Label>
                <Form.Control
                  type="password"
                  onChange={onChange}
                  id="password"
                  name="password"
                  value={formData.password}
                  placeholder="Password"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="password2">
                  <FaEye /> Confirm Password *
                </Form.Label>
                <Form.Control
                  type="password"
                  onChange={onChange}
                  id="password2"
                  name="password2"
                  value={formData.password2}
                  placeholder="Confirm your password"
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
                  options={[
                    { value: "", label: "I do not know" },
                    ...bloodTypes
                  ]}
                  onChange={onBloodTypeChange}
                  placeholder="Select blood type, if known"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="diseases">
                  <FaVirus /> Please indicate if you have any of the following
                  diseases
                </Form.Label>
                <Select
                  id="diseases"
                  name="diseases"
                  closeMenuOnSelect={false}
                  isMulti
                  options={diseases}
                  onChange={onDiseaseChange}
                  placeholder="Select diseaese, if any"
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Register;
