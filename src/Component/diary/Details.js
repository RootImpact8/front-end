import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";

import Loading from "../sub/loading";

import style from "./Details.module.css";

import heart from "../Images/heart.png";
import heart_true from "../Images/heart_true.png";
import sns from "../Images/sns.png";
import back from "../Images/BackBtn.png";
import Footer from "../Home/footer";
import crop from "../Images/crop.png";

import one from "../Images/11.png";
import two from "../Images/22.png";
import three from "../Images/33.png";
import four from "../Images/44.png";
import five from "../Images/55.png";
import six from "../Images/66.png";

const Details = () => {
  const navigate = useNavigate();
  const { date } = useParams();
  const [news, setNews] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isHeartClicked, setIsHeartClicked] = useState(false); // 상태 추가

  const cropImages = {
    1: require("../Images/11.png"),
    2: require("../Images/22.png"),
    3: require("../Images/33.png"),
    4: require("../Images/44.png"),
    5: require("../Images/55.png"),
    6: require("../Images/66.png"),
  };
  

  useEffect(() => {
    const fetchNews = async () => {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id"); // localStorage에서 'userId' 가져옴

      const url = `http://43.201.122.113:8081/api/farm/crop-news?userId=${id}&cropId=${date}`;
      try {
        setLoading(true);
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNews(response.data.news); // 가정: 데이터는 'news' 필드를 가짐
        setLoading(false);
        console.log(response.data);
        
      } catch (error) {
        console.error("Error fetching news:", error);
        setError("Failed to load news");
        setLoading(false);
      }
    };

    fetchNews();
  }, [date]); // id도 의존성 배열에 추가

  const toggleHeart = () => {
    setIsHeartClicked(!isHeartClicked); // 하트 클릭 상태 토글
  };

  return (
    <div className={style.total_container}>
      <div className={style.details_container}>
        <header className={style.header}>
          <img src={back} className={style.icon} onClick={() => navigate(-1)} />
          <div className={style.iconsRight}>
            <img
              src={isHeartClicked ? heart_true : heart}
              alt="Heart"
              className={style.icon}
              onClick={toggleHeart}
            />
            <img src={sns} alt="Share" className={style.icon} />
          </div>
        </header>
        <img
          src={cropImages[date] || cropImages[1]}
          alt={`Crop image ${date}`}
          className={style.crop_img}
        />
      </div>

      <main className={style.main}>
        {loading ? (
          <Loading />
        ) : error ? (
          <p>{error}</p>
        ) : (
          <p className="mt-2 text-gray-600"><div style={{ whiteSpace: 'pre-wrap' }}>{news || "No news available."}</div></p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Details;
