import { useEffect } from 'react';
import Header from '../components/Header.tsx';
import ProjectsContainer from '../components/ProjectsContainer.tsx';

const Lectures = () => {
    useEffect(() => {
        document.body.classList.add('consulting-page-background');

        // Cleanup function to remove the class when component unmounts
        return () => {
            document.body.classList.remove('consulting-page-background');
        };
    }, []);

    return (
        <div className="app">
            <Header titles={["Главная", "Контакты", "Услуги"]} routes={["", "contact", "services"]} currentPage="ЛЕКЦИИ/ВОРКШОПЫ"/>
            <div className="lectures-page">
                <ProjectsContainer/>
            </div>
        </div>
    );
};

export default Lectures;
