import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ConsultingBlock from '../components/ConsultingBlock';
import { PageType } from '../types/pages';
import { CONSULTING_PACKAGES } from '../data/consultingData';

const Consulting = () => {
  const navigate = useNavigate();

  // Apply consulting-specific background styling
  useEffect(() => {
    document.body.classList.add('consulting-page-background');

    // Cleanup function to remove the class when component unmounts
    return () => {
      document.body.classList.remove('consulting-page-background');
    };
  }, []);

  return (
    <div className="app">
      <Header currentPage={PageType.CONSULTING}/>
      <div className="consulting-page">
        <div className="consulting-container">
          <div className="consulting-flexbox">
            {CONSULTING_PACKAGES.map((pkg) => (
              <ConsultingBlock
                key={pkg.id}
                image={pkg.image}
                title={pkg.title}
                bonuses={pkg.bonuses}
                description={pkg.description}
                price={pkg.price}
                alt={pkg.alt}
              />
            ))}
          </div>
          <div className="consulting-nav-buttons">
            <button
              type="button"
              className="consulting-back-button"
              onClick={() => navigate(-1)}
              aria-label="Go back"
            >
              НАЗАД
            </button>
            <button
              type="button"
              className="consulting-home-button"
              onClick={() => navigate('/')}
              aria-label="Return to main page"
            >
              НА ГЛАВНУЮ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Consulting;
