import React from "react";
import LeftSide from "../LeftSidebar/LeftSide";
import CardSection from "../Main/CardSection";
import Navbar from "../Navbar/Navbar";
import RightSide from "../RightSidebar/RightSide";
import Main from "../Main/Main";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="w-full">
      <div className="fixed top-0 z-10 w-full bg-white">
        <Navbar></Navbar>
      </div>
      <div className="flex bg-gray-100">
        <div className="flex-auto w-[20%] fixed top-12">
          <LeftSide></LeftSide>
        </div>
        <div className="flex-auto w-[60%] absolute left-[20%] top-14 bg-gray-100 rounded-xl">
          <div className="w-[80%] mx-auto">
            <CardSection></CardSection>
            <div className="flex justify-center items-center mt-4 mb-8">
              <Link to="/studio" className="inline-block">
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300">
                  Go to Designer Studio
                </button>
              </Link>
            </div>
            <Main></Main>
          </div>
        </div>
        <div className="flex-auto w-[20%] fixed right-0 top-12">
          <RightSide></RightSide>
        </div>
      </div>
    </div>
  );
};

export default Home;
