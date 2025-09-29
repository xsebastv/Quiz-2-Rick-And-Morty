import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();
  
  const tabs = [
    { path: '/characters', label: 'Personajes', icon: '👥' },
    { path: '/locations', label: 'Ubicaciones', icon: '🌍' },
    { path: '/episodes', label: 'Episodios', icon: '📺' }
  ];

  const isActive = (path) => {
    if (path === '/characters' && (location.pathname === '/' || location.pathname === '/characters')) {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <nav className="navigation">
      <div className="tab-container">
        {tabs.map(tab => (
          <Link
            key={tab.path}
            to={tab.path}
            className={`tab-button ${isActive(tab.path) ? 'active' : ''}`}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;