import React, { Component } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // This should be removed as it's not usable in class components
import Loading from "../sub/loading"; // Ensure this component exists and is correctly imported
import style from "./SliderMain.module.css"; // Ensure the CSS module exists

class SliderMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activities: null,
      cropStage: "",
      extremeWeather: false,
      summary: "",
      detailAdvice: "",
      climateWarning: null,
      climateAdvice: null,
      loading: true,
      error: null,
      showModal: false,
      selectedOption: "",
      crops: [], // Added to hold the crop options
    };
  }

  componentDidMount() {
    this.fetchCrops();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedOption !== this.state.selectedOption) {
      this.fetchData(this.state.selectedOption);
    }
  }

  fetchCrops = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        "http://43.201.122.113:8081/api/user-info/user-crops",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data && response.data.cultivatedCrops) {
        const crops = response.data.cultivatedCrops.map((crop) => ({
          id: crop,
          name: crop,
        }));
        this.setState(
          {
            crops: crops,
            selectedOption: crops[0]?.id, // Set the default selected option to the first crop's ID
          },
          () => {
            // Fetch data for the initially selected crop
            this.fetchData(crops[0]?.id);
          }
        );
      }
    } catch (error) {
      console.error("Failed to fetch user crops:", error);
      this.setState({ error: error.toString(), loading: false });
    }
  };

  fetchData = async (cropId) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("id"); // Ensure 'userId' is correctly named in localStorage
    const cropImages = { 딸기: 1, 벼: 2, 고추: 6, 상추: 4, 사과: 5, 감자: 3 };
    try {
      const response = await axios.get(
        `http://43.201.122.113:8081/api/farm/ai-recommendation?userId=${userId}&cropId=${cropImages[cropId]}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      
      this.setState({
        activities: response.data.activities,
        cropStage: response.data.cropStage,
        extremeWeather: response.data.extremeWeather,
        summary: response.data.summary,
        detailAdvice: response.data.detailedAdvice,
        climateWarning: response.data.climateWarning,
        climateAdvice: response.data.climateAdvice,
        loading: false,
      });
    } catch (error) {
      console.error("API request failed:", error);
      this.setState({ error: error.toString(), loading: false });
    }
  };

  toggleModal = () => {
    this.setState((prevState) => ({ showModal: !prevState.showModal }));
  };

  handleDropdownChange = (event) => {
    this.setState({ selectedOption: event.target.value });
  };

  render() {
    const {
      loading,
      error,
      summary,
      detailAdvice,
      showModal,
      selectedOption,
      crops,
    } = this.state;

    if (loading)
      return (
        <div
          style={{
            height: "150px",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loading />
        </div>
      );
    if (error) return <p>Error: {error}</p>;

    return (
      <div className={style.slider_container}>
        <div className={style.slider_header}>
          <h3>싹 AI의 추천 활동</h3>
          <select
            value={selectedOption}
            onChange={this.handleDropdownChange}
            className={style.dropdown}
          >
            {crops.map((crop) => (
              <option key={crop.id} value={crop.id}>
                {crop.name}
              </option>
            ))}
          </select>
        </div>

        <div className={style.summary} onClick={this.toggleModal}>
          <p>{summary}</p>
          <span className={style.find}>자세히보기</span>
        </div>

        {showModal && (
          <div className={style.modal}>
            <h2>상세 조언</h2>
            <div style={{ whiteSpace: 'pre-wrap' }}>{detailAdvice}</div>
            <button onClick={this.toggleModal}>닫기</button>
          </div>
        )}
      </div>
    );
  }
}

export default SliderMain;
