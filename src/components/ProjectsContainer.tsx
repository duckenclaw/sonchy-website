import { useNavigate } from 'react-router-dom';
import ContentBackgroundSVG from './ContentBackgroundSVG';

const ProjectsContainer = () => {
    const navigate = useNavigate();

    const handleContact = () => {
        navigate('/contact');
    };

    return (
        <>
            {/* DESKTOP VERSION - Original structure */}
            <div className="lectures-wrapper projects-desktop">
                <div className="lectures-container">
                    <img
                        src="/projects-outline.png"
                        alt="Decorative character illustration for projects section"
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

            {/* MOBILE VERSION - New structure */}
            <div className="lectures-wrapper projects-mobile">
                {/* Mobile: Title */}
                <div className="projects-mobile-title">
                    ПРОЕКТНАЯ<br/>РАБОТА
                </div>

                {/* Mobile: Character image above the block */}
                <img
                    src="/projects-outline.png"
                    alt="Decorative character illustration for projects section"
                    className="projects-mobile-character"
                />

                {/* Mobile: SVG background */}
                <ContentBackgroundSVG />

                <div className="lectures-content-inner">
                    <div className="lectures-content">
                        <div className="speech-bubble">
                            Пишу сценарии, создаю концепты, перфоманс-маркетинг и продюсирую.
                        </div>
                        <div className="speech-bubble">
                            Делаю в целом всё, что связано со сторителлингом и креативом.
                        </div>
                        <div className="speech-bubble">
                            Всегда открыта к новым форматам, и понимаю, что важна не только эффектность, но и результат.
                        </div>
                        <div className="speech-bubble">
                            Также, у меня большая база аутсорса для проектов.
                        </div>

                        <div className="bottom-section">
                            <button onClick={handleContact} className="contact-button">
                                СВЯЗАТЬСЯ
                            </button>
                            <button onClick={handleContact} className="portfolio-button portfolio-button-mobile">
                                ПОРТФОЛИО
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProjectsContainer;