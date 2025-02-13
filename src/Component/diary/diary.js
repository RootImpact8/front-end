import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCog } from "react-icons/fa"; // 설정 아이콘
import Logo from "../Images/Color_Logo.png";
import Calendar from "./calendar"
import "react-calendar/dist/Calendar.css";
import style from "./diary.module.css"; // CSS 모듈 import

import one from "../Images/1.png";
import two from "../Images/2.png";
import thr from "../Images/3.png";
import profill from "../Images/Profill.png";

const Diary = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 예제 사용자 데이터
  const user = {
    name: "신승아",
    crops: [
      { id: 1, name: "딸기", image: one },
      { id: 2, name: "상추", image: two },
      { id: 3, name: "벼", image: thr },
    ],
  };

  // 날짜 선택 시 상세페이지로 이동
  // const handleDateClick = (date) => {
  //   setSelectedDate(date);
  //   navigate(`/details/${date.toISOString().split("T")[0]}`);
  // };

  return (
      <div className={style.container}>
          <div className={style.diary_container}>
              {/* 헤더 */}
              <header className={style.header_container}>
                  <img src={Logo} alt="로고이미지" className={style.logo}/>
                  <FaCog size={24} className={style.header_icon}/> {/* 오른쪽 톱니바퀴 */}
              </header>

              {/* 사용자 정보 */}
              <div className={style.info_container}>
                  <div className={style.user_info}>
                      <span className={style.user}>{user.name} 님의 영농일지</span>
                      <div className={style.userCrop_info}>
                          <span className={style.cropList}>내 작물 정보</span>
                          <div className={style.cropListPage} onClick={() => navigate('/diary/crops')}>
                              <span>모든 작물 확인하기></span>
                          </div>

                      </div>
                  </div>

                  {/* 내 작물 정보 */}
                  <div className={style.crop_container}>
                      {user.crops.map((crop) => (
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
                      <Calendar
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