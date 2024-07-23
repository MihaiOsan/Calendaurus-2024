// Import React and ReactDOM for rendering React components into the DOM
import React from "react";
import ReactDOM from "react-dom/client";

// Import CSS styles for the application
import "./index.css";

// Import the root component of the application
import App from "./App";

// Import the function to report web vitals
import reportWebVitals from "./reportWebVitals";

// Import BrowserRouter to enable routing in the application
import { BrowserRouter as Router } from "react-router-dom";

// Import LocalizationProvider and AdapterDayjs for date and time localization
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./api/authConfig";
import { QueryClient, QueryClientProvider } from "react-query";

// Create a root for ReactDOM to render the application
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const msalInstance = new PublicClientApplication(msalConfig);
export const queryClient = new QueryClient();
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MsalProvider instance={msalInstance}>
        <Router>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <App />
          </LocalizationProvider>
        </Router>
      </MsalProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

// Measure and report web vitals to improve performance
reportWebVitals();
