import React from "react";
import logo from "../assets/logo.svg";
import { Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

export type LoginProps = {
  signIn: () => void;
};

export const LoginPage = (props: LoginProps) => {
  const { signIn } = props;
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <img src={logo} className="App-logo" alt="logo" />
      <Button
        className="login-btn"
        variant="contained"
        onClick={() => {
          signIn();
        }}
      >
        LOGIN
      </Button>
    </Container>
  );
};
