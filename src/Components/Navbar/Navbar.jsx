import React from "react";
import NavLinks from "./NavLinks";
import UserLinks from "./UserLinks";
import { Link } from "react-router-dom";
import parodyLogo from "../../assets/images/parodyLogo.png";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center w-full" style={{ marginTop: '-40px', marginBottom: '-50px', position: 'fixed', top: -12, left: 0, right: 0, backgroundColor: 'transparent', zIndex: 1000 }} >
      <Link to="/">
        <div className="flex items-center">
          <img src={parodyLogo} alt="" className="w-40 h-44 m-0" style={{ marginRight: '-55px', marginBottom: '10px' }} />
          <div className="text-3xl text-white font-orbitron glitch" style={{ marginBottom: '-10px' }}>
            arody
          </div>
        </div>
      </Link>
      <div className="justify-center item-center mx4-auto" style={{ marginBottom: '-10px' }}>
        <NavLinks></NavLinks>
      </div>
      <div style={{ marginBottom: '-10px', marginLeft:'0px' }}>
        <UserLinks></UserLinks>
      </div>
    </div>
  );
};

export default Navbar;
