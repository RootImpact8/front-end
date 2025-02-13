


import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Main from "./Component/Home/Home";
import Diary from "./Component/diary/diary";
import Info from "./Component/info/info";
import InfoNext1 from "./Component/info/info_next1";
import InfoNext2 from "./Component/info/info_next2";

import Login from "./Component/Login/login";
import SignUp from "./Component/Login/SignUp";

import Detail from "./Component/Home/Detail";
import Footer from "./Component/Home/footer";
import Test from './Component/Home/test';
import Address from './Component/Home/address';

import CropSelectionPage from "./Component/diary/cropSelectionPage";
import ActivitySelection from "./Component/diary/activitySelection";
import Details from "./Component/diary/Details";
import Diary_crops from "./Component/diary_crops/diary_crops";
import NewDiary from "./Component/diary/newDiary";

import MyChoice from './Component/info/myChoice';
import InterestCrops from './Component/info/InterestCrops';

import Test2 from './Component/Home/test2';




function App() {
  return (
      <Router>
        <AppContent />
      </Router>
  );
}

function AppContent() {
  const location = useLocation();

  // Footer를 표시할 경로 목록
  const showFooterPages = ["/", "/diary",  "/Detail", "/info"];

  return (
      <div style={{ backgroundColor: "#F0F0F0", minHeight: "100vh" }}>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/diary" element={<Diary />} />
          <Route path="/info" element={<Info />} />
          <Route path="/InfoNext1" element={<InfoNext1 />} />
          <Route path="/InfoNext2" element={<InfoNext2 />} />
          <Route path="/details/:date" element={<Details />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/Detail" element={<Detail />} />
          <Route path="/diary/crops" element={<Diary_crops />} />
          <Route path="/diary/newDiary" element={<NewDiary />} />
          <Route path="/diary/crop-selection" element={<CropSelectionPage />} />
          <Route path="/diary/activity-selection" element={<ActivitySelection />} />
          <Route path="/address" element={<Address />} />
          <Route path="/Test" element={<Test />} />
          <Route path="/MyChoice" element={<MyChoice />} />
          <Route path="/InterestCrops" element={<InterestCrops />} />
          <Route path="/Test2" element={<Test2 />} />
        </Routes>


        {showFooterPages.includes(location.pathname) && <Footer />}
      </div>
  );
}

export default App;