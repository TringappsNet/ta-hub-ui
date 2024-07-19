import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {  Button } from '@mui/material';

import 'bootstrap/dist/css/bootstrap.css';
import '../styles/Navbar.css';
import FullFeaturedCrudGrid from '../Grid/FullFeaturedCrudGrid';
import Form from './Form';
import MenuPopupState from "./MenuPopupState";
import KanDash from './KanDash';
import Sidebar from './Sidebar';
import styled from 'styled-components';
import Board from './Dnd';
import List from './List';
import Loader from  "../components/Loader";
import Candidates from "../Grid/Candidates";
const Navbar = () => {
  const [showGrid, setShowGrid] = useState(false);
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [activeNavItem, setActiveNavItem] = useState('');
  const [clientDetails, setClientDetails] = useState([]);
  const [activeComponent, setActiveComponent] = useState('board');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      // navigate("/login");
    }
  }, [navigate]);

  const openForm = (event) => {
    event.preventDefault();
    setFormKey((prevKey) => prevKey + 1);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
  };

  const handleLoadData = (navItem, endpoint) => {
    setActiveNavItem(navItem);
    setApiEndpoint(endpoint);
    setLoading(true);
    setShowGrid(false);

    setTimeout(() => {
      setShowGrid(true);
      setLoading(false);
    }, 1000);
  };

  const handleLoadCandidatesClick = () => {
    history.pushState(null, '', '/candidates'); 
    handleLoadData('candidates', 'http://localhost:8080/api/candidates/status');
  };
  
  const handleLoadClientsClick = () => {
    history.pushState(null, '', '/positions');
    handleLoadData('clients', 'http://localhost:8080/api/clients/clientPositions');
  };
  
  const handleLoadUsersClick = () => {
    history.pushState(null, '', '/users');
    handleLoadData('users', 'http://localhost:8080/api/users/');
  };
  
  const handleloadlistClients = () => {
    history.pushState(null, '', '/clients');
    handleLoadData('loadclients', 'http://localhost:8080/api/clients/');
  };
  const GridContainer = styled.div`
    display: ${showGrid ? 'block' : 'none'};
    width: 100%;
    height: 100vh;
    overflow: hidden;
  `;

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid ">
          <a className="navbar-brand" href="/navbar">tringapps</a>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a
                  className={`nav-link ${activeNavItem === 'candidates' ? 'active' : ''}`}
                  onClick={handleLoadCandidatesClick}
                >
                  Candidates
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${activeNavItem === 'clients' ? 'active' : ''}`}
                  onClick={handleLoadClientsClick}
                >
                  Positions
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${activeNavItem === 'users' ? 'active' : ''}`}
                  onClick={handleLoadUsersClick}
                >
                  Users
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={`nav-link ${activeNavItem === 'loadclients' ? 'active' : ''}`}
                  onClick={handleloadlistClients}
                >
                  Clients
                </a>
              </li>
              <li>

              <Button
            className="small-search-button1 mt-1"
            variant="contained"
            color="primary"
            onClick={openForm}
          >
                              CREATE

          </Button>
                {/* <button className="btn btn-success" onClick={openForm}>
                  CREATE
                </button> */}
              </li>
            </ul>
          </div>
          <MenuPopupState />
        </div>
      </nav>

      {loading ? (
        <Loader />
      ) : showGrid ? (
        <GridContainer>
          <FullFeaturedCrudGrid apiEndpoint={apiEndpoint} />
          
          
        </GridContainer>
      ) : (
        <>
          <Sidebar setActiveComponent={setActiveComponent} />
          <div className='kandash'>
            {activeComponent === 'board' && <Board />}
            {activeComponent === 'timeline' && <Timeline />}
            {activeComponent === 'list' && <List />}
          </div>
        </>
      )}

      {showForm && <Form key={formKey} onClose={closeForm} />}
    </div>
  );
};

export default Navbar;
