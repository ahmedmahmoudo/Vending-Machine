import { Box, Card, Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ContainerComponent from "../components/container";
import LoginComponent from "../components/login";
import RegisterComponent from "../components/register";
import useAuth from "../hooks/use-auth";
import { loginAction, registerAction } from "../redux/auth/auth.actions";
import { AppDispatch } from "../redux/store";

const LoginPage: React.FunctionComponent = () => {
  const [tab, setTab] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/", {
        replace: true,
      });
    }
  }, [user, navigate]);

  const onLogin = (username: string, password: string) => {
    dispatch(loginAction({ username, password }));
  };

  const onRegister = (username: string, password: string, role: string) => {
    dispatch(
      registerAction({
        username,
        password,
        role,
      })
    );
  };

  const a11yProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  };
  return (
    <ContainerComponent maxWidth={"md"}>
      <Card
        sx={{
          margin: "1rem",
          padding: "1rem",
        }}
      >
        <Box>
          <Tabs value={tab} onChange={(e, value) => setTab(value)}>
            <Tab label="Login" {...a11yProps(0)} />
            <Tab label="Register" {...a11yProps(1)} />
          </Tabs>
        </Box>
        {tab === 0 && <LoginComponent onLogin={onLogin} />}
        {tab === 1 && <RegisterComponent onRegister={onRegister} />}
      </Card>
    </ContainerComponent>
  );
};

export default LoginPage;
