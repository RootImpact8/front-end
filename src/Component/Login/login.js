import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import style from "./login.module.css";
import Logo from '../Images/Logo.png';

const Backend_server_address = "http://43.201.122.113:8081"; 

const Login = () => {
  const navigate = useNavigate(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); 

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${Backend_server_address}/api/user/login`, {
        email,
        password,
      });

      const { email: userEmail, token, message, id } = response.data;

      console.log(userEmail, token, message, id);
      
      

      console.log("로그인 성공:", message);

      localStorage.setItem("email", userEmail);
      localStorage.setItem("token", token);
      localStorage.setItem("id", id);

      navigate("/");
    } catch (error) {
      setErrorMessage("로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.");
      console.error("로그인 오류:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className={style.main_container}>
      <img src={Logo} alt="로고 이미지" className={style.Logo_img} />
      <span className={style.Login_title}>쉽게 가입하고</span>
      <span className={style.Login_sub_title}>간편하게 로그인하세요</span>
      <span className={style.Login_sub}>AI로 관리하는 내 영농일기, 싹</span>

      <div className={style.login_container}>
        <input
          type="text"
          placeholder="이메일을 입력해주세요"
          className={style.input_box}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호를 입력해주세요"
          className={style.input_box}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {errorMessage && <p className={style.error_message}>{errorMessage}</p>} {/* 🔹 에러 메시지 표시 */}

      <button className={style.login_btn} onClick={handleLogin}>
        로그인
      </button>

      <div className={style.find_container}>
        <span className={style.find_ps}>회원이 아니신가요?</span>
        <span className={style.sign_up} onClick={() => navigate("/signup")}>
          회원가입 하러가기 &gt;
        </span>
      </div>
    </div>
  );
};

export default Login;
