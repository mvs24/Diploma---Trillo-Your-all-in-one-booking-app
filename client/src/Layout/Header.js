import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/logo.PNG';
import './Header.css';
import { IconContext } from 'react-icons';
import { IoIosApps, IoIosSearch, IoIosAirplane } from 'react-icons/io';
import { MdHotel } from 'react-icons/md';
import { FaMapMarkedAlt } from 'react-icons/fa';
import Button from '../shared/components/Button/Button';
import Modal from '../shared/components/UI/Modal';
import Input from '../shared/components/Input/Input';
// import LoadingSpinner from '../shared/components/UI/LoadingSpinner';

const Header = () => {
  const [openLogin, setOpenLogin] = useState(false);
  const [openSignup, setOpenSignup] = useState(false);

  const openLoginModal = () => {
    setOpenLogin(true);
  };

  const openSignupModal = () => {
    setOpenSignup(true);
  };

  const categories = [
    {
      cmp: <IoIosAirplane />,
      category: 'Flights',
      link: '/categories/flights'
    },
    { cmp: <FaMapMarkedAlt />, category: 'Tours', link: '/categories/tours' },
    { cmp: <MdHotel />, category: 'Hotels', link: '/categories/hotels' }
  ];

  const categoriesToRender = categories.map(el => (
    <Link key={el.link} to={el.link} className="hidden__element">
      <IconContext.Provider value={{ className: 'icon' }}>
        {el.cmp}
        <span className="flights">{el.category}</span>
      </IconContext.Provider>
    </Link>
  ));

  return (
    <React.Fragment>
      {openLogin && (
        <Modal
          onCancel={() => setOpenLogin(false)}
          header={'Log In'}
          footer={<Button type="success">Log In</Button>}
          show
          headerClass="red"
        >
          <Input type="text" placeholder="Email" onChange={() => {}} />
          <Input type="password" placeholder="Password" onChange={() => {}} />
        </Modal>
      )}
      {openSignup && <Modal show></Modal>}
      <header className="header">
        <img className="logo" src={Logo} alt="Logo" />
        <h2 className="heading-2">Trillo</h2>
        <div className="all">
          <div className="show">
            <IconContext.Provider value={{ className: 'icon' }}>
              <IoIosApps />
              <span className="categories">Categories</span>
            </IconContext.Provider>
          </div>

          <div className="hidden__elements">{categoriesToRender}</div>
        </div>

        <form className="searchForm">
          <input type="text" className="search" placeholder="Search anything" />
          <IconContext.Provider value={{ className: 'icon search__icon' }}>
            <IoIosSearch />
          </IconContext.Provider>
        </form>
        <span className="impact">Make an impact</span>
        <Button type="success" clicked={openLoginModal}>
          Log In
        </Button>
        <Button type="neutral" clicked={openSignupModal}>
          Sign Up
        </Button>
      </header>
    </React.Fragment>
  );
};

export default Header;
