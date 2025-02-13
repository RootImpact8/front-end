import React, { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./calendar.css";

const CalendarComponent = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const eventDetailsRef = useRef(null);

    const diaryData = [
        {
            date: "2025-02-19",
            title: "휴식",
            icon: "🏡",
            time: "AM 08:00",
            crop: "딸기",
            details: "온풍기 20 정도 유지...",
            temperature: "12℃ / 4℃",
            weather: "☀️",
        },
        {
            date: "2025-02-20",
            title: "수확",
            icon: "🌱",
            time: "PM 14:00",
            crop: "상추",
            details: "수분 조절 필요",
            temperature: "15℃ / 5℃",
            weather: "🌤️",
        },

];

    // 날짜 형식 변경 (ex: 19.수)
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const day = date.getDate().toString().padStart(2, "0");
        const weekday = new Intl.DateTimeFormat("ko-KR", { weekday: "short" }).format(date);
        return `${day}.${weekday}`;
    };

    // ko 설정으로 인한 '일' 제거
    const handleDayCellContent = (arg) => {
        return arg.dayNumberText.replace("일", "");
    };

    // 날짜 클릭 이벤트 처리
    const handleDateClick = (arg) => {
        const formattedDate = formatDate(arg.dateStr);
        setSelectedDate(formattedDate);

        // 선택한 날짜에 해당하는 이벤트 검색
        const event = diaryData.find((e) => e.date === arg.dateStr);
        setSelectedEvent(event || null);

        setTimeout(() => {
            if (eventDetailsRef.current) {
                eventDetailsRef.current.scrollIntoView({ behavior: "smooth" });
            }
        }, 100);
    };

    return (
        <div>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                locale="ko"
                fixedWeekCount={false}
                titleFormat={{ year: "numeric", month: "numeric" }}
                events={diaryData.map((event) => ({ title: event.title, date: event.date }))}
                dateClick={handleDateClick}
                dayCellContent={handleDayCellContent}
                height="auto"
                dayMaxEventRows={true}

                eventContent={(arg) => {
                    let colorClass = "";
                    if (arg.event.title === "수확") colorClass = "event-red";
                    else if (arg.event.title === "휴식") colorClass = "event-green";
                    else if (arg.event.title === "비료") colorClass = "event-yellow";

                    return (
                        <div className={`event-box ${colorClass}`}>
                            {arg.event.title}
                        </div>
                    );
                }}
                //캘린더 타이틀에 따라 색지정
            />

            {selectedDate && (
                <div ref={eventDetailsRef} className="event-details">
                    {/* 날짜 및 날씨 정보 */}
                    <div className="event-header">
                        <div className="event-header-detail">
                            <h3>{selectedDate}</h3>
                            <p className="recent-label">1일 전, 가장 최근</p>
                        </div>

                        <p className="weather-info">
                        {selectedEvent?.temperature} {selectedEvent?.weather}
                        </p>
                    </div>

                    {/* 이벤트 상세 내용 */}
                    {selectedEvent ? (
                        <div className="event-card">
                            <div className="crop_name">작물: {selectedEvent.crop}</div>
                            <p className="event-time">{selectedEvent.time}</p>
                            <div className="event-content">
                                <div className="event-description">
                                    <span className="event-icon">{selectedEvent.icon}</span>
                                    <p className="event-title">{selectedEvent.title}</p>
                                </div>

                                {/*<p className="event-crop">작물: {selectedEvent.crop}</p>*/}
                                <p className="event-details">{selectedEvent.details}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="no-event">이 날짜에는 이벤트가 없습니다.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CalendarComponent;