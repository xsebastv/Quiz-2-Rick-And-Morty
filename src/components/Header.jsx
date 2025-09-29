import { useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();
  
  const getTabInfo = () => {
    switch (location.pathname) {
      case '/characters':
      case '/':
        return {
          title: 'Rick and Morty Characters',
          subtitle: 'Explora los personajes de la serie'
        };
      case '/locations':
        return {
          title: 'Rick and Morty Locations',
          subtitle: 'Descubre los lugares del multiverso'
        };
      case '/episodes':
        return {
          title: 'Rick and Morty Episodes',
          subtitle: 'Revive los episodios de la serie'
        };
      default:
        return {
          title: 'Rick and Morty API',
          subtitle: 'Explora el universo de Rick and Morty'
        };
    }
  };

  const { title, subtitle } = getTabInfo();

  return (
    <header className="header">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </header>
  );
};

export default Header;