import React, { Component, useEffect } from "react";
import axios from "axios";
import WeatherInfo from "./WeatherInfo";
import Footer from "./footer";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // 🔹 아이콘 추가
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import Logo from "../Images/Logo.png";
import profill2 from "../Images/Profill2.png";
import gps from "../Images/GPS.png";
import cropImage from "../Images/crop.png";
import RedGPS from "../Images/redGPS.png";
import warning from "../Images/warning.png";

import style from "./Home.module.css";

import SliderHeader from "./SliderHeader";
import SliderMain from "./SliderMain";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: "",
      latitude: null,
      longitude: null,
      locationInfo: null,
      error: null,
      error: null,
      currentDate: this.getCurrentDate(),
      abnormalWeather: null,
      cropWarning: "",
      cropInfo: "",
      city: "",
      state: "",
      activities: [
        {
          id: 1,
          title: "새로운 비료 활용법",
          description: "더 나은 수확을 위한 친환경 비료 사용법",
          type: "수확",
          image: require("../Images/star1.png"),
        },
        {
          id: 2,
          title: "봄철 병해충 방제",
          description: "작물을 안전하게 보호하는 효과적인 방법",
          type: "비료",
          image: require("../Images/star2.png"),
        },
        {
          id: 3,
          title: "모든 추천 확인하기",
        },
      ],

      /** ✅ 관심 작물 데이터 추가 */
      starCrops: [
        { id: 1, name: "딸기", image: require("../Images/star1.png") },
        { id: 2, name: "벼", image: require("../Images/star2.png") },
        { id: 3, name: "배추", image: require("../Images/star3.png") },
        { id: 4, name: "딸기", image: require("../Images/star4.png") },
        { id: 5, image: require("../Images/star5.png") },
      ],
    };
  }

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState(
            {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
            () => {
              this.getLocationName(
                position.coords.latitude,
                position.coords.longitude
              );
              this.getWeatherData(
                position.coords.latitude,
                position.coords.longitude
              );
            }
          );
        },
        (error) => {
          console.error(error);
          this.setState({ error: "Unable to retrieve your location" });
        }
      );
    } else {
      this.setState({ error: "Geolocation is not supported by this browser." });
    }
  }

  getCurrentDate() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    return `${month}월 ${day}일`;
  }

  getLocationName = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse`,
        {
          params: {
            format: "json",
            lat: lat,
            lon: lon,
            zoom: 10,
            addressdetails: 1,
          },
        }
      );

      if (response.data.address) {
        const state = response.data.address.state ?? "";
        const city =
          response.data.address.city ??
          response.data.address.town ??
          response.data.address.county ??
          "";
        const district =
          response.data.address.city_district ??
          response.data.address.suburb ??
          "";
        const locationName = [state, city, district].filter(Boolean).join(", ");
        this.setState({ location: locationName });
      } else {
        this.setState({ location: "Location details not available" });
      }
      this.setState({
        city: response.data.address.city || response.data.address.town,
        state: response.data.address.state,
      });
    } catch (error) {
      console.error("Failed to fetch location details", error);
      this.setState({ error: "Failed to load location details" });
    }
  };

  getWeatherData = async (lat, lon) => {
    try {
      const apiKey = "YOUR_WEATHER_API_KEY";
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json`,
        {
          params: {
            key: apiKey,
            q: `${lat},${lon}`,
            lang: "ko",
          },
        }
      );

      this.checkAbnormalWeather(response.data.current);
    } catch (error) {
      console.error("날씨 데이터를 가져오는 중 오류 발생:", error);
    }
  };

  checkAbnormalWeather = (weatherData) => {
    const { temp_c, wind_kph, precip_mm, condition } = weatherData;
    let abnormalType = null;
    let warningMessage = "";
    let advice = "";

    if (temp_c <= -5) {
      abnormalType = "한파 경보";
      warningMessage = "비닐하우스 내부 온도를 유지하세요!";
      advice = "최소 6°C 이상을 유지하여 작물 동해를 예방하세요.";
    } else if (temp_c >= 35) {
      abnormalType = "폭염 경보";
      warningMessage = "햇빛 차단을 위해 차광망을 사용하세요!";
      advice = "낮에는 차광망을 설치하고, 저녁에는 환기를 충분히 하세요.";
    } else if (precip_mm >= 50) {
      abnormalType = "폭우 경보";
      warningMessage = "배수로 점검 및 비닐하우스 방수 작업 필요!";
      advice = "비닐하우스 주변 배수로를 미리 정리하여 침수를 방지하세요.";
    } else if (wind_kph >= 54) {
      abnormalType = "강풍 경보";
      warningMessage = "비닐하우스 고정 및 강풍 대비!";
      advice = "작물이 쓰러지지 않도록 지지대를 설치하고 하우스를 고정하세요.";
    } else if (
      condition.text.includes("폭설") ||
      condition.text.includes("뇌우")
    ) {
      abnormalType = condition.text;
      warningMessage = "강설량 증가, 하우스 적설량 주의!";
      advice = "비닐하우스 지붕의 눈을 미리 제거하여 붕괴를 방지하세요.";
    }

    this.setState({
      abnormalWeather: abnormalType,
      cropWarning: warningMessage,
      cropInfo: advice,
    });
  };
  starSliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1.5,
    slidesToScroll: 1,
    arrows: false,
  };
  componentDidMount() {
    this.fetchPrice();
    this.fetchLocationInfo();
  }

  fetchLocationInfo = () => {
    const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
    const url = "http://43.201.122.113:8081/api/user-info/location";

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        this.setState({ locationInfo: response.data });
        console.log(response);
        
      })
      .catch((error) => {
        console.error("Error fetching location info:", error);
        this.setState({ error: "Failed to fetch location information" });
      });
  };

  fetchPrice = async () => {
    const token = localStorage.getItem("token");
    const url = "http://43.201.122.113:8081/api/farm/price?cropId=1";

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Extract price data from the response
      const prices = response.data.priceData.map((data) => data.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      this.setState({
        priceInfo: response.data.priceData,
        minPrice,
        maxPrice,
        loading: false,
      });
    } catch (error) {
      this.setState({ error: error.toString(), loading: false });
    }
  };

  render() {
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");
    const { location, priceInfo, minPrice, maxPrice, loading, error } =
      this.state;
    const url = "http://43.201.122.113:8081/api/farm/price?cropName=딸기";
    const urlSplit = url.split("=");
    const price = urlSplit[urlSplit.length - 1];
    const { locationInfo } = this.state;
    const weather = true;

    return (
      <>
        <header className={style.home_header_container}>
          <img src={Logo} alt="로고이미지" className={style.home_LogoImg} />
          {token ? (
            <img
              src={profill2}
              alt="프로필 이미지"
              className={style.profillImg}
              onClick={() => this.props.navigate("/info")}
            />
          ) : (
            <span
              className={style.login_text}
              onClick={() => this.props.navigate("/login")}
            >
              로그인하기
            </span>
          )}
        </header>

        <main className={style.main_container}>
          <div className={style.gps_container} onClick={() => this.props.navigate("/address")}>
            <p>
              <img src={gps} alt="GPS이미지" />

              {/* {this.state.error ? this.state.error : this.state.location} */}
            </p>
            {locationInfo ? (
                <p className={style.gps_user_address}>{`${locationInfo.city} ${locationInfo.state}`}</p>
              ) : (
                <p>Loading location information...</p>
              )}
          </div>

          <h2 className={style.Today_LongContainer}>
            <div className={style.Today_container}>
              {this.state.currentDate}
            </div>
            의 농사 TIP
          </h2>

          {localStorage.getItem("latitude") &&
            localStorage.getItem("longitude") && (
              <WeatherInfo
                lat={localStorage.getItem("latitude")}
                lon={localStorage.getItem("longitude")}
              />
            )}

          {/* ✅ 관심 작물 슬라이더 */}
          <SliderHeader/>

          {weather === "true" ? (
        <div>
          <div className={style.warning_container}>
            <img src={warning} alt="경고 이미지" />
            <span className={style.warning_red}>이상기후</span>
            <span>발생 경보</span>
          </div>

          <div className={style.abnormal_weather_modal}>
            <div className={style.abnormal_weather_content}>
              <img
                src={cropImage}
                alt="작물 보호 이미지"
                className={style.crop_image}
              />

              <div className={style.text_container}>
                <div className={style.abnormal_weather_header}>
                  <span className={style.warning_red}>폭설 경보</span>
                  <span> | 딸기 냉해 대비법</span>
                </div>
                <p className={style.crop_warning}>
                  야간 온풍기 대기 온도
                  <span className={style.highlight}> +1°</span>
                </p>
                <p className={style.crop_info}>최소 6도를 유지해요</p>
              </div>
            </div>

            <button
              className={style.detail_button}
              onClick={() => this.props.navigate("/Detail")}
            >
              대처 방안 상세 보기 &gt;
            </button>
          </div>
        </div>
      ) : (
        <SliderMain
          title="싹 AI의 추천 활동"
          activities={this.state.activities}
          slidesToShow={3}
        />
      )}
          <div>현재 농작물 도매가</div>
          {loading ? (
            <p>Loading data...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <div>
              <p>{price} 1Kg당</p>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={priceInfo}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" />
                  <YAxis domain={[minPrice, maxPrice]} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorPrice)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </main>
        <Footer />
      </>
    );
  }
}

export default function MainWithNavigation(props) {
  const navigate = useNavigate();
  return <Main {...props} navigate={navigate} />;
}
