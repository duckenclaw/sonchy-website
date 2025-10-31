import {useEffect, useState, useRef, useMemo} from "react";
import Slider from "../components/Slider.tsx";

// Type for mouse trail point
interface TrailPoint {
    x: number;
    y: number;
    timestamp: number;
}

// Constants for mouse trail - moved outside component
const THROTTLE_MS = 8; // ~120fps for smoother trail
const TRAIL_LIFETIME_MS = 3500; // 3.5 seconds
const MAX_POINTS = 400; // More points for smoother curve

const Courses = () => {
    // State for rocket launch animation
    const [isLaunching, setIsLaunching] = useState(false);
    const [stars, setStars] = useState<{ id: number; left: number; top: number; hueRotate: number; size: number; delay: number; rotation: number }[]>([]);

    const slides = [
        {
            header: "1. Творцов нет, только креаторы:",
            description: "Cтереотипы, которые вредят профессии.",
            image: "/theme0.svg",
            points: [
                "чем креатор отличается от творца?",
                "как устроена креативная экономика?",
                "можно ли натренировать креативность?"
            ]
        },
        {
            header: "2. Как продать вселенную:",
            description: "Ипотека волшебных мест и медиа пространств.",
            image: "/theme1.svg",
            points: [
                "как создавать миры и продавать их?",
                "как увидеть нарративное пространство?",
                "как маленькая метафора превращается в реалистичный мир?"
            ]
        },
        {
            header: "3. Люди такие пешки:",
            description: "Инструменты создания персонажей, аналитика аудитории и набор маленького манипулятора",
            image: "/theme2.svg",
            points: [
                "как найти грань между личностью и персонажем?",
                "что действительно нужно знать об аудитории?",
                "что мы все на самом деле хотим и как это обернуть в свою пользу?"
            ]
        },
        {
            header: "4. Сюжетный поворот не туда:",
            description: "Изучаем всё, что делает сюжет захватывающим. От структуры до байтов.",
            image: "/theme3.svg",
            points: [
                "как вызывать большие эмоции небольшими деталями?",
                "от каких историй невозможно оторваться?",
                "какие тендеции есть в сторителлинге?"
            ]
        },
        {
            header: "5. Грязно символически:",
            description: "Анатомия метафор и символов, и как найти в них смысл, даже если его нет.",
            image: "/theme4.svg",
            points: [
                "что создаёт вторые смыслы?",
                "как работает метафорическое мышление у человека?",
                "как грамотно нагрузить отсылками и символами?"
            ]
        },
        {
            header: "6. Перестать быть душнилой:",
            description: "как работать с информацией так, чтобы было интересно не только тебе?",
            image: "/theme5.svg",
            points: [
                "где найти актуальные и интересные источники?",
                "как вызывать интерес к самой банальной теме?",
                "как устроен жанр нонфикшна и как он продолжает равиватся в видео, контенте и тд?"
            ]
        },
        {
            header: "7. Берём и делаем:",
            description: "СЕКРЕТНАЯ ЛЕКЦИЯ!",
            image: "/theme6.svg",
            points: [
                "что это за лекция?",
                "почему она секретная?",
                "и почему мне так интересно?"
            ]
        }
    ]

    // Detect if device is mobile/touch-enabled
    const isMobile = useRef<boolean>(false);

    useEffect(() => {
        // Check for mobile device on mount
        const checkMobile = () => {
            return (
                'ontouchstart' in window ||
                navigator.maxTouchPoints > 0 ||
                window.matchMedia('(max-width: 768px)').matches
            );
        };
        isMobile.current = checkMobile();
    }, []);

    // Mouse trail state and refs - only used on desktop
    const [trailPoints, setTrailPoints] = useState<TrailPoint[]>([]);
    const lastAddTimeRef = useRef<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Apply courses-specific background styling
    useEffect(() => {
        document.body.classList.add('courses-page-background');

        // Cleanup function to remove the class when component unmounts
        return () => {
            document.body.classList.remove('courses-page-background');
        };
    }, []);

    // Auto-cleanup old trail points - ONLY on desktop
    useEffect(() => {
        if (isMobile.current) return; // Skip on mobile

        const interval = setInterval(() => {
            const now = Date.now();
            setTrailPoints(prev => {
                // Remove points older than TRAIL_LIFETIME_MS
                return prev.filter(point => now - point.timestamp < TRAIL_LIFETIME_MS);
            });
        }, 100); // Check every 100ms

        return () => clearInterval(interval);
    }, []); // Empty dependencies - constants don't change

    // Mouse move handler with throttle - ONLY for desktop
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isMobile.current) return; // Skip on mobile

        const now = Date.now();

        // Throttle: only add point if enough time has passed
        if (now - lastAddTimeRef.current < THROTTLE_MS) {
            return;
        }

        lastAddTimeRef.current = now;

        // Get coordinates relative to the container
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top - 90; // Adjust for SVG top offset (90px)

            // Only add point if within SVG bounds (exclude top/bottom padding)
            if (y >= 0 && y <= rect.height - 180) {
                // Add new point
                setTrailPoints(prev => {
                    const newPoints = [...prev, { x, y, timestamp: now }];
                    // Limit to max points
                    return newPoints.length > MAX_POINTS ? newPoints.slice(-MAX_POINTS) : newPoints;
                });
            }
        }
    };

    // Generate smooth SVG path from points using quadratic curves - memoized
    const trailPath = useMemo(() => {
        const generateSmoothPath = (points: TrailPoint[]): string => {
            if (points.length < 2) return '';

            let path = `M ${points[0].x} ${points[0].y}`;

            // Create smooth curve through points using quadratic Bezier curves
            for (let i = 1; i < points.length; i++) {
                const current = points[i];
                const previous = points[i - 1];

                // Control point is midpoint between current and previous
                const midX = (previous.x + current.x) / 2;
                const midY = (previous.y + current.y) / 2;

                if (i === 1) {
                    // First segment: line to midpoint
                    path += ` L ${midX} ${midY}`;
                } else {
                    // Subsequent segments: quadratic curve
                    path += ` Q ${previous.x} ${previous.y} ${midX} ${midY}`;
                }
            }

            // Final point
            const lastPoint = points[points.length - 1];
            path += ` L ${lastPoint.x} ${lastPoint.y}`;

            return path;
        };

        return generateSmoothPath(trailPoints);
    }, [trailPoints]);

    return (
        <div className="app courses-app-container">

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
                        Как будто есть предрасположенность к креативу,</p>
                    <p className="align-left">
                        но что-то все равно останавливает? 
                    </p>
                    <p className="align-right">
                        Это скорее к психологу. А я могу дать теории, структуры,</p>
                    <p className="align-right">
                        практику и хорошую атмосферу на занятиях.
                    </p>
                </div>

                <div className="story-container">

                    <div className="sonchy-tv">
                        <img src="/sonchy-tv.svg" alt="sonchy-tv"/>
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

                <div
                    className="points-container points-interactive"
                    ref={containerRef}
                    onMouseMove={handleMouseMove}
                    aria-label="Интерактивная область - проведите мышкой для эффекта"
                    role="region"
                >
                    {/* SVG overlay for mouse trail - exclude vertical padding */}
                    <svg
                        aria-hidden="true"
                        style={{
                            position: 'absolute',
                            top: '90px',
                            bottom: '90px',
                            left: 0,
                            right: 0,
                            width: '100%',
                            height: 'calc(100% - 180px)',
                            pointerEvents: 'none',
                            zIndex: 10
                        }}
                    >
                        {/* Gradient: left = pink, right = green, sharp transition in middle */}
                        {/* gradientUnits="userSpaceOnUse" makes gradient relative to SVG coordinates, not the line itself */}
                        <defs>
                            <linearGradient
                                id="trailGradient"
                                x1="0"
                                y1="0"
                                x2={containerRef.current?.getBoundingClientRect().width || 0}
                                y2="0"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop offset="0%" stopColor="#FFAFE4" />
                                <stop offset="48%" stopColor="#FFAFE4" />
                                <stop offset="52%" stopColor="#87E0B3" />
                                <stop offset="100%" stopColor="#87E0B3" />
                            </linearGradient>

                            {/* Subtle rough edges filter - rare light notches like yes-word.svg */}
                            <filter id="roughEdges">
                                <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" result="noise" />
                                <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
                            </filter>
                        </defs>

                        {trailPoints.length > 1 && (
                            <path
                                d={trailPath}
                                stroke="url(#trailGradient)"
                                strokeWidth="40"
                                fill="none"
                                strokeLinecap="square"
                                strokeLinejoin="miter"
                                opacity="0.5"
                                filter="url(#roughEdges)"
                            />
                        )}
                    </svg>

                    <div className="no-words-container">
                        <h3>в этом курсе<br/>нет слов: </h3>
                        <ul aria-label="Список слов, которых нет в курсе">
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
                        <ul aria-label="Список слов, которые есть в курсе">
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

                <div className="slider-title">
                    <h2>7 лекций = 7 тем</h2>
                </div>

                <Slider slides={slides}></Slider>

                <div className="timeline">
                    <time dateTime="2024-11-06">
                        <h2>СТАРТ - 6 НОЯБРЯ</h2>
                    </time>
                    <time dateTime="2024-12-13">
                        <h2>ФИНАЛ - 13 ДЕКАБРЯ</h2>
                    </time>
                    <p>лекции по субботам</p>
                </div>

                <div id="formats" className="formats-header">
                    <h2>ФОРМАТЫ</h2>
                </div>

                <div className="formats-container">

                    <div className="format-card base">
                        <img src="/basenysh.svg" alt="Базёныш формат" />
                        <div className="format-content">
                            <h3>Базёныш</h3>
                            <ul aria-label="Что включено в формат Базёныш">
                                <li>7 лекций по 1,5 часа без семинаров!</li>
                                <li>ответы на вопросы</li>
                                <li>материалы, задания (без проверки)</li>
                            </ul>
                            <a href="https://payform.ru/l59GUqm/" aria-label="Купить формат Базёныш за 8900 рублей">
                                <button type="button" className="base-button">
                                    КУПИТЬ ЗА <span aria-label="8900 рублей">8900 р.</span>
                                </button>
                            </a>
                        </div>
                    </div>

                    <div className="format-card starling">
                        <img src="/starling.svg" alt="Звёздочка формат" />
                        <div className="format-content">
                            <h3>Звёздочка</h3>
                            <ul aria-label="Что включено в формат Звёздочка">
                                <li>7 лекций по 1,5 часа</li>
                                <li>6 практических семинаров</li>
                                <li>группа из 10 человек</li>
                                <li>отдельный чат</li>
                                <li>проверка и обсуждение заданий</li>
                            </ul>
                            <a href="" aria-label="Купить формат Звёздочка за 21900 рублей">
                                <button type="button" className="starling-button">
                                    Sold out!
                                </button>
                            </a>
                        </div>
                        <img src="/info-box-green.svg" alt="всего 8 мест!" className="info-box info-box-green" />
                    </div>

                    <div className="format-card supernova">
                        <img src="/supernova.svg" alt="Супернова формат" />
                        <div className="format-content">
                            <h3>Супернова</h3>
                            <ul aria-label="Что включено в формат Супернова">
                                <li>7 лекций</li>
                                <li>6 практических семинаров</li>
                                <li>2 индивидуальные сессии</li>
                                <li>ответы в чате</li>
                                <li>работа с личным запросом</li>
                                <li>подборка материалов</li>
                            </ul>
                            <a href="" aria-label="Купить формат Супернова за 34900 рублей">
                                <button type="button" className="supernova-button">
                                    Sold out!
                                </button>
                            </a>
                        </div>
                        <img src="/info-box-pink.svg" alt="всего 3 места!" className="info-box info-box-pink" />
                    </div>

                </div>

                <div className="seminars">
                    <div className="seminars-people">
                        <div className="seminars-person"></div>
                        <div className="seminars-person"></div>
                        <div className="seminars-person"></div>
                        <div className="seminars-person"></div>
                        <div className="seminars-person"></div>
                        <div className="seminars-person"></div>
                    </div>
                    <div className="seminars-text">
                        <h3>А что на семинарах?</h3>
                        <p>Честно говоря, я все это затеяла ради самих семинаров.</p>
                        <p>По выходным мы будем обсуждать креативные задачки, обсуждать ваши проекты, рассматривать как справились с заданиями. Это всегда очень очень поддерживающая и интересная атмосфера, по которой
                            я скучаю и как лектор, и как студентка.</p>
                        <p className="align-right">Я подготовила этюды и упражнения на каждую тему, но оставила фокус на том, чтобы за эти полтора месяца вы узнали о себе чуть больше.</p>
                        <p>ну и конечно, у меня есть коллекция прекрасной чуши, на которой забавно тренироваться</p>
                    </div>
                    <img src="/info-box-seminar.svg" className="info-box info-box-seminar" />
                </div>

                <div className="iceberg-title">
                    <h2>И что мне за это будет?</h2>
                </div>

                <div className="iceberg">
                    <img src="/iceberg.png" alt="iceberg"></img>
                </div>

                <div id="apply" className="apply-button">
                    <button
                        type={"button"}
                        className={isLaunching ? 'launching' : ''}
                        onClick={() => {
                            setIsLaunching(true);

                            // Generate stars trail - more stars, scattered along the path
                            const hueRotations = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]; // Different hues for variety
                            const newStars = Array.from({ length: 40 }, (_, i) => {
                                const progress = i / 40; // 0 to 1
                                return {
                                    id: Date.now() + i,
                                    left: 20 + progress * 100, // Stars spread from 20% to 120% (до края и дальше)
                                    top: 50 + (Math.random() - 0.5) * 40, // Scattered vertically more
                                    hueRotate: hueRotations[Math.floor(Math.random() * hueRotations.length)],
                                    size: 30 + Math.random() * 50, // 30px to 80px (больше!)
                                    delay: i * 0.04, // Longer animation
                                    rotation: Math.random() * 360
                                };
                            });
                            setStars(newStars);

                            // Scroll to formats section after animation
                            setTimeout(() => {
                                window.location.href = 'https://payform.ru/l59GUqm/';
                            }, 2000);
                        }}
                    >
                        <a href="https://payform.ru/l59GUqm/" onClick={(e) => e.preventDefault()}>
                            ЗАПИСАТЬСЯ НА КУРС
                        </a>
                    </button>
                    {/* Stars trail */}
                    {stars.map((star) => (
                        <img
                            key={star.id}
                            src="/star.svg"
                            className="rocket-star"
                            style={{
                                left: `${star.left}%`,
                                top: `${star.top}%`,
                                width: `${star.size}px`,
                                height: `${star.size}px`,
                                '--star-hue': `${star.hueRotate}deg`,
                                '--star-rotation': `${star.rotation}deg`,
                                animationDelay: `${star.delay}s`
                            } as React.CSSProperties}
                            alt=""
                        />
                    ))}
                </div>

                <footer className="courses-footer">
                </footer>

            </div>

        </div>
    );
};

export default Courses;
