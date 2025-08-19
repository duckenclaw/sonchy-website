import { useNavigate, useParams } from 'react-router-dom';

const BlankPage = () => {
  const navigate = useNavigate();
  const { section } = useParams();

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="blank-page">
      <div className="blank-page-content">
        <h1 className="primary-text">
          {section ? section.toUpperCase() : 'СТРАНИЦА'}
        </h1>
        <p className="secondary-text">
          Эта страница пока что пуста, но скоро здесь будет интересный контент!
        </p>
        <button onClick={handleGoBack} className="back-button">
          Вернуться на главную
        </button>
      </div>
    </div>
  );
};

export default BlankPage;
