import React, { useState } from "react";
import styles from "./navbar.module.css";
import logo from "../../assets/logo/logo.png";
import CustomButton from "../../commonds/button/CustomButton";
import CustomSearch from "../../commonds/search/CustomSearch";
import NewMenu from "../../commonds/newMenu/NewMenu";
import { useDispatch } from "react-redux";
import { sendLogoutRequest } from "../../redux/user";

function NavbarComponent(props) {
  const { fnSidebar } = props;
  const dispatch = useDispatch();
  return (
    <div className={styles.navbarContainer}>
      <div className={styles.titleLogo}>
        <div>
          <img className={styles.logo} src={logo} alt="Logo" />
          <h1 className={styles.title}>Ad panel</h1>
        </div>
        <CustomButton
          props={{
            buttonStyle: "menuButton",
            icon: "fa-solid fa-bars",
            iconStyle: "menuIconVio",
            iconHoverStyle: "menuIconBla",
            fnSidebar: fnSidebar,
          }}
        />
      </div>
      <div className={styles.barContainer}>
        <div style={{ display: "flex", width: "950px", alignItems: "center" }}>
          <CustomSearch />
        </div>
        <div className={styles.perfilContainer}>
          <CustomButton
            props={{
              buttonStyle: "menuButton",
              icon: "fa-regular fa-bell",
              iconStyle: "menuIconVio",
              iconHoverStyle: "menuIconBla",
            }}
          />
          <NewMenu
            direction="left"
            perfilFn={() => {
              console.log("no hay fn");
            }}
            logOutFn={() => {
              dispatch(sendLogoutRequest());
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default NavbarComponent;
