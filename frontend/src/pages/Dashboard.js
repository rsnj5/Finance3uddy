import { useSelector} from "react-redux";
import { Link } from "react-router-dom";
import "../styles/dashboard.css"; 

const Dashboard = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <div className="dashboard-container">
      <h1>Welcome, {isAuthenticated ? "User" : "Guest"}!</h1>
      
      {isAuthenticated ? (
        <>
          <Link to="/transactions" className="btn add">
            Add Transaction
          </Link>
  
          <Link to="/goals" className="btn add">
            Add Goals
          </Link>
          <Link to="/" className="btn add">
           Logout
          </Link>
         
        </>
         
      ) : (
        <p>Please log in to add transactions.</p>
      )}
    </div>
  );
};

export default Dashboard;

