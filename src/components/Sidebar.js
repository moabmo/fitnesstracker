// src/components/Sidebar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiHome, FiUser, FiLogOut, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const SidebarContainer = styled.div`
  width: ${(props) => (props.isCollapsed ? '80px' : '250px')};
  height: 100vh;
  background: #1d1f21;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  position: fixed;
  top: 0;
  left: 0;
  transition: width 0.3s;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  margin-bottom: 20px;

  &:hover {
    color: #007bff;
  }
`;

const SidebarItem = styled(Link)`
  text-decoration: none;
  color: #fff;
  font-size: ${(props) => (props.isCollapsed ? '24px' : '18px')};
  margin: 20px 0;
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.isCollapsed ? 'center' : 'flex-start')};
  width: 100%;

  &:hover {
    color: #007bff;
  }

  svg {
    margin-right: ${(props) => (props.isCollapsed ? '0' : '10px')};
  }
`;

const Sidebar = ({ onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <SidebarContainer isCollapsed={isCollapsed}>
      <ToggleButton onClick={toggleSidebar}>
        {isCollapsed ? <FiChevronRight size={24} /> : <FiChevronLeft size={24} />}
      </ToggleButton>
      <SidebarItem to="/dashboard" isCollapsed={isCollapsed}>
        <FiHome size={24} />
        {!isCollapsed && 'Dashboard'}
      </SidebarItem>
      <SidebarItem to="/profile" isCollapsed={isCollapsed}>
        <FiUser size={24} />
        {!isCollapsed && 'Profile'}
      </SidebarItem>
      <SidebarItem as="div" onClick={onLogout} isCollapsed={isCollapsed}>
        <FiLogOut size={24} />
        {!isCollapsed && 'Logout'}
      </SidebarItem>
    </SidebarContainer>
  );
};

export default Sidebar;
