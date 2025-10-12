import { useNavigate } from 'react-router-dom';

const LecturesContainer = () => {
    const navigate = useNavigate();

    const handleContact = () => {
        navigate('/contact');
    };

    return (
        <div className="lectures-wrapper">
            <div className="lectures-container">
                <div className="lectures-images-container">
                    <img
                        src="/lectures-outline.png"
                        alt="Lectures character"
                        className="lectures-image"
                    />
                    <img
                        src="/logos.png"
                        alt="Company logos"
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
    );
};

export default LecturesContainer;