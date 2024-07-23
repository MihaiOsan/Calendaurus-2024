import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "./api/authConfig";
//Import the LoginPage component
import { LoginPage } from "./pages/LoginPage";
import { MainPage } from "./pages/MainPage";

// Define the root component of the application
function App() {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const signIn = async () => {
    try {
      // Login logic using MSAL
      const loginResponse = await instance.loginPopup(loginRequest);
      sessionStorage.setItem("user", JSON.stringify(loginResponse.account));
    } catch (error) {
      console.error("Login failed: ", error);
    }
  };

  return (
    // Wrap the application components in a div with the class name "App"
    <div className="App">
      {/* Define the routes for the application */}
      <Routes>
        {/* Route for the login page */}
        <Route
          path="/" // Route path for the login page
          element={
            isAuthenticated ? (
              <Navigate to="/home" />
            ) : (
              <LoginPage signIn={signIn} />
            )
          }
          // Render the LoginPage component when the route matches
        />
        {/* Route for the home page */}
        <Route
          path="/home" // Route path for the home page
          element={
            isAuthenticated ? (
              <MainPage instance={instance} />
            ) : (
              <Navigate to="/" />
            )
          } // Render a simple div with "Main" text when the route matches
        />
      </Routes>
    </div>
  );
}

// Export the App component as the default export
export default App;
