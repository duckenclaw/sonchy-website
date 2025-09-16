import { useNavigate } from 'react-router-dom';

interface ConsultingBlockProps {
  image: string;
  title: string;
  bonuses: string[];
  description: string;
  price: string;
  alt?: string;
}

const ConsultingBlock = ({ image, title, bonuses, description, price, alt = "" }: ConsultingBlockProps) => {
  const navigate = useNavigate();

  const handleContact = () => {
    navigate('/contact');
  };

  return (
    <div className="consulting-block">
      <img src={image} alt={alt} className="consulting-image" />
      <div className="consulting-content">

        <div className="consulting-title-container">
          <h2 
            className="consulting-title primary-text"
            style={{
              backgroundImage: "url('/title-bg-consulting.svg')"
            }}
          >
            {title}
          </h2>
        </div>

        <div className="consulting-details">
          <div className="consulting-info">
            <ul className="consulting-bonuses">
              {bonuses.map((bonus, index) => (
                <li key={index} className="bonus-item">
                  <img src="/list-decoration.svg" alt="decoration" className="list-decoration" />
                  <span className="bonus-text secondary-text">{bonus}</span>
                </li>
              ))}
            </ul>
            
            <p className="consulting-description secondary-text">
              {description}
            </p>
          </div>


          <div className="consulting-price-container">
            <div className="consulting-price">
              <span className="price-text secondary-text">{price}</span>
            </div>
          </div>
        </div>

        <button 
          className="consulting-contact-button"
          onClick={handleContact}
          style={{
            backgroundImage: "url('/contact-bg.svg')"
          }}
        >
          СВЯЗАТЬСЯ
        </button>
      </div>
    </div>
  );
};

export default ConsultingBlock;
