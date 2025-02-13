import React from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const Details = () => {
  const { date } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="bg-green-600 text-white flex items-center p-4">
        <FaArrowLeft
          size={20}
          className="cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-xl font-bold ml-4">상세 일정</h1>
      </header>

      <div className="p-6">
        <h2 className="text-xl font-bold text-green-700">{date} 일정</h2>
        <p className="mt-2 text-gray-600">이 날짜의 농업 일정 세부 정보를 추가하세요.</p>
      </div>
    </div>
  );
};

export default Details;
