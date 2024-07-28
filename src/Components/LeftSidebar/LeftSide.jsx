import React, { useEffect, useContext } from "react";
import { Tooltip } from "@material-tailwind/react";
import { Avatar } from "@material-tailwind/react";
import avatar from "../../assets/images/avatar.jpg";
import { AuthContext } from "../AppContext/AppContext";

const LeftSide = () => {
  const { user, userData } = useContext(AuthContext);

  useEffect(() => {
  }, []);

  return (
    <div className="flex flex-col h-screen bg-black pb-4 border-2 border-black rounded-r-xl shadow-lg">
      <div className="flex flex-col items-center relative">
        <div className="mt-2">
          <Tooltip content="Profile" placement="top">
            <Avatar size="md" src={user?.photoURL || avatar} alt="avatar" className="rounded-full"></Avatar>
          </Tooltip>
        </div>
      </div>
      <div className="flex flex-col items-center pt-6">
        <p className="font-roboto font-medium text-md text-gray-700 no-underline tracking-normal leading-none">
          {user?.email || userData?.email}
        </p>
      </div>
    </div>
  );
};

export default LeftSide;
