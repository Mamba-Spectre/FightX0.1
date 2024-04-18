"use client";
import React, { useEffect, useState } from "react";
import s from "./HomePage.module.scss";
import google from "../../../assets/google.png";
import enter from "../../../assets/enter.png";
import versus from "../../../assets/versus.png";
import axios from "axios";
import dayjs from "dayjs";
import FightRequestModal from "../FightRequestModal";
import Login from "../Login";
import Loader from "../Loader";
import RequestsModal from "../RequestsModal";
import FightDetails from "../FightDetails";
import UserModal from "../UserDetailsModal";
import Cash from "../../../assets/cash.png";
import WalletModal from "../WalletModal";

interface UserData {
  username: string;
  profilePicture: string;
  walletBalance: number;
}

const HomePage = () => {
  const [isButtonClicked, setIsButtonClicked] = useState("");
  const [forums, setForums] = useState([]);
  const [fights, setFights] = useState([]);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [walletModal, setWalletModal] = useState(false);
  const [fightChallengeModal, setFightChallengeModal] = useState(false);
  const [fightDetailsModal, setFightDetailsModal] = useState(false);
  const [requestsModal, setRequestsModal] = useState(false);
  const [fightID, setFightID] = useState("");
  const [userModal, setUserModal] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    username: "",
    profilePicture: "",
    walletBalance: 0,
  });
  const [userButtonClicked, setUserButtonClicked] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleClick = (buttonType: string) => {
    setIsButtonClicked(buttonType);
  };
  const getForums = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/forum/getForum`
      );
      const fightResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/fights/getFights`
      );
      console.log(fightResponse.data);
      setFights(fightResponse?.data?.fights);
      setForums(response?.data?.forums);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };
  const groupForumsByDate = (forums: any) => {
    const groupedForums: any = {};

    forums.forEach((forum: any) => {
      const date = dayjs(forum.date).format("MMMM D");
      if (groupedForums[date]) {
        groupedForums[date].push(forum);
      } else {
        groupedForums[date] = [forum];
      }
    });
    const reversedGroupedForums = Object.fromEntries(
      Object.entries(groupedForums).reverse()
    );

    return reversedGroupedForums;
  };
  const getUserData = async () => {
    const username = localStorage.getItem("username");
    const profilePicture = localStorage.getItem("profilePicture");
    if (username && profilePicture) {
      const walletBalance: any = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/details`,
        {
          params: {
            username,
          },
        }
      );
      const data = walletBalance.data.user.walletBalance;
      setUserData({ username, profilePicture, walletBalance: data });
    }
  };

  useEffect(() => {
    getForums();
    getUserData();
  }, []);

  return (
    <>
      <div className={s.main}>
        {loading ? (
          <div className={s.loader}>
            <Loader />
          </div>
        ) : (
          <>
            <div className={s.root}>
              <div className={s.navbar}>
                <span className={s.pageLogo}>
                  <img src={google.src} alt="Google Logo" />
                </span>
                <input
                  type="text"
                  className={s.search}
                  placeholder="Search..."
                />
                <div className={s.divider} />
                <button
                  className={`${s.navbarButton} ${
                    isButtonClicked === "challenge" ? s.isButtonClicked : ""
                  }`}
                  onClick={() => {
                    handleClick("challenge");
                    setFightChallengeModal(true);
                  }}
                  disabled={!userData.username || !userData.profilePicture}
                >
                  Challenge!!
                </button>
                <button
                  className={`${s.navbarButton} ${
                    isButtonClicked === "list" ? s.isButtonClicked : ""
                  }`}
                  onClick={() => {
                    handleClick("list");
                    setRequestsModal((print) => !print);
                  }}
                  disabled={!userData.username || !userData.profilePicture}
                >
                  Requests
                </button>
                <button className={s.navbarButton} disabled>
                  Forums
                </button>

                <div className={s.userButtons}>
                  {userData?.username ? (
                    <>
                      <div className={s.wallet} onClick={()=> setWalletModal(true)}>
                        <img src={Cash.src} />
                       {userData.walletBalance}
                      </div>
                      <img
                        onClick={() =>
                          setUserButtonClicked((prevState) => !prevState)
                        }
                        className={s.profilePicture}
                        src={userData?.profilePicture}
                        alt=""
                      />
                    </>
                  ) : (
                    <>
                      <img
                        onClick={() => {
                          setLoginModalOpen(true);
                        }}
                        src={enter.src}
                        alt="Enter"
                      />
                    </>
                  )}
                  {userButtonClicked && (
                    <div className={s.userDropdown}>
                      <button
                        onClick={() => {
                          setUserModal(true), setUserButtonClicked(false);
                        }}
                      >
                        View Personal Details
                      </button>
                      <button
                        onClick={() => {
                          localStorage.clear();
                          window.location.reload();
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className={s.body}>
              <div className={s.blogs}>
                {Object.entries(groupForumsByDate(forums)).map(
                  ([date, forumsForDate]: [any, any]) => (
                    <div key={date}>
                      <p className={s.date}>{date}</p>
                      {forumsForDate.map((forum: any) => (
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
                {fights.map((fight: any) => (
                  <div
                    key={fight?._id}
                    className={s.match}
                    onClick={() => {
                      setFightDetailsModal(true), setFightID(fight._id);
                    }}
                  >
                    <p className={s.versus}>
                      {fight?.challenger?.name}
                      <img
                        className={s.versusImg}
                        src={versus.src}
                        alt="Versus"
                      />
                      {fight?.challenged?.name}
                    </p>
                    <p className={s.timeDate}>
                      {dayjs(fight.date).format("MMM DD, HH:mm")}
                    </p>
                    <div className={s.divider} />
                  </div>
                ))}
              </div>
              {isButtonClicked === "challenge" && (
                <FightRequestModal
                  modalOpen={fightChallengeModal}
                  closeModal={() => {
                    setFightChallengeModal(false), setIsButtonClicked("");
                  }}
                />
              )}
              {requestsModal && (
                <RequestsModal
                  isOpen={requestsModal}
                  closeModal={() => {
                    setRequestsModal(false), setIsButtonClicked("");
                  }}
                />
              )}
              {loginModalOpen && (
                <Login
                  modalOpen={loginModalOpen}
                  closeModal={() => setLoginModalOpen(false)}
                />
              )}
              {fightDetailsModal && (
                <FightDetails
                  modalOpen={fightDetailsModal}
                  closeModal={() => {setFightDetailsModal(false),getUserData()}}
                  fightID={fightID}
                />
              )}
              {userModal && (
                <UserModal
                  modalOpen={userModal}
                  closeModal={() => setUserModal(false)}
                />
              )}
              {walletModal && (
                <WalletModal
                  modalOpen={walletModal}
                  closeModal={() => {getUserData(), setWalletModal(false)}}
                />
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default HomePage;
