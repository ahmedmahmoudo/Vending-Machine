import { Dialog, DialogTitle, Grid, Button } from "@mui/material";
import React, { useState } from "react";
import ContainerComponent from "./container";
interface DepositDialogComponentPropsInterface {
  isOpened: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => void;
}

const DepositDialogComponent: React.FunctionComponent<
  DepositDialogComponentPropsInterface
> = ({ onClose, onSubmit, isOpened }) => {
  const [amount, setAmount] = useState(0);
  const availableAmount = [5, 10, 20, 50, 100];

  const onSubmitClicked = () => {
    if (amount === 0) return;
    onSubmit(amount);
  };
  return (
    <Dialog onClose={onClose} open={isOpened}>
      <DialogTitle>Deposit coins</DialogTitle>
      <ContainerComponent
        maxWidth="xl"
        sx={{
          padding: 3,
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{
            marginBottom: 3,
            justifyContent: "center",
          }}
        >
          {availableAmount.map((am, index) => (
            <Grid item sm={3} key={index}>
              <Button
                variant={"contained"}
                color={amount === am ? "success" : "primary"}
                onClick={() => setAmount(am)}
              >
                {am}
              </Button>
            </Grid>
          ))}
        </Grid>
        <Button
          disabled={amount === 0}
          onClick={onSubmitClicked}
          variant="contained"
          sx={{
            width: 90,
          }}
        >
          Deposit
        </Button>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            width: 90,
            ml: 1,
          }}
        >
          close
        </Button>
      </ContainerComponent>
    </Dialog>
  );
};

export default DepositDialogComponent;
