"use client"
import React, { useEffect, useState } from "react";
import s from "./HomePage.module.scss"; // Assuming the correct path to your Sass module
import google from "../../../assets/google.png";
import enter from "../../../assets/enter.png";
import versus from "../../../assets/versus.png";
import axios from "axios";
import dayjs from "dayjs";

const HomePage = () => {
  const [isButtonClicked, setIsButtonClicked] = useState("");
  const [forums, setForums] = useState([]);
  const [fights, setFights] = useState([]);

  const handleClick = (buttonType:string) => {
    console.log("Button Clicked", buttonType);
    setIsButtonClicked(buttonType);
  };

  const getForums = async () => {
    try {
      const response = await axios.get("http://localhost:8080/forum/getForum");
      const fightResponse = await axios.get(
        "http://localhost:8080/fights/getFights"
      );
      console.log(fightResponse.data);
      setFights(fightResponse?.data?.fights);
      setForums(response?.data?.forums);
    } catch (err) {
      console.log(err);
    }
  };
  const groupForumsByDate = (forums:any) => {
    const groupedForums:any = {};
  
    forums.forEach((forum:any) => {
      const date = dayjs(forum.date).format("MMMM D"); // Format date as "April 7"
      if (groupedForums[date]) {
        groupedForums[date].push(forum);
      } else {
        groupedForums[date] = [forum];
      }
    });
    const reversedGroupedForums = Object.fromEntries(Object.entries(groupedForums).reverse());
  
    return reversedGroupedForums;
  };

  useEffect(() => {
    getForums();
  }, []);


  return (
    <>
      <div className={s.root}>
        <div className={s.navbar}>
          <span className={s.pageLogo}>
            <img src={google.src} alt="Google Logo" />
          </span>
          <input type="text" className={s.search} placeholder="Search..." />
          <div className={s.divider} />
          <button
            className={`${s.navbarButton} ${
              isButtonClicked === "challenge" ? s.isButtonClicked : ""
            }`}
            onClick={() => handleClick("challenge")}
          >
            Challenge!!
          </button>
          <button
            className={`${s.navbarButton} ${
              isButtonClicked === "list" ? s.isButtonClicked : ""
            }`}
            onClick={() => handleClick("list")}
          >
            Requests
          </button>
          <span className={s.userButtons}>
            <img src={enter.src} alt="Enter" />
          </span>
        </div>
      </div>
      <div className={s.body}>
        <div className={s.blogs}>
          {Object.entries(groupForumsByDate(forums)).map(
            ([date, forumsForDate]:[any,any]) => (
              <div key={date}>
                <p className={s.date}>{date}</p>
                {forumsForDate.map((forum:any) => (
                  <div key={forum._id} className={s.blog}>
                    <p>
                      {forum.title.length > 40
                        ? `${forum.title.substring(0, 40)}...`
                        : forum.title}
                    </p>
                    <p className={s.authorName}>{forum.createdBy}</p>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
        <div className={s.matches}>
          <p className={s.heading} style={{ marginLeft: "12" }}>
            Matches
          </p>
          {fights.map((fight:any) => (
            <div key={fight?._id} className={s.match}>
              <p className={s.versus}>
                {fight?.challenger}
                <img className={s.versusImg} src={versus.src} alt="Versus" />
                {fight?.challenged}
              </p>
              <p className={s.timeDate}>
                {dayjs(fight.date).format("MMM DD, HH:mm")}
              </p>
              <div className={s.divider} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HomePage;
