import React from "react";
import "../sass/styles.scss";
import { IoPersonCircle, IoAlertCircleOutline } from "react-icons/io5";
import { SlSocialSpotify } from "react-icons/sl";
const Header = () => {
  return (
    <>
      <header>
        <div className={"header-wrapper"}>
          <a className="web-title">
            Artise
            <span>
              <SlSocialSpotify />
            </span>
            rch
          </a>

          <ul>
            <li>
              <a href="#">Hello</a>
            </li>

            <li>
              <a href="#">Support</a>
            </li>

            <li>
              <a href="#">About</a>
            </li>
          </ul>
        </div>
      </header>
    </>
  );
};

export default Header;
