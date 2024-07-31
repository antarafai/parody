import React, { useState } from "react";
import { Input } from "@material-tailwind/react";
import { Button } from "@material-tailwind/react";
import { Typography } from "@material-tailwind/react";

const Reset = () => {
  const [email, setEmail] = useState("");

  return (
    <div className="grid grid-cols-1 justify-items-center items-center h-screen">
      <div className="w-96">
        <div className="pb-4 justify-items-center items-center font-orbitron text-accent">
          Enter the email address associated with your account and we 'll send
          you a link to reset your password
        </div>
        <Input
          name="email"
          type="email"
          lable="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></Input>
        <button className="btn btn-sm mt-4 bg-accent text-black font-thin" style={{marginLeft:'148px'}}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default Reset;
