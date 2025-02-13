import React, { useEffect, useState } from "react";
import style from "./diary_crops.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DiaryCrops = () => {
    const [crops, setCrops] = useState([]);
    const [firstDiaryDates, setFirstDiaryDates] = useState({});
    const [harvestDates, setHarvestDates] = useState({});

    const handleAddCropClick = () => {
        // 작물 등록 페이지로 이동
        navigate("/myChoice");
    };

    const cropIMG = {
        "딸기": require("../Images/1.png"),
        "벼": require("../Images/2.png"),
        "감자": require("../Images/3.png"),
        "상추": require("../Images/4.png"),
        "사과": require("../Images/5.png"),
        "고추": require("../Images/6.png"),
    };

    useEffect(() => {
        const fetchCrops = async () => {
            const token = localStorage.getItem("token");

            try {
                // 작물 정보 가져오기
                const cropsResponse = await axios.get(`http://43.201.122.113:8081/api/diary/user-crops`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "accept": "*/*",
                    },
                });

                setCrops(cropsResponse.data);
                console.log("작물 데이터:", cropsResponse.data);

                // 각 작물에 대해 첫 번째 일기 작성 날짜 조회
                const promises = cropsResponse.data.map(async (crop) => {
                    const userId = 1;
                    const cropId = crop.cropId;

                    try {
                        // 첫 번째 일기 날짜 조회
                        const response = await axios.get(
                            `http://43.201.122.113:8081/api/diary/sowling-date`,
                            {
                                params: {
                                    userId,
                                    cropId,
                                },
                                headers: {
                                    "Authorization": `Bearer ${token}`,
                                    "accept": "*/*",
                                    "Content-Type": "application/json",
                                },
                            }
                        );

                        setFirstDiaryDates((prevDates) => ({
                            ...prevDates,
                            [crop.id]: response.data, // 첫 번째 일기 작성 날짜 저장
                        }));
                    } catch (error) {
                        console.error("첫 번째 일기 날짜 오류:", error);
                    }

                    // 예상 수확일 조회
                    try {
                        const harvestResponse = await axios.get(
                            `http://43.201.122.113:8081/api/diary/ai-harvest-estimate`,
                            {
                                params: {
                                    userId,
                                    cropId,
                                },
                                headers: {
                                    "Authorization": `Bearer ${token}`,
                                    "accept": "*/*",
                                    "Content-Type": "application/json",
                                },
                            }
                        );

                        setHarvestDates((prevDates) => ({
                            ...prevDates,
                            [crop.id]: harvestResponse.data, // 예상 수확일 저장
                        }));
                    } catch (error) {
                        console.error("예상 수확일 오류:", error);
                    }
                });

                // 모든 비동기 작업이 완료될 때까지 기다림
                await Promise.all(promises);

            } catch (error) {
                console.error("작물 데이터 오류:", error);
            }
        };

        fetchCrops();
    }, []);

    const navigate = useNavigate();

    return (
        <div className={style.container}>
            <header className={style.header}>
                <div className={style.header_BackButton} onClick={() => navigate(-1)}>&lt; </div>
                <h2 className={style.header_Title}>작물 모아보기</h2>
            </header>

            <button className={style.addButton} onClick={handleAddCropClick} >
                <div className={style.plusButton}>+</div>
                <div className={style.plusButton_Text}>내 작물 등록하기</div>
            </button>

            <div className={style.myCropsText}>내 작물 목록</div>
            <div className={style.list}>
                {crops.map((crop) => (
                    <div key={crop.id} className={style.cropCard}>
                        <div className={style.cropDetail}>
                            <div className={style.cropImage_style}>
                                <img
                                    src={cropIMG[crop.cropName]}
                                    alt={crop.cropName}
                                    className={style.cropImage}
                                />
                            </div>
                            <div className={style.cropInfo}>
                                <h3 className={style.cropName}>
                                    <strong>{crop.cropName}</strong>
                                </h3>
                                <div className={style.cropData}>
                                    <div className={style.sowingDate}>
                                        🌱 작물 시작일
                                        <span
                                            className={style.sowingDate_detaile}> | {firstDiaryDates[crop.id] || "파종 등록 필요"}</span>
                                    </div>
                                    <div className={style.harvestDate}>🍂 예상 수확일
                                        <div className={style.harvestDate_detail}>| {harvestDates[crop.id] || "파종 등록 필요"}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DiaryCrops;
