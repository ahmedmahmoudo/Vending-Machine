import { Breakpoint, Container, SxProps, Theme } from "@mui/material";
import React, { ReactNode } from "react";

interface ContainerComponentProps {
  maxWidth?: Breakpoint;
  children?: ReactNode;
  sx?: SxProps<Theme>;
}

const ContainerComponent: React.FunctionComponent<ContainerComponentProps> = ({
  maxWidth,
  children,
  sx,
}) => {
  return (
    <Container maxWidth={maxWidth} sx={sx}>
      {children}
    </Container>
  );
};

export default ContainerComponent;
