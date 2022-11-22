import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import React, { ChangeEvent, MouseEvent, useMemo, useState } from "react";
import useAuth from "../hooks/use-auth";

interface RegisterComponentPropsInterface {
  onRegister: (username: string, password: string, role: string) => void;
}
const RegisterComponent: React.FunctionComponent<
  RegisterComponentPropsInterface
> = ({ onRegister }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer");
  const { isLoading, errors } = useAuth();

  const onInputChange =
    (inputName: string) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (inputName === "username") {
        setUsername(value);
      } else {
        setPassword(value);
      }
    };

  const onRoleChanged = (e: SelectChangeEvent) => {
    setRole(e.target.value);
  };

  const isRegisterDisabled = useMemo(() => {
    const isDisabled =
      username.length === 0 ||
      username.length < 4 ||
      username.length > 255 ||
      password.length === 0 ||
      password.length < 6 ||
      password.length > 20;
    return isDisabled;
  }, [username, password]);

  const usernameError = useMemo(() => {
    return (
      (username.length > 0 && username.length < 4) || username.length > 255
    );
  }, [username]);

  const usernameErrorHelper = useMemo(() => {
    if (usernameError) {
      return "Username must be between 4 and 255 characters";
    } else {
      return "";
    }
  }, [usernameError]);

  const passwordError = useMemo(() => {
    return (password.length > 0 && password.length < 6) || password.length > 20;
  }, [password]);

  const passwordErrorHelper = useMemo(() => {
    if (passwordError) {
      return "password must be between 6 and 20 characters";
    } else {
      return "";
    }
  }, [passwordError]);

  const doRegister = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!usernameError && !passwordError) {
      onRegister(username, password, role);
    }
  };

  return (
    <Box
      component="form"
      autoComplete="off"
      sx={{
        marginTop: 3,
      }}
      noValidate
    >
      {errors && (
        <Typography
          sx={{
            color: "red",
            marginBottom: 3,
          }}
        >
          {errors}
        </Typography>
      )}
      <TextField
        fullWidth
        label="Username"
        value={username}
        onChange={onInputChange("username")}
        sx={{
          marginBottom: 3,
        }}
        error={usernameError}
        helperText={usernameErrorHelper}
      />
      <TextField
        fullWidth
        label="Password"
        value={password}
        onChange={onInputChange("password")}
        sx={{
          marginBottom: 3,
        }}
        error={passwordError}
        helperText={passwordErrorHelper}
        type="password"
      />
      <FormControl
        fullWidth
        sx={{
          marginBottom: 3,
        }}
      >
        <Select value={role} onChange={onRoleChanged}>
          <MenuItem value="buyer">Buyer</MenuItem>
          <MenuItem value="buyer">Seller</MenuItem>
        </Select>
      </FormControl>
      {isLoading ? (
        <LoadingButton loading={isLoading}>Login</LoadingButton>
      ) : (
        <Button
          type="submit"
          variant="contained"
          onClick={doRegister}
          disabled={isRegisterDisabled}
        >
          Register
        </Button>
      )}
    </Box>
  );
};

export default RegisterComponent;
