import React, {Component, useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom'; // 라우터 이동을 위해 useNavigate 훅 추가
import style from "./info.module.css";
import LogoImg from "../Images/Logo.png";
import GPS from '../Images/GPS.png';

import green1 from '../Images/green_heart.png';
import green2 from '../Images/green_job.png';
import right from '../Images/rigit_arrow.png';
import bottom from '../Images/bottom_arrow.png';
import axios from "axios";

function Info() {
  const navigate = useNavigate(); // navigate 함수 사용
  const [userName, setUserName] = useState("");

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
    <div>
      <header className={style.header}>
        <div className={style.header_container}>
            <span className={style.header_text1}><strong>{userName.name}</strong> 님,</span>
            <span className={style.header_text2}>안녕하세요!</span>
        </div>
        <div>
          <img src={LogoImg} className={style.Logo_image} alt="로고이미지" />
        </div>
      </header>
      <main>
        <div className={style.main_container}>
          <span><img src={GPS} alt="GPS위치 이미지" />내 위치</span>
          <span>강원도 원주시 <img src={bottom} alt="하단 화살표"/></span>
        </div>
        <div className={style.main_sub_container}>
          <div className={style.main_sub1} onClick={() => navigate('/diary/crops')}>
              <img src={green1} alt="관심 작물"/>
              <span>관심작물</span>
              <p>모든 작물 확인하기 &gt; </p>
          </div>
          <div className={style.main_sub2} onClick={() => navigate('/diary/crops')}>
              <img src={green2} alt="내 작물"/>
              <span>내 작물</span>
              <p>모든 작물 확인하기 &gt; </p>
          </div>
        </div>
      </main>
      <div className={style.footer_container}>
          <div>로그인 정보 <img src={right} alt="오른쪽 화살표"/></div>
          <div>고객 센터 <img src={right} alt="오른쪽 화살표"/></div>
          <div>비전 정보 <img src={right} alt="오른쪽 화살표"/></div>
      </div>
    </div>
  );
}

export default Info;
