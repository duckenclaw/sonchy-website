import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.tsx';
import ProjectsContainer from '../components/ProjectsContainer.tsx';
import { useBodyClass } from '../hooks/useBodyClass';

const Projects = () => {
    const navigate = useNavigate();
    useBodyClass('consulting-page-background');

    return (
        <div className="app">
            <div className="header-desktop-only">
                <Header titles={["Главная", "Контакты", "Услуги"]} routes={["", "contact", "services"]} currentPage="ПРОЕКТНАЯ РАБОТА"/>
            </div>
            <div className="lectures-page">
                <div className="lectures-page-container">
                    <ProjectsContainer/>
                    <div className="projects-nav-buttons">
                        <button
                            type="button"
                            className="projects-back-button"
                            onClick={() => navigate(-1)}
                            aria-label="Go back"
                        >
                            НАЗАД
                        </button>
                        <button
                            type="button"
                            className="projects-home-button"
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

export default Projects;
