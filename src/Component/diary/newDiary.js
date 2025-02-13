import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import style from "./newDiary.module.css";
import "./datePicker.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from 'date-fns/locale';
import axios from "axios";
import { FaChevronLeft, FaChevronRight, FaCamera } from "react-icons/fa6";
import { PiWarningCircle } from "react-icons/pi";

const NewDiary = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedCrop, setSelectedCrop] = useState(location.state?.crop || null);
    const [selectedActivity, setSelectedActivity] = useState(location.state?.activity || null);
    const [showModal, setShowModal] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const placeholderText = "(선택) 구체적인 내용을 적어보세요.";
    const [text, setText] = useState(placeholderText);

    const clearLocalStorage = () => {
        localStorage.removeItem("selectedCrop");
        localStorage.removeItem("selectedActivity");
    };

    useEffect(() => {
        const savedCrop = JSON.parse(localStorage.getItem("selectedCrop"));
        const savedActivity = JSON.parse(localStorage.getItem("selectedActivity"));
        if (savedCrop) setSelectedCrop(savedCrop);
        if (savedActivity) setSelectedActivity(savedActivity);
    }, []);

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();

            formData.append("userId", 1);
            formData.append("writeDate", startDate.toISOString().split('T')[0]);
            formData.append("userCropName", selectedCrop.cropName);
            formData.append("taskId", selectedActivity.id);
            formData.append("content", text === placeholderText ? "" : text);

            const response = await axios.post(
                "http://43.201.122.113:8081/api/diary",
                formData,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    }
                }
            );

            if (response.status === 200) {
                clearLocalStorage();
                alert("일기가 성공적으로 등록되었습니다.");
                navigate("/diary");
            }
        } catch (error) {
            console.error("일기 등록 실패:", error);
            alert("일기 등록에 실패했습니다.");
        }
    };

    const isFormComplete = selectedCrop && selectedActivity;

    const handleNavigate = () => {
        setShowModal(true);
    };

    const confirmNavigate = () => {
        setShowModal(false);
        navigate("/diary");
    };

    return (
        <div className={style.newDiaryc}>
            <header className={style.DiaryTitle}>
                <FaChevronLeft className={style.DiaryTitleIcon} onClick={handleNavigate} />
                <p className={style.DiaryTitleText}>영농일지 쓰기</p>
            </header>

            {showModal && (
                <div className={style.modalOverlay}>
                    <div className={style.modalContent}>
                        <h3>주의</h3>
                        <p>이 페이지를 나가도 선택한 작물/활동은 임시저장됩니다.</p>
                        <div className={style.modalButtons}>
                            <button onClick={() => setShowModal(false)}>계속하기</button>
                            <button onClick={confirmNavigate}>나가기</button>
                        </div>
                    </div>
                </div>
            )}

            <div className={style.newDiaryTitleDate}>
                <div className={style.newDiary_day}><strong>최선을 다했던 하루</strong>를 기억해요.</div>
            </div>

            <div className={style.newDiary_Item}>
                <div className={style.newDiary_date}>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        showIcon
                        className="custom-datepicker-input"
                        dateFormat="yyyy년 MM월 dd일 EEEE"
                        locale={ko}
                        popperModifiers={{
                            preventOverflow: {
                                enabled: true,
                            },
                        }}
                    />
                </div>

                <div className={style.newDiary_Weather}>
                    <div className={style.newDiary_WeatherDetail}>
                        -13 눈, 한파주의보
                    </div>
                    <div className={style.WeatherNotice}>
                        <PiWarningCircle/>
                        <p className={style.WeatherNotice_text}>날씨는 일자에 맞춰 자동으로 저장돼요</p>
                    </div>
                </div>

                <div className={style.selectCrop} onClick={() => navigate("/diary/crop-selection")}>
                    <div className={style.selectCrop_detail}>
                        {selectedCrop && selectedCrop.image && (
                            <img
                                src={selectedCrop.image}
                                alt={selectedCrop.name}
                                className={style.selectedCropImage}
                            />
                        )}
                        <p className={style.selectCropText}
                           style={{ color: selectedCrop ? "black" : "inherit" }}>
                            {selectedCrop ? selectedCrop.name : "작물을 선택하세요."}
                        </p>
                    </div>
                    <FaChevronRight/>
                </div>

                <div className={style.selectWork} onClick={() => navigate("/diary/activity-selection")}>
                    <p className={style.selectWorkText}
                       style={{ color: selectedActivity ? "black" : "inherit" }}>
                        {selectedActivity ? selectedActivity.name : "어떤 활동을 했나요?"}
                    </p>
                    <FaChevronRight/>
                </div>

                <textarea
                    className={`${style.newDiary_TextBox} ${text === placeholderText ? style.textPlaceholder : style.textEntered}`}
                    value={text}
                    onFocus={() => text === placeholderText && setText("")}
                    onBlur={() => text.trim() === "" && setText(placeholderText)}
                    onChange={(e) => setText(e.target.value)}
                />

                <button className={style.cameraButton}>
                    <div className={style.cameraButton_Text}>
                        <FaCamera className={style.cameraButtonIcon}/>(선택)사진 첨부하기
                    </div>
                </button>

                <button
                    className={`${style.registerButton} ${isFormComplete ? style.activeButton : ""}`}
                    disabled={!isFormComplete}
                    onClick={handleSubmit}
                >
                    <div className={style.registerButton_Text}>일지 등록하기</div>
                </button>
            </div>
        </div>
    );
};

export default NewDiary;
