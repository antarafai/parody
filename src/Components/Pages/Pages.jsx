import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Register from "./Regsiter";
import Reset from "./Reset";
import FriendProfile from "./FriendProfile";
import DesignerStudio from "./Studio";
import ThetaEdgeStoreUploader from "./VideoUpload";
import Layout from "./Layout";
import WalletFunctions from "./WalletFunctions";


const Pages = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="reset" element={<Reset />} />
          <Route path="studio" element={<DesignerStudio />} />
          <Route path="walletFunctions" element={<WalletFunctions/>} />
          <Route path="upload" element={<ThetaEdgeStoreUploader />} />
          <Route path="profile/:id" element={<FriendProfile />} />
        </Route>
      </Routes>
    </div>
  );
};

export default Pages;
