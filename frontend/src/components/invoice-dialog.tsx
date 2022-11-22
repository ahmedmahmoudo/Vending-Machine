import {
  Dialog,
  DialogTitle,
  Button,
  Typography,
  ListItem,
  List,
} from "@mui/material";
import React, { useMemo } from "react";
import { InvoiceInterface } from "../redux/products/types";
import ContainerComponent from "./container";
interface InvoiceDialogComponentPropsInterface {
  isOpened: boolean;
  onClose: () => void;
  invoice: InvoiceInterface;
}

const InvoiceDialogComponent: React.FunctionComponent<
  InvoiceDialogComponentPropsInterface
> = ({ onClose, isOpened, invoice }) => {
  const change = useMemo(() => {
    if (invoice) {
      const hundred = invoice.change.filter((c) => c === 100);
      const fifties = invoice.change.filter((c) => c === 50);
      const twenties = invoice.change.filter((c) => c === 20);
      const tenth = invoice.change.filter((c) => c === 10);
      const fives = invoice.change.filter((c) => c === 5);
      return (
        <>
          {hundred.length > 0 && <ListItem>{hundred.length} x ¢100</ListItem>}
          {fifties.length > 0 && <ListItem>{fifties.length} x ¢50</ListItem>}
          {twenties.length > 0 && <ListItem>{twenties.length} x ¢20</ListItem>}
          {tenth.length > 0 && <ListItem>{tenth.length} x ¢10</ListItem>}
          {fives.length > 0 && <ListItem>{fives.length} x ¢5</ListItem>}
        </>
      );
    }
  }, [invoice]);

  return (
    <Dialog onClose={onClose} open={isOpened}>
      <DialogTitle>Your Invoice</DialogTitle>
      <ContainerComponent
        maxWidth="xl"
        sx={{
          padding: 3,
        }}
      >
        <List>
          <ListItem>
            <Typography>Product Bought: {invoice.productBought}</Typography>
          </ListItem>
          <ListItem>
            <Typography>Total Spent: ¢{invoice.totalSpent}</Typography>
          </ListItem>
          <ListItem>
            <Typography>Your Change:</Typography>
          </ListItem>
          {change}
        </List>
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </ContainerComponent>
    </Dialog>
  );
};

export default InvoiceDialogComponent;
