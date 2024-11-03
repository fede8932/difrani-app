import React, { useState } from "react";
import styles from "./customAcordion.module.css";

const CustomAcordion = ({ props }) => {
  const { textButton, icon01, items, notific } = props;
  // console.log(notific);
  const [isOpen, setIsOpen] = useState(false);
  const [iconClass, setIconClass] = useState("sideIconGri");
  const [icon02, setIcon02] = useState("fa-solid fa-caret-down");

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
    let icon = isOpen ? "fa-solid fa-caret-down" : "fa-solid fa-caret-up";
    setIcon02(icon);
  };

  return (
    <div>
      <button
        className={styles.sideOptionButton}
        onMouseOver={() => {
          setIconClass("sideIconVio");
        }}
        onMouseLeave={() => {
          setIconClass("sideIconGri");
        }}
        onClick={toggleAccordion}
      >
        <div>
          <i className={`${styles[iconClass]} ${icon01}`}></i>
          <span className={styles.textContainer}>
            {textButton}
            {notific?.notific ? <div className={styles.notif}></div> : null}
          </span>
        </div>
        <div>
          <i className={`${styles[iconClass]} ${icon02}`}></i>
        </div>
      </button>
      {isOpen && (
        <div className={styles.contentContainer}>
          {items.map((item, i) => (
            <button
              key={i}
              className={styles.interButton}
              onClick={() => {
                item.fn();
              }}
            >
              <i className={`${styles.pointIcon} fa-solid fa-circle`}></i>
              <span>{item.textButton}</span>
              {notific?.notific && i == notific?.index ? (
                <div className={styles.notif}></div>
              ) : null}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomAcordion;
