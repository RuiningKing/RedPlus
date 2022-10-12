import {
  Navbar,
  Container,
  Nav,
  Button,
  NavDropdown,
  Badge
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import {
  FaSignInAlt,
  FaSignOutAlt,
  FaUserAlt,
  FaHome,
  FaBell,
  FaRegHeart,
  FaMedkit,
  FaListAlt
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Header() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/login");
  };

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user)
      axios
        .get("/api/users/notifications", {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        })
        .then((response) => {
          setNotifications(response.data);
        })
        .catch((err) => console.log(err));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const readNotification = (id) => {
    axios
      .delete("/api/users/notifications/" + id, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })
      .then((response) => {
        setNotifications(
          notifications.map((not) =>
            not._id === id ? { ...not, read: true } : not
          )
        );
      })
      .catch((err) => console.log(err));
  };

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>RedPlus</Navbar.Brand>
        </LinkContainer>
        <Nav className="ms-auto">
          <LinkContainer to="/">
            <Nav.Link>
              <FaHome /> Home
            </Nav.Link>
          </LinkContainer>
          {!user && (
            <>
              <LinkContainer to="/login">
                <Nav.Link>
                  <FaSignInAlt /> Login
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to="/register">
                <Nav.Link>
                  <FaUserAlt /> Register
                </Nav.Link>
              </LinkContainer>
            </>
          )}
          {user && (
            <>
              <LinkContainer to="/donate">
                <Nav.Link>
                  <FaRegHeart /> Donate
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to="/blood-request">
                <Nav.Link>
                  <FaMedkit /> Request
                </Nav.Link>
              </LinkContainer>
              {user.role === "expert" && (
                <LinkContainer to="/pending">
                  <Nav.Link>
                    <FaListAlt /> Pending
                  </Nav.Link>
                </LinkContainer>
              )}
              <NavDropdown
                style={{ marginRight: "15px" }}
                title={
                  <>
                    <FaBell />
                    {notifications.length > 0 &&
                      notifications.filter((not) => not.read === false).length >
                        0 && (
                        <Badge bg="secondary">
                          {
                            notifications.filter((not) => not.read === false)
                              .length
                          }
                        </Badge>
                      )}
                  </>
                }
                id="basic-nav-dropdown"
              >
                {notifications.length > 0 && (
                  <NavDropdown.Item disabled>Unread</NavDropdown.Item>
                )}
                {notifications.map((not) =>
                  !not.read ? (
                    <NavDropdown.Item
                      key={not._id}
                      onClick={() => readNotification(not._id)}
                    >
                      {not.message}
                    </NavDropdown.Item>
                  ) : null
                )}
                <NavDropdown.Divider />
                {notifications.length > 0 && (
                  <NavDropdown.Item disabled>Read</NavDropdown.Item>
                )}

                {notifications.map((not) =>
                  not.read ? (
                    <NavDropdown.Item key={not._id}>
                      {not.message}
                    </NavDropdown.Item>
                  ) : null
                )}
              </NavDropdown>
              <Button onClick={onLogout} variant="danger">
                <FaSignOutAlt /> Logout
              </Button>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;
