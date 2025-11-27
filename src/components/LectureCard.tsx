interface LectureCardProps {
    id: number;
    title: string;
    description: string;
    price: string;
    images: string[];
    position: number; // 0, 1, 2, или 3
    onDetailsClick: () => void;
    onBuyClick: () => void;
}

const LectureCard = ({
    title,
    position,
    onDetailsClick,
    onBuyClick
}: LectureCardProps) => {
    const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Проверяем, что клик не был на кнопке "КУПИТЬ"
        const target = e.target as HTMLElement;
        if (!target.closest('.lecture-buy-button')) {
            onDetailsClick();
        }
    };

    return (
        <div className="lecture-card" onClick={handleCardClick}>
            {/* Белая рамка с картинкой внутри */}
            <div className="lecture-card-frame">
                <div className="lecture-card-image-placeholder"></div>
            </div>

            {/* Название снаружи белого блока */}
            <h3 className="lecture-card-title">{title}</h3>

            {/* Кнопка */}
            <button
                type="button"
                className="lecture-buy-button"
                onClick={(e) => {
                    e.stopPropagation();
                    onBuyClick();
                }}
            >
                КУПИТЬ
            </button>
        </div>
    );
};

export default LectureCard;
