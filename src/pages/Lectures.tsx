import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.tsx';
import LecturesContainer from '../components/LecturesContainer.tsx';
import { useBodyClass } from '../hooks/useBodyClass';

const Lectures = () => {
    const navigate = useNavigate();
    useBodyClass('consulting-page-background');

    return (
        <div className="app">
            <div className="header-desktop-only">
                <Header titles={["Главная", "Контакты", "Услуги"]} routes={["", "contact", "services"]} currentPage="ЛЕКЦИИ/ВОРКШОПЫ"/>
            </div>
            <div className="lectures-page">
                <div className="lectures-page-container">
                    <LecturesContainer/>
                    <div className="lectures-nav-buttons">
                        <button
                            type="button"
                            className="lectures-back-button"
                            onClick={() => navigate(-1)}
                            aria-label="Go back"
                        >
                            НАЗАД
                        </button>
                        <button
                            type="button"
                            className="lectures-home-button"
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

export default Lectures;
