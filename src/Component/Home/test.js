import React, { Component } from "react";
import axios from "axios";

class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: null,
      priceInfo: [], // Array of price data
      news: "", // Single news item
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchLocation();
    this.fetchPrice();
    this.fetchNews();
    this.initializeGeolocation();
  }

  fetchLocation = async () => {
    const token = localStorage.getItem("token");
    const url = "http://43.201.122.113:8081/api/user-info/user-crops";
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      this.setState({ location: response.data, loading: false });
    } catch (error) {
      this.setState({ error: error.toString(), loading: false });
    }
  };

  // fetchPrice = async () => {
  //   const token = localStorage.getItem("token");
  //   const url = "http://43.201.122.113:8081/api/farm/price?cropName=딸기";
  //   try {
  //     const response = await axios.get(url, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     const priceData = [
  //       {
  //         date: response.data.previousDate,
  //         price: response.data.previousPrice,
  //       },
  //       { date: response.data.currentDate, price: response.data.currentPrice },
  //     ];
  //     this.setState({ priceInfo: priceData, loading: false });
  //   } catch (error) {
  //     this.setState({ error: error.toString(), loading: false });
  //   }
  // };

  // fetchNews = async () => {
  //   const token = localStorage.getItem("token");
  //   const cropName = "딸기";
  //   const url = `http://43.201.122.113:8081/api/farm/crop-news?cropId=1`;
  //   try {
  //     const response = await axios.get(url, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'application/json',
  //         'Accept': 'application/json',
  //       },
  //     });
  //     this.setState({ news: response.data.news, loading: false });
  //   } catch (error) {
  //     console.log("Error details:", error.response);
  //     this.setState({ error: error.toString(), loading: false });
  //   }
  // };

  initializeGeolocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.setState({ latitude, longitude }, () => {
            this.getLocationName(latitude, longitude);
            this.getWeatherData(latitude, longitude);
          });
        },
        (error) => {
          this.setState({ error: "위치 특정 불가" });
        }
      );
    } else {
      this.setState({ error: "위치 특정 불가" });
    }
  };

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
        },
      );
      if (response.data.address) {
        const state = response.data.address.state ?? "";
        const city = response.data.address.city ?? response.data.address.town ?? response.data.address.county ?? "";
        const district = response.data.address.city_district ?? response.data.address.suburb ?? "";
        const locationName = [state, city, district].filter(Boolean).join(" ");
        this.setState({ location: locationName });
      } else {
        this.setState({ location: "위치 정보를 찾을 수 없음" });
      }
    } catch (error) {
      this.setState({ location: "위치 정보를 불러오지 못함", error: error.toString() });
    }
  };

  render() {
    const { news } = this.state;
    return (
      <div>
        {news && (
          <div>
            <h2>Latest News on Strawberries</h2>
            <p>{news}</p>
          </div>
        )}
      </div>
    );
  }
}

export default Test;
