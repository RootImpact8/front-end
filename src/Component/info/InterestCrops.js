import React, { useState, useEffect } from 'react';
import axios from 'axios';
import style from './myChoice.module.css'; // 동일한 스타일 시트 사용
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaSearch } from 'react-icons/fa';

const InterestCrops = () => {
  const navigate = useNavigate();
  const [crops, setCrops] = useState([]);
  const [selectedCrops, setSelectedCrops] = useState([]); // 선택된 작물의 이름을 배열로 저장
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCrops = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get('http://43.201.122.113:8081/api/user-info/crops', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCrops(response.data); // 서버에서 받은 작물 데이터 설정
        console.log(response.data);

      } catch (error) {
        console.error('Failed to fetch crops:', error);
      }
    };
    fetchCrops();
  }, []);

  const handleCropSelection = (crop) => {
    const newSelectedCrops = new Set(selectedCrops);
    if (newSelectedCrops.has(crop.name)) {
      newSelectedCrops.delete(crop.name);
    } else {
      newSelectedCrops.add(crop.name);
    }
    setSelectedCrops(Array.from(newSelectedCrops));
  };

  const onChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredCrops = crops.filter(crop =>
    crop.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const url = 'http://43.201.122.113:8081/api/user-info/crops';
    const body = {
      userId: userId,
      interestCrops: selectedCrops
    };
    try {
      console.log(selectedCrops);

      await axios.post(url, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('관심 작물 등록 실패:', error);
    }
  };

  return (
    <div className={style.cropSelectionPage}>
      <header className={style.cropSelectDiaryTitle}>
        <FaChevronLeft className={style.cropSelectDiaryTitleIcon} onClick={() => navigate(-1)}/>
        <p className={style.cropSelectDiaryTitleText}>관심 작물 선택</p>
      </header>

      <p className={style.cropSelectTitleText}><strong>어떤 작물</strong>을 관리할까요?</p>

      <div className={style.searchInputbox}>
        <div className={style.searchInputWrapper}>
          <FaSearch className={style.searchIcon}/>
          <input
            type="text"
            value={search}
            onChange={onChange}
            placeholder="작물 이름으로 검색 예)딸기"
            className={style.searchInput}
          />
        </div>
      </div>

      <p className={style.mycropsListText}>추천작물 TOP 6</p>
      <div className={style.cropList}>
        {filteredCrops.length === 0 ? (
          <p>검색 결과가 없습니다.</p>
        ) : (
          filteredCrops.map((crop) => (
            <div key={crop.id} onClick={() => handleCropSelection(crop)} className={style.cropItem}>
              <img src={require(`../Images/${crop.id}.png`)} alt={crop.name} className={style.cropImage} />
              <p className={style.cropName}>{crop.name}</p>
            </div>
          ))
        )}
      </div>
      <button onClick={handleSubmit} className={style.submitButton}>작물 등록하기</button>
    </div>
  );
};

export default InterestCrops;
