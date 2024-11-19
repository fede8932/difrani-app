import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import SearchUsersComponent from '../components/searchUsers/SearchUsersComponent';

function SearchUsersContainer(props) {
  return <SearchUsersComponent />;
}

export default SearchUsersContainer;
