import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCog } from "react-icons/fa"; // 설정 아이콘
import Logo from "../Images/Color_Logo.png";
import Calendar from "./calendar"
import "react-calendar/dist/Calendar.css";
import style from "./diary.module.css"; // CSS 모듈 import
import axios from "axios";
import { FaPen } from "react-icons/fa";

import one from "../Images/1.png";
import two from "../Images/2.png";
import thr from "../Images/3.png";
import profill from "../Images/Profill.png";

const Diary = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [diaryList, setDiaryList] = useState([]);
  const [cropList, setCropList] = useState([]);
  const [userName, setUserName] = useState("");

  // 예제 사용자 데이터
  // const user = {
  //   name: "신승아",
  //   crops: [
  //     { id: 1, name: "딸기", image: one },
  //     { id: 2, name: "상추", image: two },
  //     { id: 3, name: "벼", image: thr },
  //   ],
  // };

    const cropIMG = {
        "딸기": require("../Images/1.png"),
        "벼": require("../Images/2.png"),
        "감자": require("../Images/3.png"),
        "상추": require("../Images/4.png"),
        "사과": require("../Images/5.png"),
        "고추": require("../Images/6.png"),
    };

    // 📌 특정 사용자의 일기 목록 가져오기
    useEffect(() => {
        const fetchDiary = () => {
            const token = localStorage.getItem("token");
            const userId = 1;


                axios
                    .get(`http://43.201.122.113:8081/api/diary/user/${userId}`, {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "accept": "*/*",
                        },
                })
                .then(response => {
                    setDiaryList(response.data);
                    console.log("일기 데이터:", response.data);
                })
                .catch(error => {
                    console.error("일기 데이터 오류 :", error);
                });
        };
        console.log("setDiaryList:",setDiaryList)
        fetchDiary();



    }, []);
    console.log("일기_데이터:", diaryList);

    // 📌 사용자의 재배 작물 가져오기
    useEffect(() => {
        const fetchDiary = () => {
            const token = localStorage.getItem("token");

            axios
                .get(`http://43.201.122.113:8081/api/diary/user-crops`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "accept": "*/*",
                    },
                })
                .then(response => {
                    setCropList(response.data);
                    console.log("작물 데이터:", response.data);
                })
                .catch(error => {
                    console.error("작물 데이터 오류 :", error);
                });
        };
        console.log("setCropList:",setCropList)
        fetchDiary();
    }, []);

        useEffect(() => {
        const fetchName = () => {
            const token = localStorage.getItem("token");
            const userId = 1;

            axios
                .get(`http://43.201.122.113:8081/api/user-info/${userId}/name`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                        "accept": "*/*",
                    },
                })
                .then(response => {
                    setUserName(response.data);
                    console.log("사용자 이름:", response.data);
                })
                .catch(error => {
                    console.error("사용자이름 오류 :", error);
                });
        };
            fetchName();
        }, []);





  return (
      <div className={style.container}>
          <div className={style.diary_container}>
              {/* 헤더 */}
              <header className={style.header_container}>
                  <img src={Logo} alt="로고이미지" className={style.logo}/>
                  {/*<FaCog size={24} className={style.header_icon}/> /!* 오른쪽 톱니바퀴 *!/*/}
              </header>
              <div className={style.write_button} onClick={() => navigate('/diary/newDiary')}>
                  <FaPen/>
              </div>
              {/* 사용자 정보 */}
              <div className={style.info_container}>
                  <div className={style.user_info}>
                      <span className={style.user}> <strong>{userName.name}</strong> 님의 영농일지</span>
                      <div className={style.userCrop_info}>
                          <span className={style.cropList}>내 작물 정보</span>
                          {/*<div className={style.cropListPage} onClick={() => navigate('/diary/crops')}>*/}
                          {/*    <span>모든 작물 확인하기></span>*/}
                          {/*</div>*/}

                      </div>
                  </div>

                  {/* 내 작물 정보 */}
                  <div className={style.crop_container}>
                      {cropList.map((crop) => (
                          <div key={crop.id} className={style.crop_item}>
                              <img   src={cropIMG[crop.cropName]}
                                     alt={crop.cropName}
                                     className={style.crop_image}
                              />
                              <div>{crop.cropName}</div>
                          </div>
                      ))}
                      {/*<div className={style.add_crop}>+</div>*/}
                  </div>
              </div>

              {/* 캘린더 */}
              <div className={style.calendar_container}>
                  <Calendar diaryDateData={diaryList}
                      // onClickDay={handleDateClick}
                      // value={selectedDate}
                      // className="border-none shadow-lg"
                  />
              </div>
          </div>

      </div>


  );
};

export default Diary;