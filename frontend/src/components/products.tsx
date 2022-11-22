import { Add } from "@mui/icons-material";
import { Button, Card, CardContent, CardHeader, List } from "@mui/material";
import React from "react";
import { ProductInterface } from "../redux/products/types";
import ProductComponent from "./product";

interface ProductsComponentPropsInterface {
  products: ProductInterface[];
  canBuy?: boolean;
  canEdit?: boolean;
  onProductActionClicked: (productId: number) => void;
  onAddClicked?: () => void;
  onDeleteClicked?: (productId: number) => void;
}

const ProductsComponent: React.FunctionComponent<
  ProductsComponentPropsInterface
> = ({
  products,
  canBuy,
  canEdit,
  onProductActionClicked,
  onAddClicked,
  onDeleteClicked,
}) => {
  return (
    <Card
      sx={{
        marginTop: 10,
      }}
    >
      <CardHeader title="Products" />
      <CardContent>
        {canEdit && (
          <Button
            variant="contained"
            color="success"
            endIcon={<Add />}
            onClick={onAddClicked}
          >
            Add Product
          </Button>
        )}
        <List>
          {products &&
            products.map((product, key) => (
              <ProductComponent
                product={product}
                key={key}
                onActionClicked={onProductActionClicked}
                canBuy={canBuy}
                canEdit={canEdit}
                onDeleteClicked={onDeleteClicked}
              />
            ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default ProductsComponent;
