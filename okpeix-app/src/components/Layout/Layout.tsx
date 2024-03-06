import React from "react";

type LayoutProps = {
  children: any;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <main>{children}</main>
    </>
  );
};
export default Layout;
