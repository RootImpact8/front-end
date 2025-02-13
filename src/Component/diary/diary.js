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
  const [diaryList, setDiaryList] = useState([])
  const [cropList, setCropList] = useState([])

  // 예제 사용자 데이터
  const user = {
    name: "신승아",
    crops: [
      { id: 1, name: "딸기", image: one },
      { id: 2, name: "상추", image: two },
      { id: 3, name: "벼", image: thr },
    ],
  };

    // 📌 특정 사용자의 일기 목록 가져오기
    useEffect(() => {
        const fetchDiary = () => {
            const token = localStorage.getItem("token");
            const userId = 2;


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
    console.log(user);

    // 📌 사용자의 재배 작물 가져오기
    useEffect(() => {
        const fetchDiary = () => {
            const token = localStorage.getItem("token");
            const userId = 1;


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
    console.log("작물_데이터:", cropList);
    console.log(user);



  return (
      <div className={style.container}>
          <div className={style.diary_container}>
              {/* 헤더 */}
              <header className={style.header_container}>
                  <img src={Logo} alt="로고이미지" className={style.logo}/>
                  <FaCog size={24} className={style.header_icon}/> {/* 오른쪽 톱니바퀴 */}
              </header>
              <div className={style.write_button} onClick={() => navigate('/diary/newDiary')}>
                  <FaPen/>
              </div>
              {/* 사용자 정보 */}
              <div className={style.info_container}>
                  <div className={style.user_info}>
                      <span className={style.user}> <strong>{user.name}</strong> 님의 영농일지</span>
                      <div className={style.userCrop_info}>
                          <span className={style.cropList}>내 작물 정보</span>
                          <div className={style.cropListPage} onClick={() => navigate('/diary/crops')}>
                              <span>모든 작물 확인하기></span>
                          </div>

                      </div>
                  </div>

                  {/* 내 작물 정보 */}
                  <div className={style.crop_container}>
                      {cropList.map((crop) => (
                          <div key={crop.id} className={style.crop_item}>
                              <img src={crop.image} alt={crop.name} className={style.crop_image}/>
                              <div>{crop.name}</div>
                          </div>
                      ))}
                      <div className={style.add_crop}>+</div>
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