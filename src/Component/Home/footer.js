import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import book from '../Images/Book.png';
import book_true from '../Images/Book_true.png'; // Assuming you have an active icon for the diary
import home from '../Images/home_false.png';
import home_true from '../Images/Home.png'; // Assuming you have an active icon for home
import profill from '../Images/Profill.png';

import style from './footer.module.css';

const Footer = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    return (
        <footer className={style.footer_container}>
            <div onClick={() => navigate('/diary')}> 
                <img src={pathname === '/diary' ? book_true : book} alt='Book Icon' />
                <span>영농일지</span>
            </div>
            <div onClick={() => navigate('/Home')}> 
                <img src={pathname === '/Home' ? home_true : home} alt='Home Icon' />
                <span>홈</span>
            </div>
            <div onClick={() => navigate('/info')}> 
                <img src={profill}/>
                <span>내 정보</span>
            </div>
        </footer>
    );
};

export default Footer;
