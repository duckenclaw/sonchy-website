import {useEffect} from "react";
import Slider from "../components/Slider.tsx";


const Courses = () => {

    const slides = [
        {
            header: "1. Творцов нет, только креаторы:",
            description: "Cтереотипы, которые вредят профессии.",
            image: "/theme0.png",
            points: [
                "чем креатор отличается от творца?",
                "как устроена креативная экономика?",
                "можно ли натренировать креативность?"
            ]
        },
        {
            header: "2. Как продать вселенную:",
            description: "Ипотека волшебных мест и медиа пространств.",
            image: "/theme1.png",
            points: [
                "как создавать миры и продавать их?",
                "как увидеть нарративное пространство?",
                "как маленькая метафора превращается в реалистичный мир?"
            ]
        },
        {
            header: "3. Люди такие пешки:",
            description: "Инструменты создания персонажей, аналитика аудитории и набор маленького манипулятора",
            image: "/theme2.png",
            points: [
                "как найти грань между личностью и персонажем?",
                "что действительно нужно знать об аудитории?",
                "что мы все на самом деле хотим и как это обернуть в свою пользу?"
            ]
        },
        {
            header: "4. Сюжетный поворот не туда:",
            description: "Изучаем всё, что делает сюжет захватывающим. От структуры до байтов.",
            image: "/theme3.png",
            points: [
                "как вызывать большие эмоции небольшими деталями?",
                "от каких историй невозможно оторваться?",
                "как меняется сториттелинг и сценариста?"
            ]
        },
        {
            header: "5. Грязно символически:",
            description: "Анатомия метафор и символов, и как найти в них смысл , даже если его нет.",
            image: "/theme4.png",
            points: [
                "что создаёт вторые смыслы?",
                "как работает метафорическое мышление у человека?",
                "как грамотно нагрузить отсылками и символами?"
            ]
        },
        {
            header: "6. Перестать быть душнилой:",
            description: "как работать с информацией так, чтобы было интересно не только тебе?",
            image: "/theme5.png",
            points: [
                "где найти актуальные и интересные источники?",
                "как вызывать интерес к самой банальной теме?",
                "как устроен жанр нонфикшна и как он продолжает равиватся в видео, контенте и тд?"
            ]
        },
        {
            header: "7. Берём и делаем:",
            description: "СЕКРЕТНАЯ ЛЕКЦИЯ!",
            image: "/theme6.png",
            points: [
                "что это за лекция?",
                "почему она секретная?",
                "и почему мне так интересно?"
            ]
        }
    ]

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

                <Slider slides={slides}></Slider>

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

                <div className="seminars">
                    <div className="seminars-text">
                        <h3>А что на семинарах?</h3>
                        <p>Честно говоря, я все это затеяла ради самих семинаров.</p>
                        <p>По выходным мы будем обсуждать креативные задачки, обсуждать ваши проекты, рассматривать как справились с заданиями. Это всегда очень очень поддерживающая и интересная атмосфера, по которой
                            я скучаю и как лектор, и как студентка.</p>
                        <p className="align-right">Я подготовила этюды и упражнения на каждую тему, но оставила фокус на том, чтобы за эти полторы недели вы узнали о себе чуть больше.</p>
                        <p>ну и конечно, у меня есть коллекция прекрасной чуши, на которой забавно тренироваться</p>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default Courses;
