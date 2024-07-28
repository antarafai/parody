import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Register from "./Regsiter";
import Reset from "./Reset";
import FriendProfile from "./FriendProfile";
import DesignerStudio from "./Studio";
import ThetaEdgeStoreUploader from "./VideoUpload";
// import MintNFT from "./MintNFT";
import Layout from "./Layout";

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
          {/* <Route path="mint" element={<MintNFT />} /> */}
          <Route path="upload" element={<ThetaEdgeStoreUploader />} />
          <Route path="profile/:id" element={<FriendProfile />} />
        </Route>
      </Routes>
    </div>
  );
};

export default Pages;
