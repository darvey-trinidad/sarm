import React from "react";
import { Button } from "@/components/ui/button";
import { PageRoutes } from "@/constants/page-routes";
const Header = () => {
  return (
    <div className="flex justify-end">
      <Button>Request Room</Button>
    </div>
  );
};

export default Header;
