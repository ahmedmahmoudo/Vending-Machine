import { Dialog, DialogTitle, Button, TextField } from "@mui/material";
import React, { ChangeEvent, useMemo, useState } from "react";
import useAuth from "../hooks/use-auth";
import useProducts from "../hooks/use-products";
import ContainerComponent from "./container";
interface BuyDialogComponentPropsInterface {
  isOpened: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => void;
  disable: boolean;
}

const BuyDialogComponent: React.FunctionComponent<
  BuyDialogComponentPropsInterface
> = ({ onClose, onSubmit, isOpened, disable }) => {
  const [amount, setAmount] = useState(0);
  const [isInputError, setIsInputError] = useState(false);
  const { selectedProduct, products } = useProducts();
  const { user } = useAuth();

  const onSubmitClicked = () => {
    if (amount === 0) return;
    onSubmit(amount);
  };

  const setAmountValue = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const value = parseInt(e.target.value, 10);
      if (Number.isNaN(value)) {
        setIsInputError(true);
      } else {
        setAmount(value);
        setIsInputError(false);
      }
    } else {
      setAmount(0);
    }
  };

  const helperText = useMemo(() => {
    const selectedProductEntity = products.find(
      (p) => p.id === selectedProduct
    );
    if (selectedProductEntity && user) {
      if (amount > selectedProductEntity.amountAvailable) {
        setIsInputError(true);
        return "You buy can't more than the available amount";
      } else if (selectedProductEntity.cost * amount > user.deposit) {
        setIsInputError(true);
        return "You don't have enough money to buy that";
      } else {
        setIsInputError(false);
        return `Available amount is ${selectedProductEntity.amountAvailable}`;
      }
    } else {
      return "";
    }
  }, [products, user, amount, selectedProduct]);

  return (
    <Dialog onClose={onClose} open={isOpened}>
      <DialogTitle>Enter amount to buy</DialogTitle>
      <ContainerComponent
        maxWidth="xl"
        sx={{
          padding: 3,
        }}
      >
        <TextField
          fullWidth
          id="outlined-adornment-amount"
          value={amount}
          onChange={setAmountValue}
          label="Amount"
          error={isInputError}
          helperText={helperText}
          disabled={disable}
          sx={{
            marginBottom: 3,
          }}
        />
        <Button
          disabled={amount === 0 || disable || isInputError}
          onClick={onSubmitClicked}
          variant="contained"
          sx={{
            width: 90,
          }}
        >
          Buy
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

export default BuyDialogComponent;
