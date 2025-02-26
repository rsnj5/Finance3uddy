import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../redux/authSlice";

const Dashboard = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  return (
    <div className="dashboard-container">
      <h1>Welcome, {isAuthenticated ? "User" : "Guest"}!</h1>

      {isAuthenticated ? (
        <>
          <Link to="/transactions" className="btn add">
            Add Transaction
          </Link>
          <button className="btn logout" onClick={() => dispatch(logout())}>
            Logout
          </button>
        </>
      ) : (
        <p>Please log in to add transactions.</p>
      )}
    </div>
  );
};

export default Dashboard;

