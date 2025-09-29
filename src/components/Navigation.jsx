import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const tabs = [
  { path: '/characters', label: 'Personajes', icon: '👥', color: 'var(--rick-green)' },
  { path: '/locations', label: 'Ubicaciones', icon: '🌍', color: 'var(--portal-blue)' },
  { path: '/episodes', label: 'Episodios', icon: '📺', color: 'var(--morty-yellow)' }
];

const Navigation = () => {
  const location = useLocation();
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const navRef = useRef(null);

  const isActive = useCallback((path) => {
    if (path === '/characters' && (location.pathname === '/' || location.pathname.startsWith('/characters'))) {
      return true;
    }
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  useEffect(() => {
    const activeTabElement = navRef.current?.querySelector('.tab-button.active');
    if (activeTabElement) {
      const activeTabData = tabs.find(tab => isActive(tab.path));
      setIndicatorStyle({
        left: `${activeTabElement.offsetLeft}px`,
        width: `${activeTabElement.offsetWidth}px`,
        backgroundColor: activeTabData?.color || 'var(--rick-green)',
      });
    }
  }, [location.pathname, isActive]);

  return (
    <nav className="navigation">
      <div className="tab-container" ref={navRef}>
        {tabs.map(tab => (
          <Link
            key={tab.path}
            to={tab.path}
            className={`tab-button ${isActive(tab.path) ? 'active' : ''}`}
            style={{ '--active-color': tab.color }}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </Link>
        ))}
        <div className="active-indicator" style={indicatorStyle}></div>
      </div>
    </nav>
  );
};

export default Navigation;