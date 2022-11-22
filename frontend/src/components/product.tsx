import { Delete, ShoppingBag } from "@mui/icons-material";
import {
  ButtonGroup,
  IconButton,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";
import { ProductInterface } from "../redux/products/types";
import EditIcon from "@mui/icons-material/Edit";
interface ProductComponentPropsInterface {
  product: ProductInterface;
  canBuy?: boolean;
  canEdit?: boolean;
  onActionClicked: (productId: number) => void;
  onDeleteClicked?: (productId: number) => void;
}

const ProductComponent: React.FunctionComponent<
  ProductComponentPropsInterface
> = ({ product, canBuy, canEdit, onActionClicked, onDeleteClicked }) => {
  return (
    <ListItem
      secondaryAction={
        (canBuy && product.amountAvailable > 0) || canEdit ? (
          <ButtonGroup>
            <IconButton
              color="primary"
              onClick={() => onActionClicked(product.id)}
            >
              {canBuy ? <ShoppingBag /> : <EditIcon />}
            </IconButton>
            {canEdit && onDeleteClicked && (
              <IconButton
                color="error"
                onClick={() => onDeleteClicked(product.id)}
              >
                <Delete />
              </IconButton>
            )}
          </ButtonGroup>
        ) : undefined
      }
    >
      <ListItemText>
        {product.productName} (¢{product.cost})
        {canBuy && product.amountAvailable === 0 && (
          <Typography sx={{ color: "red" }}>Out of stock</Typography>
        )}
      </ListItemText>
    </ListItem>
  );
};

export default ProductComponent;
