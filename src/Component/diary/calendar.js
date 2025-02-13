import React, { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./calendar.css";

const CalendarComponent = ({ diaryDateData }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const eventDetailsRef = useRef(null);

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

        // 선택한 날짜의 첫 번째 이벤트를 기준점으로 설정
        const event = diaryDateData.find((e) => e.writeDate === arg.dateStr);
        setSelectedEvent(event || null);
        console.log("찾은 이벤트:", event);

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
                events={diaryDateData.map((event) => ({
                    title: event.taskCategory,
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
                dayMaxEventRows={true}
                dayMaxEvents={2}
                dateClick={handleDateClick}
                dayCellContent={handleDayCellContent}
                height="auto"
                eventContent={(arg) => {
                    let colorClass = "";
                    const taskCategory = arg.event.title;

                    if (taskCategory === "수확") colorClass = "event-red";
                    else if (taskCategory === "휴식") colorClass = "event-blue";
                    else if (taskCategory === "준비") colorClass = "event-green";
                    else if (taskCategory === "생육") colorClass = "event-yellow";

                    return (
                        <div className={`event-box ${colorClass}`}>{taskCategory}</div>
                    );
                }}
            />

            {selectedDate && (
                <div ref={eventDetailsRef} className="event-details">
                    {/* 날짜 헤더 */}
                    <div className="event-header">
                        <div className="event-header-detail">
                            <h3>{selectedDate}</h3>
                            <p className="recent-label">1일 전, 가장 최근</p>
                        </div>
                    </div>

                    {/* 해당 날짜의 모든 이벤트 표시 */}
                    {diaryDateData.filter(event => event.writeDate === selectedEvent?.writeDate).length > 0 ? (
                        diaryDateData
                            .filter(event => event.writeDate === selectedEvent?.writeDate)
                            .map((event, index) => (
                                <div key={index} className="event-card">

                                    <div className="crop_name">작물: {event.cropName}</div>
                                    <div>
                                        <p className="event-time">{event.time}</p>
                                        <div className="event-content">
                                            <div className="event-description">
                                                <p className="event-title">{event.taskName}</p>
                                            </div>
                                            <p className="event-details">{event.content}</p>
                                        </div>
                                    </div>

                                </div>
                            ))
                    ) : (
                        <p className="no-event">이 날짜에는 이벤트가 없습니다.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CalendarComponent;
