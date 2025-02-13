import React, { Component } from 'react';
import axios from "axios";


class Warning extends Component {
    constructor(props) {
        super(props);
        this.state = {
          location: null,
          loading: false,
          error: null,
        };
      }
    
      componentDidMount() {
        this.fetchLocation();
      }
      fetchLocation = async () => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem('id'); // Ensure 'userId' is correctly fetched
    
        try {
          const response = await axios.get(`http://43.201.122.113:8081/api/farm/ai-recommendation?userId=${userId}&cropId=3`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          this.setState({ location: response.data, loading: false });
        } catch (error) {
          console.error("API request failed:", error);
          this.setState({ error: error.toString(), loading: false });
        }
      };
    render() {

        return (
            <div>
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
            </div>
        );
    }
}

export default Warning;