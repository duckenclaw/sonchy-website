import { useNavigate } from 'react-router-dom';

const ProjectsContainer = () => {
    const navigate = useNavigate();

    const handleContact = () => {
        navigate('/contact');
    };

    return (
        <div className="lectures-wrapper">
            <div className="lectures-container">
                <img
                    src="/projects-outline.png"
                    alt="Projects character"
                    className="projects-image"
                />
                <div className="lectures-content">
                    <div className="speech-bubble bottom">
                        Пишу сценарии, создаю концепты, перфоманс-маркетинг и продюсирую.
                    </div>
                    <div className="speech-bubble bottom">
                        Делаю в целом всё, что связано со сторителлингом и креативом.
                    </div>
                    <div className="speech-bubble">
                        Всегда открыта к новым форматам, и понимаю, что важна не только эффектность, но и результат.
                    </div>

                    <div className="speech-bubble">
                        Также, у меня большая база аутсорса для проектов.
                    </div>

                    <div className="bottom-section">
                        <button onClick={handleContact} className="portfolio-button">
                            ПОРТФОЛИО
                        </button>
                        <button onClick={handleContact} className="contact-button">
                            СВЯЗАТЬСЯ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectsContainer;