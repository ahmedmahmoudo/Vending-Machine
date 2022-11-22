import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";
import { UserInterface } from "../redux/auth/types";
import AddIcon from "@mui/icons-material/Add";
interface UserHeaderComponentPropsInterface {
  user: UserInterface;
  onLogout: () => void;
  onAddDepositClicked: () => void;
  onReset: () => void;
}

const UserHeaderComponent: React.FunctionComponent<
  UserHeaderComponentPropsInterface
> = ({ user, onLogout, onAddDepositClicked, onReset }) => {
  return (
    user && (
      <Grid container spacing={2}>
        <Grid
          item
          xs={8}
          sx={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Avatar
            sx={{
              marginRight: 1,
            }}
          >
            {user.username[0]}
          </Avatar>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography>{user.username}</Typography>
            {user.role === "buyer" && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Typography>¢{user.deposit}</Typography>
                <IconButton
                  color="error"
                  sx={{
                    marginLeft: 1,
                  }}
                  onClick={onAddDepositClicked}
                >
                  <AddIcon />
                </IconButton>
                <Button color="error" variant="text" onClick={onReset}>
                  Reset
                </Button>
              </Box>
            )}
          </Box>
        </Grid>
        <Grid
          item
          xs={2}
          sx={{
            display: "flex",
            alignItems: "end",
            justifyContent: "end",
          }}
        >
          <Button variant="text" onClick={onLogout}>
            Logout
          </Button>
        </Grid>
      </Grid>
    )
  );
};

export default UserHeaderComponent;
