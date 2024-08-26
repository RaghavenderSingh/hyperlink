import React from "react";
import Nav from "./(components)/Nav";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Nav />
      {children}
    </div>
  );
}
