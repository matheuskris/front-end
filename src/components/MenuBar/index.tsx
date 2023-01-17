import React, { useContext, useEffect, useState } from "react";
import { Menu, Segment } from "semantic-ui-react";
import { MenuItemProps } from "semantic-ui-react/dist/commonjs/collections/Menu/MenuItem";
import { Link, Outlet } from "react-router-dom";

import { AuthContext } from "../../context/auth.context";

export default function MenuBar() {
  const [activeItem, setActiveItem] = useState("home");
  const { currentUser, setCurrentUser } = useContext(AuthContext);

  const { pathname } = window.location;

  const path = pathname === "/" ? "home" : pathname.substring(1);
  if (path !== activeItem) setActiveItem(path);

  function handleItemClick(_: any, { name }: MenuItemProps) {
    if (name) setActiveItem(name);
  }

  return (
    <div style={{ marginInline: "auto", width: "80vw" }}>
      <div>
        <Menu pointing secondary size="massive" color="teal">
          <Menu.Item
            name={currentUser ? currentUser.username : "home"}
            active={currentUser ? true : activeItem === "home"}
            onClick={handleItemClick}
            as={Link}
            to="/"
          />
          <Menu.Menu position="right">
            {currentUser ? (
              <Menu.Item
                name="logout"
                active={activeItem === "logout"}
                onClick={() => {
                  setCurrentUser(null);
                  localStorage.removeItem("hiSocialJwtToken");
                }}
              />
            ) : (
              <>
                <Menu.Item
                  name="login"
                  active={activeItem === "login"}
                  onClick={handleItemClick}
                  as={Link}
                  to="/login"
                />
                <Menu.Item
                  name="register"
                  active={activeItem === "register"}
                  onClick={handleItemClick}
                  as={Link}
                  to="/register"
                />
              </>
            )}
          </Menu.Menu>
        </Menu>
      </div>
      <Outlet />
    </div>
  );
}
