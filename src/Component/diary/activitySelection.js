import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import style from "./activitySelection.module.css";
import { FaChevronLeft } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import axios from "axios";

const ActivitySelectionPage = () => {
    const [activities, setActivities] = useState([]);

    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const token = localStorage.getItem("token");
                const selectedCrop = JSON.parse(localStorage.getItem("selectedCrop"));

                if (!selectedCrop) {
                    navigate("/diary/crop-selection");
                    return;
                }

                const response = await axios.get(
                    `http://43.201.122.113:8081/api/diary/tasks/${selectedCrop.id}`,
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "accept": "*/*"
                        }
                    }
                );
                setActivities(response.data);
            } catch (error) {
                console.error("작업 유형 조회 실패:", error);
            }
        };

        fetchActivities();
    }, [navigate]);


    const handleActivitySelection = (activity) => {
        localStorage.setItem("selectedActivity", JSON.stringify(activity)); // 로컬 스토리지 저장
        navigate("/diary/newDiary");
    };


    const onChange = (e) => {
        setSearch(e.target.value);
    };

    const filteredActivities = activities.filter(activity =>
        activity.name.toLowerCase().includes(search.toLowerCase())
    );

    //카테고리 구분
    const categorizedActivities = filteredActivities.reduce((acc, activity) => {
        if (!acc[activity.category]) {
            acc[activity.category] = [];
        }
        acc[activity.category].push(activity);
        return acc;
    }, {});

    return (
        <div className={style.activitySelectionPage}>
            <header className={style.activitySelectDiaryTitle}>
                <FaChevronLeft className={style.activitySelectDiaryTitleIcon} onClick={() => navigate(-1)}/>
                <p className={style.activitySelectDiaryTitleText}>기록할 활동 선택</p>
            </header>

            <p className={style.activitySelectTitleText}>
                <strong>어떤 활동</strong>을 기록할까요?
            </p>

            <div className={style.searchInputbox}>
                <div className={style.searchInputWrapper}>
                    <FaSearch className={style.searchIcon} />
                    <input
                        type="text"
                        value={search}
                        onChange={onChange}
                        placeholder="활동 이름으로 검색  예)파종"
                        className={style.searchInput}
                    />
                </div>
            </div>

            {Object.keys(categorizedActivities).length === 0 ? (
                <p>검색 결과가 없습니다.</p>
            ) : (
                Object.keys(categorizedActivities).map((category) => (
                    <div key={category} className={style.categorySection}>
                        <p className={style.categoryTitle}>{category}</p>
                        <div className={style.activityList}>
                            {categorizedActivities[category].map((activity) => (
                                <div
                                    key={activity.id}
                                    className={style.activityItem}
                                    onClick={() => handleActivitySelection(activity)}
                                >
                                    <p className={style.activityName}>{activity.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ActivitySelectionPage;