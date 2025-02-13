import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./activitySelection.module.css";
import { FaChevronLeft } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

const ActivitySelectionPage = () => {
    const activities = [
        { id: 1, category: "준비", name: "💊 밑거름 시비" },
        { id: 2, category: "준비", name: "🌱 파종" },
        { id: 9, category: "준비", name: "🌱 육모"},
        { id: 3, category: "준비", name: "🚜 로터리 작업" },
        { id: 4, category: "준비", name: "🔨 비닐 터널 설치" },
        { id: 5, category: "생육", name: "💊 1차 웃거름" },
        { id: 6, category: "생육", name: "💊 2차 웃거름" },
        { id: 10, category: "생육", name: "💦 관수/배수 관리" },
        { id: 11, category: "생육", name: "⛏️ 김매기" },
        { id: 7, category: "생육", name: "🦠 병해충 방제" },
        { id: 12, category: "수확", name: "😄 잎따기 수확" },
        { id: 8, category: "수확", name: "😄 본격 수확" },
        { id: 13, category: "수확", name: "⛰️ 밭 정리" },
        { id: 14, category: "수확", name: "💊 퇴비 추가" },
        { id: 15, category: "휴식", name: "🏡 휴식" },
        { id: 16, category: "휴식", name: "⚙️ 정비" },
    ];

    const navigate = useNavigate();
    const [search, setSearch] = useState("");

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