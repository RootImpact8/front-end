import React, { Component } from "react";
import axios from "axios";
import style from "./WeatherInfo.module.css";

// 10가지 날씨별 이미지 가져오기
import sunnyDay from "../Images/sunny.png";
import fewCloudsDay from "../Images/fewclouds.png";
import cloudyDay from "../Images/cloudy.png";
import windyDay from "../Images/windy.png";
import rainyDay from "../Images/rainy.png";
import sunnyNight from "../Images/clearnight.png";
import fewCloudsNight from "../Images/fewcloudsnight.png";
import rainyNight from "../Images/rainynight.png";
import thunderstorm from "../Images/thunderstorm.png";
import snow from "../Images/snow.png";

class WeatherInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weatherData: null,
      error: null,
      maxTemp: localStorage.getItem('maxTemp') || null,
      minTemp: localStorage.getItem('minTemp') || null,
      weather: null,
    };
  }

  componentDidMount() {
    this.getWeatherData(this.props.lat, this.props.lon);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.lat !== this.props.lat || prevProps.lon !== this.props.lon) {
      this.getWeatherData(this.props.lat, this.props.lon);
    }
  }

  getWeatherData = async (lat, lon) => {
    if (!lat || !lon) {
      console.error("오류: 위도 및 경도 값이 없음!");
      return;
    }

    try {
      const apiKey = "54472b70418f40a98c480223250702";
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

      console.log("날씨 API 응답:", response.data);
      
      // 현재 온도를 기준으로 최고/최저 온도 계산
      const currentTemp = response.data.current.temp_c;
      const maxTemp = Math.round(currentTemp + 3);
      const minTemp = Math.round(currentTemp - 3);

      // 로컬 스토리지에 저장
      localStorage.setItem('maxTemp', maxTemp);
      localStorage.setItem('minTemp', minTemp);

      this.setState({ 
        weatherData: response.data,
        maxTemp,
        minTemp
      });
    } catch (error) {
      console.error(
        "API 요청 실패:",
        error.response ? error.response.data : error.message
      );
      this.setState({ error: "날씨 정보를 불러오지 못함" });
    }
  };

  // 날씨 코드 기반으로 이미지 매칭
  getWeatherImage = (condition, isDay) => {
    const conditionLower = condition.toLowerCase();

    if (conditionLower.includes("맑음")) return isDay ? sunnyDay : sunnyNight;
    if (
      conditionLower.includes("구름 조금") ||
      conditionLower.includes("구름 약간")
    )
      return isDay ? fewCloudsDay : fewCloudsNight;
    if (conditionLower.includes("흐림") || conditionLower.includes("구름 많음"))
      return cloudyDay;
    if (conditionLower.includes("강풍") || conditionLower.includes("바람"))
      return windyDay;
    if (conditionLower.includes("비")) return isDay ? rainyDay : rainyNight;
    if (conditionLower.includes("뇌우")) return thunderstorm;
    if (conditionLower.includes("눈")) return snow;

    return sunnyDay;
  };

  // 날씨 상태에 따른 배경 그라데이션 설정
  getBackgroundGradient = (condition) => {
    const conditionLower = condition.toLowerCase();

    if (conditionLower.includes("맑음"))
      return "linear-gradient(135deg, #629DEE, #A8DEE0)"; // 맑은 날
    if (conditionLower.includes("구름") || conditionLower.includes("흐림"))
      return "linear-gradient(135deg, #A4C8E1, #6E94B9)"; // 구름 많음
    if (conditionLower.includes("비"))
      return "linear-gradient(135deg, #5A75A0, #6E94B9)"; // 비 오는 날
    if (conditionLower.includes("뇌우"))
      return "linear-gradient(135deg, #293259, #5C77A2)"; // 뇌우
    if (conditionLower.includes("눈"))
      return "linear-gradient(135deg, #DDEFFF, #A9C7E3)"; // 눈 오는 날

    return "linear-gradient(135deg, #A8DEE0, #629DEE)"; // 기본 배경
  };

  render() {
    const { weatherData, error, maxTemp, minTemp } = this.state;

    if (error) {
      return <p>{error}</p>;
    }

    if (!weatherData) {
      return <p>날씨 정보를 불러오는 중...</p>;
    }

    const conditionText = weatherData.current.condition.text;
    const isDay = weatherData.current.is_day === 1;
    const weatherImage = this.getWeatherImage(conditionText, isDay);
    const backgroundGradient = this.getBackgroundGradient(conditionText);

    return (
      <div
        className={style.weather_container}
        style={{ background: backgroundGradient }}
      >
        {/* 상단 날짜 정보 */}
        <p className={style.date_info}>
          오늘, {weatherData.location.localtime}
        </p>

        <div className={style.weather_main}>
          {/* 현재 온도 및 날씨 설명 */}
          <div className={style.weather_details}>
            <div className={style.temp_weather}>
              <h1>{Math.round(weatherData.current.temp_c)}°</h1>
              <span className={style.weather_status}>{conditionText}</span>
            </div>

            {/* 최고/최저 온도 */}
            <p className={style.weather_temp}>
              {maxTemp}° / {minTemp}°
            </p>

            {/* 강수 확률 & 바람 (소수점 제거) */}
            <p className={style.weather_sub}>
              강수 확률 {Math.round(weatherData.current.precip_mm)}% | 바람{" "}
              {Math.round(weatherData.current.wind_kph)} km/h
            </p>
          </div>

          {/* 날씨 아이콘 */}
          <div className={style.weather_icon}>
            <img
              src={weatherImage}
              alt={conditionText}
              className={style.weather_image}
            />
          </div>
        </div>

        {/* 날씨 관련 TIP */}
        <hr />
        <p className={style.weather_tip}>
          TIP: 농작물 심기에{" "}
          {weatherData.current.temp_c > 15 ? "적합합니다." : "다소 쌀쌀합니다."}
        </p>
      </div>
    );
  }
}

export default WeatherInfo;