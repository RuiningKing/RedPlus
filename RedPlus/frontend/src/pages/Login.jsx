import { useDispatch, useSelector } from "react-redux";
import { login, reset } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { phone as phonenumber } from "phone";

import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "./Auth.css";
import Spinner from "../components/Spinner";

function Login() {
  const [formData, setFormData] = useState({ phone: "", password: "" });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) toast.error(message);
    if (isSuccess || user) navigate("/");
  }, [user, isError, isSuccess, message, navigate]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const phoneObj = phonenumber(formData.phone);
    if (
      !formData.phone ||
      !phoneObj.isValid ||
      !formData.password ||
      formData === ""
    )
      toast.error("Phone/password is not provided or invalid");
    else {
      dispatch(login({ ...formData, phone: phoneObj.phoneNumber }));
      dispatch(reset());
    }
  };

  if (isLoading || user) return <Spinner />;

  return (
    <>
      <Container>
        <Row className="justify-content-center">
          <Col xs md={10} lg={6}>
            <h1 className="mt-5">Login</h1>
            <p>Login and start saving lives</p>
            <Form onSubmit={onSubmit}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="phone">Phone number</Form.Label>
                <Form.Control
                  type="text"
                  onChange={onChange}
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  placeholder="Enter your phone number"
                />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  onChange={onChange}
                  name="password"
                  value={formData.password}
                  placeholder="Password"
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Login
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Login;
