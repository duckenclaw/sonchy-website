import { useNavigate } from 'react-router-dom';
import ContentBackgroundSVG from './ContentBackgroundSVG';

const LecturesContainer = () => {
    const navigate = useNavigate();

    const handleContact = () => {
        navigate('/contact');
    };

    return (
        <>
            {/* DESKTOP VERSION - Original structure */}
            <div className="lectures-wrapper lectures-desktop">
                <div className="lectures-container">
                    <div className="lectures-images-container">
                        <img
                            src="/lectures-outline.png"
                            alt="Decorative character illustration for lectures section"
                            className="lectures-image"
                        />
                        <img
                            src="/logos.png"
                            alt="Logos of companies including Yandex, TEDX, and British School of Design"
                            className="logos"
                        />
                    </div>
                    <div className="lectures-content">
                        <div className="speech-bubble">
                            Нужно подтянуть креатив в команде?
                        </div>
                        <div className="speech-bubble">
                            Или дать ей возможность взглянуть на работу под другим углом?
                        </div>
                        <div className="speech-bubble bottom">
                            Провожу лекции и воркшопы для театральных фестивалей,
                            TEDX, Яндекса, Британской школы Дизайна и другим.
                        </div>
                        <div className="speech-bubble bottom">
                            Материал подбираем в зависимости от запроса и времени.
                        </div>
                        <div className="speech-bubble bottom">
                            Можем экспериментировать с форматом!
                        </div>
                        <div className="bottom-section">
                            <div className="price">от 450$</div>
                            <button onClick={handleContact} className="contact-button">
                                СВЯЗАТЬСЯ
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MOBILE VERSION - New structure */}
            <div className="lectures-wrapper lectures-mobile">
                {/* Mobile: Title */}
                <div className="lectures-mobile-title">
                    ЛЕКЦИИ/<br/>ВОРКШОПЫ
                </div>

                <img
                    src="/lectures-outline.png"
                    alt="Decorative character illustration for lectures section"
                    className="lectures-mobile-character"
                />

                <ContentBackgroundSVG />

                <div className="lectures-content-inner">
                    <div className="lectures-content">
                        <div className="speech-bubble">
                            Нужно подтянуть креатив в команде?
                        </div>
                        <div className="speech-bubble">
                            Или дать ей возможность взглянуть на работу под другим углом?
                        </div>
                        <div className="speech-bubble bottom">
                            Провожу лекции и воркшопы для театральных фестивалей,
                            TEDX, Яндекса, Британской школы Дизайна и другим.
                        </div>

                        <img
                            src="/logos-mobile.png"
                            alt="Logos of companies including Yandex, TEDX, and British School of Design"
                            className="logos-mobile"
                        />

                        <div className="speech-bubble bottom">
                            Материал подбираем в зависимости от запроса и времени.
                        </div>
                        <div className="speech-bubble bottom">
                            Можем экспериментировать с форматом!
                        </div>

                        <div className="bottom-section">
                            <div className="price">от 450$</div>
                            <button onClick={handleContact} className="contact-button">
                                СВЯЗАТЬСЯ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LecturesContainer;