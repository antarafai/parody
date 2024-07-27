import React from "react";
import Home from "./Home";
import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Regsiter";
import Reset from "./Reset";
import FriendProfile from "./FriendProfile";
import DesignerStudio from "./Studio";
import ThetaEdgeStoreUploader from "./VideoUpload";
import MintNFT from "./MintNFT";

const Pages = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/register" element={<Register></Register>}></Route>
        <Route path="reset" element={<Reset></Reset>}></Route>
        <Route path="/studio" element={<DesignerStudio></DesignerStudio>}></Route>
        <Route path="/mint" element={<MintNFT></MintNFT>}></Route>
        <Route
          path="/upload"
          element={<ThetaEdgeStoreUploader></ThetaEdgeStoreUploader>}></Route>
        <Route
          path="/profile/:id"
          element={<FriendProfile></FriendProfile>}
        ></Route>
      </Routes>
    </div>
  );
};

export default Pages;
