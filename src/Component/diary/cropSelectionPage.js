import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import style from "./cropSelectionPage.module.css";
import {FaChevronLeft} from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

const CropSelectionPage = () => {
    const user = {
        crops: [
            { id: 1, name: "딸기", image: require("../Images/1.png") },
            { id: 2, name: "상추", image: require("../Images/2.png") },
            { id: 3, name: "벼", image: require("../Images/3.png") },
            { id: 4, name: "딸기", image: require("../Images/1.png") },
            { id: 5, name: "상추", image: require("../Images/2.png") },
            { id: 6, name: "벼", image: require("../Images/3.png") },
            { id: 1, name: "딸기", image: require("../Images/1.png") },
            { id: 2, name: "상추", image: require("../Images/2.png") },


        ],
    };

    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    // 선택한 작물  NewDiary 페이지에 전달
    const handleCropSelection = (crop) => {
        localStorage.setItem("selectedCrop", JSON.stringify(crop)); // 로컬 스토리지 저장
        navigate("/diary/newDiary");
    };


    const onChange = (e) => {
        setSearch(e.target.value);
    };

    const filteredCrops = user.crops.filter(crop =>
        crop.name.toLowerCase().includes(search.toLowerCase())
    );

    const chunkedItems = [];
    for (let i = 0; i < filteredCrops.length; i += 3) {
        chunkedItems.push(filteredCrops.slice(i, i + 3));
    }

    return (
        <div className={style.cropSelectionPage}>
            <header className={style.cropSelectDiaryTitle}>
                <FaChevronLeft className={style.cropSelectDiaryTitleIcon} onClick={() => navigate(-1)}/>
                <p className={style.cropSelectDiaryTitleText}>기록할 작물 선택</p>
            </header>
            <div className={style.cropSelectionTextbold}>

            </div>
            <p className={style.cropSelectTitleText}><strong>어떤 작물</strong>을 기록할까요?</p>

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
                    chunkedItems.map((chunk, index) => (
                        <div key={index} className={style.chunkedCropGroup}>
                            {chunk.map((crop) => (
                                <div key={crop.id}>
                                    <div
                                        className={style.cropItem}
                                        onClick={() => handleCropSelection(crop)}
                                    >
                                        <img src={crop.image} alt={crop.name} className={style.cropImage} />
                                    </div>
                                    <p className={style.cropName}>{crop.name}</p>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CropSelectionPage;