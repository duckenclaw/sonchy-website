import {useEffect} from "react";


const Courses = () => {

    // Apply consulting-specific background styling
    useEffect(() => {
        document.body.classList.add('courses-page-background');

        // Cleanup function to remove the class when component unmounts
        return () => {
            document.body.classList.remove('courses-page-background');
        };
    }, []);

    return (
        <div className="app" style={{ overflow: 'auto', height: '100%' }}>

            <header className="courses-header">
                <div className="courses-header-text">
                    <h2>КУРС!</h2>
                    <h1>ТВОРЧЕСТВО БЕЗ ТРАВМЫ</h1>
                    <h2>неужели я могу<br/>быть креатором?</h2>
                </div>
            </header>

            <div className="courses-container">

                <div className="motivation-container">
                    <p className="align-left">
                        Как будто есть творческая искра, но чего-то не хватает?
                    </p>
                    <p className="align-left">
                        Сĸорее всего уверенности в себе, но этого я дать не могу.
                    </p>
                    <p className="align-right">
                        Зато могу обучить техникам, структуризировать процесс
                    </p>
                    <p className="align-right">
                        и, может быть, вдохновить.
                    </p>
                </div>

                <div className="story-container">

                    <div className="sonchy-tv">
                        <img src="/sonchy-tv.png" alt="sonchy-tv"/>
                    </div>

                    <div className="story-text">
                        <section>
                            <p>
                                Меня бесит идея, что творчество должно идти из страдания, а креативность идёт в паре с ментальным заболеванием. На этой ненависти я и сделала этот курс, пытаясь доказать, что креативность — это ремесло.
                            </p>
                            <p className="align-right">
                                Помимо моего опыта и методик, я своровала в этот курс: абстрактную поэзию, Оксфордский курс по creative writing, аккуратные психологические приблуды, актёрские методы.
                                Всё это вызывает эмоцию: “О! Я могу и это!”
                            </p>
                        </section>
                    </div>

            </div>

                <div className="points-container">

                    <div className="no-words-container">
                        <h3>в этом курсе<br/>нет слов: </h3>
                        <ul>
                            <li>вдохновение</li>
                            <li>дисциплина</li>
                            <li>ресурс</li>
                            <li>муза</li>
                            <li>проявленность</li>
                            <li>алгоритмы</li>
                            <li>талант</li>
                            <li>гений</li>
                            <li>поток</li>
                        </ul>
                    </div>

                    <div className="yes-words-container">
                        <h3>зато<br/>есть слова:</h3>
                        <ul>
                            <li>референсы</li>
                            <li>анализ</li>
                            <li>поструктуруализм</li>
                            <li>нарратив</li>
                            <li>аутентичность</li>
                            <li>структура</li>
                            <li>типология</li>
                            <li>сеттинг</li>
                        </ul>
                    </div>

                </div>

                <div className="formats-container">

                    <div className="base">
                        <h3>Базёныш</h3>
                        <ul>
                            <li>7 лекций по 1,5 часа без семинаров!</li>
                            <li>ответы на вопросы</li>
                            <li>материалы, задания (без проверки)</li>
                        </ul>
                        <button type="button" className="base-button">КУПИТЬ ЗА <span>8900 р.</span></button>
                    </div>

                    <div className="starling">
                        <h3>Звёздочка</h3>
                        <ul>
                            <li>7 лекций по 1,5 часа</li>
                            <li>6 практических семинаров</li>
                            <li>группа из 10 человек</li>
                            <li>отдельный чат</li>
                            <li>проверка и обсуждение заданий</li>
                        </ul>
                        <button type="button" className="starling-button">КУПИТЬ ЗА <span>21900 р.</span></button>
                    </div>

                    <div className="supernova">

                        <h3>Супернова</h3>

                        <ul>

                            <li>7 лекций</li>
                            <li>6 практических семинаров</li>
                            <li>2 индивидуальные сессии</li>
                            <li>ответы в чате</li>
                            <li>работа с личным запросом</li>
                            <li>подборка материалов</li>

                        </ul>
                        <button
                            type="button"
                            className="supernova-button"
                        >
                            КУПИТЬ ЗА <span>34900 р.</span>
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Courses;
