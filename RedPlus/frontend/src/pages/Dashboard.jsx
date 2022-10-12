import { useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { reset } from "../features/auth/authSlice";
import BloodRequest from "./BloodRequest";
import Donate from "./Donate";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    if (!user) navigate("/login");
    return () => {
      dispatch(reset());
    };
  }, [dispatch, user, navigate]);
  if (!user) return <Spinner />;
  return (
    <>
      <BloodRequest />
      <Donate />
    </>
  );
}

export default Dashboard;
