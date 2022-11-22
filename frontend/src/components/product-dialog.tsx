import { Dialog, DialogTitle, Button, TextField } from "@mui/material";
import React, { ChangeEvent, useMemo, useState } from "react";
import { ProductInterface } from "../redux/products/types";
import ContainerComponent from "./container";
interface ProductDialogComponentPropsInterface {
  isOpened: boolean;
  onClose: () => void;
  onSave?: (product: ProductInterface) => void;
  onUpdate?: (product: ProductInterface) => void;
  product?: ProductInterface;
}

const ProductDialogComponent: React.FunctionComponent<
  ProductDialogComponentPropsInterface
> = ({ onClose, onSave, onUpdate, product, isOpened }) => {
  const [productName, setProductName] = useState<string>(
    product?.productName ?? ""
  );
  const [productCost, setProductCost] = useState<number>(product?.cost ?? 0);
  const [amountAvailable, setAmountAvailable] = useState<number>(
    product?.amountAvailable ?? 0
  );

  const [invalidNumber, setInvalidNumber] = useState({
    cost: false,
    amountAvailable: false,
  });

  const onSubmitClicked = () => {
    if (canSubmit) {
      if (product && onUpdate) {
        onUpdate({
          id: product.id,
          productName,
          cost: productCost,
          amountAvailable,
        });
      } else {
        if (onSave) {
          onSave({
            id: 0,
            productName,
            cost: productCost,
            amountAvailable,
          });
        }
      }
    }
  };

  const onInputChange =
    (inputName: string) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (inputName === "productName") {
        setProductName(value);
      } else {
        if (value) {
          const numericValue = parseInt(value, 10);
          if (Number.isNaN(numericValue)) {
            inputName === "productCost"
              ? setInvalidNumber((prev) => ({
                  ...prev,
                  cost: true,
                }))
              : setInvalidNumber((prev) => ({
                  ...prev,
                  amountAvailable: true,
                }));
          } else {
            if (inputName === "productCost") {
              setProductCost(numericValue);
              setInvalidNumber((prev) => ({
                ...prev,
                cost: false,
              }));
            } else {
              setAmountAvailable(numericValue);
              setInvalidNumber((prev) => ({
                ...prev,
                amountAvailable: false,
              }));
            }
          }
        } else {
          if (inputName === "productCost") {
            setProductCost(0);
            setInvalidNumber((prev) => ({
              ...prev,
              cost: false,
            }));
          } else {
            setAmountAvailable(0);
            setInvalidNumber((prev) => ({
              ...prev,
              amountAvailable: false,
            }));
          }
        }
      }
    };

  const canSubmit = useMemo(() => {
    return productName.length > 0 && productCost > 0 && amountAvailable > 0;
  }, [productName, productCost, amountAvailable]);

  const helperText = "Only numbers are allowed to be entered";

  return (
    <Dialog onClose={onClose} open={isOpened}>
      <DialogTitle>
        {onUpdate ? `Edit ${product!.productName}` : "Create a new product"}
      </DialogTitle>
      <ContainerComponent
        maxWidth="xl"
        sx={{
          padding: 3,
        }}
      >
        <TextField
          fullWidth
          label="Product Name"
          value={productName}
          onChange={onInputChange("productName")}
          sx={{
            marginBottom: 3,
          }}
        />
        <TextField
          fullWidth
          id="outlined-adornment-amount"
          value={productCost}
          onChange={onInputChange("productCost")}
          label="Cost"
          error={invalidNumber.cost}
          helperText={invalidNumber.cost ? helperText : ""}
          sx={{
            marginBottom: 3,
          }}
        />
        <TextField
          fullWidth
          id="outlined-adornment-amount"
          value={amountAvailable}
          onChange={onInputChange("amountAvailable")}
          label="Amount Available"
          error={invalidNumber.amountAvailable}
          helperText={invalidNumber.amountAvailable ? helperText : ""}
          sx={{
            marginBottom: 3,
          }}
        />
        <Button
          disabled={!canSubmit}
          onClick={onSubmitClicked}
          variant="contained"
          sx={{
            width: 90,
          }}
        >
          {onUpdate ? "Update" : "Save"}
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

export default ProductDialogComponent;
