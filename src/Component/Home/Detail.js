import React, { Component } from "react";
import style from "./Detail.module.css";

import heart from "../Images/heart.png";
import heart_true from "../Images/heart_true.png";
import sns from "../Images/sns.png";
import back from "../Images/BackBtn.png";
import crop from "../Images/crop.png";
import Footer from "../Home/footer";

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHeartClicked: false, // 초기 하트 클릭 상태는 false (기본 하트 이미지)
    };
  }

  toggleHeart = () => {
    this.setState((prevState) => ({
      isHeartClicked: !prevState.isHeartClicked, // 상태 토글
    }));
  };

  handleGoBack = () => {
    window.history.back();
  };
  
  render() {
    const { isHeartClicked } = this.state;
    return (
      <div className={style.detial_container}>
        <div className={style.detail_header_container}>
          <header className={style.header}>
            <img src={back} alt="Back" className={style.icon} onClick={this.handleGoBack}/>
            <div className={style.iconsRight}>
              <img
                src={isHeartClicked ? heart_true : heart} // 조건부 렌더링
                alt="Heart"
                className={style.icon}
                onClick={this.toggleHeart} // 클릭 이벤트 핸들러 연결
              />
              <img src={sns} alt="Share" className={style.icon} />
            </div>
          </header>
          <img src={crop} alt="딸기 이미지" className={style.crop_img} />
        </div>
        <main>
          <div className={style.detail_container}>
            <div className={style.detail_header}>
              <div className={style.user_info}>신승아 님의 작물</div>
              <div className={style.left}>
                <span className={style.left_1}>딸기 냉해</span>
                <span>대비법</span>
              </div>
            </div>
            <div className={style.right}>폭설 경보 발생</div>
          </div>
          <div className={style.text_1}>
            충남 공주 지역에 예상치 못한 폭설이 내릴 것으로 예상됩니다. 딸기는
            저온과 적설에 취약하므로 즉각적인 대비가 필요합니다. 하우스 붕괴
            방지, 제설 작업, 내부 온도 관리 세 가지 측면에서 실질적인 대응책을
            마련해야 합니다.
          </div>
          <div className={style.text_title_1}>
            첫째, 하우스 붕괴를 예방해야 합니다.
          </div>
          <div className={style.text_sub_1}>
            하우스 지붕 위에 눈이 5CM 이상 쌓이면 붕괴 위험이 커집니다. 이를
            방지하기 위해 온풍기를 가동하여 내부 온도를 5 ~ 7C로 유지하면 지붕의
            눈이 녹아 흘러내립니다. 또한, 내부 열 손실을 막기 위해 이중 비닐을
            활용하고, 구조가 약한 하우스는 4m 간격으로 지지대를 추가해 무게를
            분산해야 합니다.
          </div>
          <div className={style.text_title_1}>
            둘째, 하우스 붕괴를 예방해야 합니다.
          </div>
          <div className={style.text_sub_1}>
            하우스 지붕 위에 눈이 5CM 이상 쌓이면 붕괴 위험이 커집니다. 이를
            방지하기 위해 온풍기를 가동하여 내부 온도를 5 ~ 7C로 유지하면 지붕의
            눈이 녹아 흘러내립니다. 또한, 내부 열 손실을 막기 위해 이중 비닐을
            활용하고, 구조가 약한 하우스는 4m 간격으로 지지대를 추가해 무게를
            분산해야 합니다.
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}

export default Detail;
