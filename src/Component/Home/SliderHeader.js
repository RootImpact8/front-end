import React, { useEffect, useState } from "react";
import axios from "axios";
import style from "./SliderHeader.module.css";
import { useNavigate } from "react-router-dom";

import one from "../Images/1.png";
import two from "../Images/2.png";
import three from "../Images/3.png";
import four from "../Images/4.png";
import five from "../Images/5.png";
import six from "../Images/6.png";

const CropList = () => {
  const navigate = useNavigate();
  const [crops, setCrops] = useState([]);
  const [error, setError] = useState(null);

  // Mapping from crop names to image imports and numeric IDs
  const cropDetails = {
    딸기: { id: 1, image: one },
    벼: { id: 2, image: two },
    고추: { id: 3, image: three },
    상추: { id: 4, image: four },
    사과: { id: 5, image: five },
    감자: { id: 6, image: six },
  };

  useEffect(() => {
    const fetchCrops = async () => {
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
        const interestCrops = response.data.interestCrops.slice(0, 3); // 최대 3개의 관심 작물
        
        // Map the response to include unique IDs and images
        setCrops(
          interestCrops.map(cropName => ({
            ...cropDetails[cropName], // Spread to get id and image
            name: cropName,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch crops:", error);
        setError("Failed to load crops");
      }
    };

    fetchCrops();
  }, []);

  return (
    <div className={style.cropListContainer}>
      <div className={style.sliderHeader_left}>
        <h3>관심 작물 동향</h3>
        <p onClick={() => navigate("/all-crops")}>모든 작물 확인하기</p>
      </div>

      {error ? (
        <p>{error}</p>
      ) : (
        crops.map((crop) => (
          <div
            key={crop.id}
            className={style.cropItem}
            onClick={() => navigate(`/Details/${crop.id}`)}
          >
            <img src={crop.image} alt={crop.name} className={style.cropImage} />
          </div>
        ))
      )}
    </div>
  );
};

export default CropList;
