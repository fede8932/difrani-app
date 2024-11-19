import React from 'react';
import NavbarComponent from '../components/navbar/NavbarComponent';
import { useDispatch } from 'react-redux';
import { toggleSidebar } from '../redux/sidebar';
import { sendLogoutRequest } from '../redux/user';

function NavbarContainer() {
  const dispatch = useDispatch();
  const arrayButtons = [
    {
      text: 'Perfil',
      fn: () => {
        console.log('ok');
      },
    },
    {
      text: 'Cerrar Sesión',
      fn: () => {
        logOut();
      },
    },
  ];

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };
  const logOut = () => {
    const userId = JSON.parse(localStorage.getItem('user')).userId;
    dispatch(sendLogoutRequest(userId));
  };

  return (
    <NavbarComponent
      fnSidebar={handleToggleSidebar}
      arrayButtons={arrayButtons}
    />
  );
}

export default NavbarContainer;
