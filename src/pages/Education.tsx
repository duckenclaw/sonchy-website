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
            price: '2590 Р',
            coverImage: '/education-lecture-1.png',
            buyLink: 'https://app.lava.top/products/0ff3fc69-7d3f-41a9-903a-fde02affb962',
            images: ['/education-lecture-onion-1-new.png', '/education-lecture-onion-2.png', '/education-lecture-onion-3.png', '/education-lecture-onion-4.png']
        },
        {
            id: 2,
            description: 'Ваш любимый, но не такой уж важный сторителлинг. Разбираем, как он устроен, как работает, и учимся применять мои любимые структуры. Никаких пересказов Воглера, Макки и популярных базовых книг.',
            price: '2190 Р',
            coverImage: '/education-lecture-2.png',
            buyLink: 'https://app.lava.top/products/baabf095-5a74-4fb8-989f-682656d65e81',
            images: ['/education-lecture-storytelling-1-new.png', '/education-lecture-storytelling-2.png', '/education-lecture-storytelling-3.png']
        },
        {
            id: 3,
            description: 'Популярная тема личного бренда, но с фокусом на органику, основные принципы, а не типологии и инструкции. Хорошо подходит, если хотите начать блог и считаете, что нужно как-то по-особому изменить свою личность. (спойлер: нет)',
            price: '1990 Р',
            coverImage: '/education-lecture-3.png',
            buyLink: 'https://app.lava.top/products/75585560-a854-4613-8b8d-d00c0318a738',
            images: ['/education-lecture-brend-1.png', '/education-lecture-brend-2.png', '/education-lecture-brend-3.png', '/education-lecture-brend-4.png']
        },
        {
            id: 4,
            description: 'Нарративные пространства - это теория позволяющая создавать как уникальные миры, так и блоги или бренд. Это альтернатива классическим методам работы через персонажа или анализ аудитории. Обычно, это первое что я преподаю для креативщиков.',
            price: '2190 Р',
            coverImage: '/education-lecture-4.png',
            buyLink: 'https://app.lava.top/products/e7030821-75b1-43db-9f38-33e968a301c9',
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
