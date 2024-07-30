import React from "react";
import maximoWoodenBot from "../../assets/images/maximoWoodenBot.jpeg";
import maximoYbot from "../../assets/images/maximoYbot.jpeg";
import imgfight from "../../assets/images/imgfight.jpg";
import avatar1 from "../../assets/images/avatar.jpg"; // Replace with your avatar image path
import avatar2 from "../../assets/images/avatar2.jpeg";
import avatar3 from "../../assets/images/avatar3.jpeg";
import avatar4 from "../../assets/images/avatar4.jpeg";
import avatar5 from "../../assets/images/avatar5.jpeg";

const CardSection = () => {
  const cards = [
    { image: maximoWoodenBot, avatar: avatar1 },
    { image: maximoYbot, avatar: avatar2 },
    { image: imgfight, avatar: avatar3 },
    { image: maximoYbot, avatar: avatar4 },
    { image: maximoWoodenBot, avatar: avatar5 },
  ];

  return (
    <div>
      <div className="">
        {/* Card Section */}
        <div className="carousel carousel-center w-74 bg-neutral rounded-box space-x-4 p-4">
          {cards.map((card, index) => (
            <div className="carousel-item relative" key={index}>
              <img src={card.image} alt="" className="rounded-box" />
              <div className="absolute inset-0 bg-black bg-opacity-70 flex justify-center items-center rounded-box">
                <img
                  src={card.avatar}
                  alt="avatar"
                  className="rounded-full w-12 h-12 border-2 border-accent"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardSection;