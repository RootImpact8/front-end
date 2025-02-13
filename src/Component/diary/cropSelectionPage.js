import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import style from "./cropSelectionPage.module.css";
import { FaChevronLeft } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import axios from "axios";

const CropSelectionPage = () => {
    const navigate = useNavigate();
    const [crops, setCrops] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchDiary = () => {
            const token = localStorage.getItem("token");
            const userId = 1;

            axios
                .get('http://43.201.122.113:8081/api/diary/user-crops', {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "accept": "*/*",
                    },
                })
                .then(response => {
                    setCrops(response.data);
                    console.log("일기 데이터:", response.data);
                })
                .catch(error => {
                    console.error("일기 데이터 오류 :", error);
                });
        };
        console.log("setCrops:",setCrops)
        fetchDiary();
    }, []);

    const handleCropSelection = (crop) => {
        localStorage.setItem("selectedCrop", JSON.stringify(crop));
        navigate("/diary/newDiary");
    };

    const onChange = (e) => {
        setSearch(e.target.value);
    };

    const filteredCrops = crops.filter(crop =>
        crop.cropName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className={style.cropSelectionPage}>
            <header className={style.cropSelectDiaryTitle}>
                <FaChevronLeft
                    className={style.cropSelectDiaryTitleIcon}
                    onClick={() => navigate(-1)}
                />
                <p className={style.cropSelectDiaryTitleText}>기록할 작물 선택</p>
            </header>

            <p className={style.cropSelectTitleText}>
                <strong>어떤 작물</strong>을 기록할까요?
            </p>

            <div className={style.searchInputbox}>
                <div className={style.searchInputWrapper}>
                    <FaSearch className={style.searchIcon}/>
                    <input
                        type="text"
                        value={search}
                        onChange={onChange}
                        placeholder="작물 이름으로 검색  예)딸기"
                        className={style.searchInput}
                    />
                </div>
            </div>

            <p className={style.mycropsListText}>내가 재배중인 작물</p>

            <div className={style.cropList}>
                {filteredCrops.length === 0 ? (
                    <p>검색 결과가 없습니다.</p>
                ) : (
                    filteredCrops.map((crop) => (
                        <div key={crop.id}>
                            <div
                                className={style.cropItem}
                                onClick={() => handleCropSelection(crop)}
                            >
                                <img
                                    src={`/images/${crop.cropName}.png`}
                                    alt={crop.cropName}
                                    className={style.cropImage}
                                />
                            </div>
                            <p className={style.cropName}>{crop.cropName}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CropSelectionPage;
