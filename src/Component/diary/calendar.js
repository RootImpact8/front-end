import React, { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./calendar.css";

const CalendarComponent = ({ diaryDateData }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const eventDetailsRef = useRef(null);


    console.log("selectedEvent",selectedEvent);

    console.log(selectedDate);
    console.log("캘린더 데이터", diaryDateData);


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
        console.log("클릭한 날짜:", arg.dateStr);
        console.log("전체 데이터:", diaryDateData);

        // 선택한 날짜에 해당하는 이벤트 검색
        const event = diaryDateData.find((e) => e.writeDate === arg.dateStr);
        setSelectedEvent(event || null);
        console.log("찾은 이벤트:", event);

        setTimeout(() => {
            if (eventDetailsRef.current) {
                eventDetailsRef.current.scrollIntoView({ behavior: "smooth" });
            }
        }, 100);
    };
    console.log()
    return (
        <div>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                locale="ko"
                fixedWeekCount={false}
                titleFormat={{ year: "numeric", month: "numeric" }}
                events={diaryDateData.map((event) => ({
                    title: "event.taskCategory",
                    date: event.writeDate,
                    extendedProps: {
                        icon: event.icon,
                        time: event.time,
                        crop: event.crop,
                        details: event.details,
                        temperature: event.temperature,
                        weather: event.weather
                    }
                }))}
                dateClick={handleDateClick}
                dayCellContent={handleDayCellContent}
                height="auto"
                dayMaxEventRows={true}
                eventContent={(arg) => {
                    let colorClass = "";
                    const taskCategory = arg.event.title;

                    if (taskCategory === "수확") colorClass = "event-red";
                    else if (taskCategory === "휴식") colorClass = "event-blue";
                    else if (taskCategory === "준비") colorClass = "event-green";
                    else if (taskCategory === "생육") colorClass = "event-yellow";

                    return (
                        <div className={`event-box ${colorClass}`}></div>

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
                            <div className="crop_name">작물: {selectedEvent.cropName}</div>
                            <p className="event-time">{selectedEvent.time}</p>
                            <div className="event-content">
                                <div className="event-description">
                                    {/*<span className="event-icon">{selectedEvent.extendedProps.icon}</span>*/}
                                    <p className="event-title">{selectedEvent.taskName}</p>
                                </div>

                                {/*<p className="event-crop">작물: {selectedEvent.crop}</p>*/}
                                <p className="event-details">{selectedEvent.content}</p>
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
