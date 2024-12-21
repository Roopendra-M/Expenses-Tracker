import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import "./App.css";

// Import pages
import Dashboard from "./pages/Dashboard";
import Incomes from "./pages/Incomes";
import Expenses from "./pages/Expenses";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import ManageTransactions from "./pages/ManageTransactions";
import SignupSignin from "./components/SignupSignin";
import AboutApp from "./pages/AboutApp";
import AboutUs from "./pages/AboutUs";
import Settings from "./pages/Settings";

const App = () => {
  const [user, setUser] = useState(null);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const location = useLocation();

  // Fetch user authentication state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Sign-out functionality
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        toast.success("Signed out successfully");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  // Check if the current page should hide the navbar
  const hideNavbarPages = ["/signin", "/signup","/"];
  const showNavbar = !hideNavbarPages.includes(location.pathname);

  return (
    <div className="app-container">
      {/* Conditionally render Navbar */}
      {showNavbar && (
        <nav className="navbar">
          <ul className="navbar-links">
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/incomes">Manage Incomes</Link></li>
            <li><Link to="/expenses">Manage Expenses</Link></li>
            <li><Link to="/transactions">View Analytics</Link></li>
            {/* <li><Link to="/analytics">View Analytics</Link></li> */}
            <li><Link to="/manage-transactions">Manage Transactions</Link></li>
            <li><Link to="/about-us">About Us</Link></li>
          </ul>
          <div className="navbar-right">
            {user ? (
              <>
                <div
                  className="profile-icon"
                  onClick={() => setShowProfileCard(!showProfileCard)}
                >
                  <img
                    src={user.photoURL || "https://via.placeholder.com/150"}
                    alt="Profile"
                    className="profile-icon-img"
                  />
                </div>
                {showProfileCard && (
                  <div className="profile-card">
                    <img
                      src={user.photoURL || "https://via.placeholder.com/150"}
                      alt="Profile"
                      className="profile-card-img"
                    />
                    <div className="profile-card-details">
                      <h3>{user.displayName || "User"}</h3>
                      <p>{user.email || "No Email"}</p>
                    </div>
                  </div>
                )}
                <button
                  onClick={handleSignOut}
                  className="navbar-item sign-out-button"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/signin" className="navbar-item">Sign In</Link>
                <Link to="/signup" className="navbar-item">Sign Up</Link>
              </>
            )}
          </div>
        </nav>
      )}

      {/* Routes */}
      <Routes>
        <Route path="/" element={<SignupSignin />} />
        <Route path="/signin" element={<SignupSignin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/incomes" element={<Incomes />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/manage-transactions" element={<ManageTransactions />} />
        <Route path="/about" element={<AboutApp />} />
        <Route path="/settings" element={<Settings />} />
        <Route
          path="/about-us"
          element={<AboutUs user={user} onSignOut={handleSignOut} />}
        />
      </Routes>
    </div>
  );
};

export default App;
