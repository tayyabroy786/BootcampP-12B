import React, { ReactNode } from "react";

type lauoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: lauoutProps) => {
  return <div>{children}</div>;
};

export default Layout;
