import { useState, useCallback, useMemo } from 'react';
import Header from '../components/Header.tsx';
import LectureSlider from '../components/LectureSlider.tsx';
import LectureModal from '../components/LectureModal.tsx';
import { useBodyClass } from '../hooks/useBodyClass';
import type { LectureData } from '../types/lecture';

const Education = () => {
    useBodyClass('consulting-page-background');

    const [selectedLecture, setSelectedLecture] = useState<LectureData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalPosition, setModalPosition] = useState(0);

    const lectures: LectureData[] = useMemo(() => [
        {
            id: 1,
            description: 'Авторская методика по созданию персонажей и личных брендов — луковица персонажа. Проверила её на 100+ консультациях. Сейчас ее преподают в геймдизайнерских школах, пишут о ней статьи и уже заказали написать о ней книгу.',
            price: '1990 ₽',
            coverImage: '/education-lecture-1.png',
            buyLink: 'https://payform.ru/q0aFt9g/',
            images: ['/education-lecture-onion-1.png', '/education-lecture-onion-2.png', '/education-lecture-onion-3.png', '/education-lecture-onion-4.png']
        },
        {
            id: 2,
            description: 'Ваш любимый, но не такой уж важный сторителлинг. Разбираем, как он устроен, как работает, и учимся применять мои любимые структуры. Никаких пересказов Воглера, Макки и популярных базовых книг.',
            price: '1990 ₽',
            coverImage: '/education-lecture-2.png',
            buyLink: 'https://payform.ru/4paFtcg/',
            images: ['/education-lecture-storytelling-1.png', '/education-lecture-storytelling-2.png', '/education-lecture-storytelling-3.png']
        }
    ], []);

    const handleLectureDetailsClick = useCallback((lecture: LectureData, position: number) => {
        setSelectedLecture(lecture);
        setModalPosition(position);
        setIsModalOpen(true);
    }, []);

    const handleLectureBuyClick = useCallback((lecture: LectureData) => {
        if (lecture.buyLink) {
            window.open(lecture.buyLink, '_blank');
        }
    }, []);

    const handleModalBuyClick = useCallback(() => {
        if (selectedLecture?.buyLink) {
            window.open(selectedLecture.buyLink, '_blank');
        }
    }, [selectedLecture]);

    const handleModalClose = useCallback(() => {
        setIsModalOpen(false);
    }, []);

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
