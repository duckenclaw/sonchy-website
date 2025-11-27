import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.tsx';
import LectureSlider from '../components/LectureSlider.tsx';
import LectureModal from '../components/LectureModal.tsx';
import { useBodyClass } from '../hooks/useBodyClass';
import type { LectureData } from '../types/lecture';

const Education = () => {
    const navigate = useNavigate();
    useBodyClass('consulting-page-background');

    const [selectedLecture, setSelectedLecture] = useState<LectureData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalPosition, setModalPosition] = useState(0);

    // Данные для 6 лекций
    const lectures: LectureData[] = [
        {
            id: 1,
            title: 'ЛЕКЦИЯ 1',
            description: 'Сейчас только перевожу продукты в доме, но меня научили адаптировать стиль к любому жанру текста, что помогло в работе.',
            price: '1000₽',
            images: ['image1.svg', 'image2.svg', 'image3.svg']
        },
        {
            id: 2,
            title: 'ЛЕКЦИЯ 2',
            description: 'Описание лекции 2. Здесь будет информация о содержании лекции.',
            price: '1200₽',
            images: ['image1.svg', 'image2.svg']
        },
        {
            id: 3,
            title: 'ЛЕКЦИЯ 3',
            description: 'Описание лекции 3. Здесь будет информация о содержании лекции.',
            price: '1500₽',
            images: ['image1.svg', 'image2.svg', 'image3.svg', 'image4.svg']
        },
        {
            id: 4,
            title: 'ЛЕКЦИЯ 4',
            description: 'Описание лекции 4. Здесь будет информация о содержании лекции.',
            price: '1800₽',
            images: ['image1.svg']
        },
        {
            id: 5,
            title: 'ЛЕКЦИЯ 5',
            description: 'Описание лекции 5. Здесь будет информация о содержании лекции.',
            price: '2000₽',
            images: ['image1.svg', 'image2.svg']
        },
        {
            id: 6,
            title: 'ЛЕКЦИЯ 6',
            description: 'Описание лекции 6. Здесь будет информация о содержании лекции.',
            price: '2200₽',
            images: ['image1.svg', 'image2.svg', 'image3.svg']
        }
    ];

    const handleLectureDetailsClick = (lecture: LectureData, position: number) => {
        setSelectedLecture(lecture);
        setModalPosition(position);
        setIsModalOpen(true);
    };

    const handleLectureBuyClick = (lecture: LectureData) => {
        console.log('Покупка лекции:', lecture.title);
        // Здесь будет логика покупки
    };

    const handleModalBuyClick = () => {
        if (selectedLecture) {
            console.log('Покупка из модалки:', selectedLecture.title);
            // Здесь будет логика покупки
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="app">
            <div className="header-desktop-only">
                <Header currentPage="ОБУЧЕНИЕ"/>
            </div>
            <div className="education-page">
                <div className="education-page-container">
                    <LectureSlider
                        lectures={lectures}
                        onLectureDetailsClick={handleLectureDetailsClick}
                        onLectureBuyClick={handleLectureBuyClick}
                    />
                </div>
            </div>

            <LectureModal
                lecture={selectedLecture}
                isOpen={isModalOpen}
                position={modalPosition}
                onClose={handleModalClose}
                onBuyClick={handleModalBuyClick}
            />
        </div>
    );
};

export default Education;
