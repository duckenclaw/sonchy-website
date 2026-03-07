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
            price: '2590 ₽',
            coverImage: '/education-lecture-1.png',
            buyLink: 'https://payform.ru/bgaHn87/',
            images: ['/education-lecture-onion-1.png', '/education-lecture-onion-2.png', '/education-lecture-onion-3.png', '/education-lecture-onion-4.png']
        },
        {
            id: 2,
            description: 'Ваш любимый, но не такой уж важный сторителлинг. Разбираем, как он устроен, как работает, и учимся применять мои любимые структуры. Никаких пересказов Воглера, Макки и популярных базовых книг.',
            price: '2590 ₽',
            coverImage: '/education-lecture-2.png',
            buyLink: 'https://payform.ru/83aHn6j/',
            images: ['/education-lecture-storytelling-1.png', '/education-lecture-storytelling-2.png', '/education-lecture-storytelling-3.png']
        },
        {
            id: 3,
            description: 'Популярная тема личного бренда, но с фокусом на органику, основные принципы, а не типологии и инструкции. Хорошо подходит, если хотите начать блог и считаете, что нужно как-то по-особому изменить свою личность. (спойлер: нет)',
            price: '1990 ₽',
            coverImage: '/education-lecture-3.png',
            buyLink: 'https://payform.ru/4qaSsns/',
            images: ['/education-lecture-brend-1.png', '/education-lecture-brend-2.png', '/education-lecture-brend-3.png', '/education-lecture-brend-4.png']
        },
        {
            id: 4,
            description: 'Нарративные пространства - это теория позволяющая создавать как уникальные миры, так и блоги или бренд. Это альтернатива классическим методам работы через персонажа или анализ аудитории. Обычно, это первое что я преподаю для креативщиков.',
            price: '1990 ₽',
            coverImage: '/education-lecture-4.png',
            buyLink: 'https://payform.ru/e5aSssr/',
            images: ['/education-lecture-narrative-1.png', '/education-lecture-narrative-2.png', '/education-lecture-narrative-3.png', '/education-lecture-narrative-4.png']
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
