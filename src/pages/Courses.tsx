import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import type { ReactNode } from "react";
import "../styles/courses.css";

interface TrailPoint {
    x: number;
    y: number;
    timestamp: number;
}

const THROTTLE_MS = 8;
const TRAIL_LIFETIME_MS = 3500;
const MAX_POINTS = 400;

interface TrailSectionProps {
    className?: string;
    isMobile: boolean;
    children: ReactNode;
}

const TrailSection = ({ className = "", isMobile, children }: TrailSectionProps) => {
    const [trailPoints, setTrailPoints] = useState<TrailPoint[]>([]);
    const lastAddTimeRef = useRef<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const gradientId = useMemo(() => `c2-trail-grad-${Math.random().toString(36).slice(2, 9)}`, []);
    const filterId = useMemo(() => `c2-rough-${Math.random().toString(36).slice(2, 9)}`, []);

    useEffect(() => {
        if (isMobile) return;
        const interval = setInterval(() => {
            const now = Date.now();
            setTrailPoints(prev => prev.filter(p => now - p.timestamp < TRAIL_LIFETIME_MS));
        }, 100);
        return () => clearInterval(interval);
    }, [isMobile]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isMobile) return;
        const now = Date.now();
        if (now - lastAddTimeRef.current < THROTTLE_MS) return;
        lastAddTimeRef.current = now;

        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            setTrailPoints(prev => {
                const next = [...prev, { x, y, timestamp: now }];
                return next.length > MAX_POINTS ? next.slice(-MAX_POINTS) : next;
            });
        }
    };

    const trailPath = useMemo(() => {
        if (trailPoints.length < 2) return "";
        let path = `M ${trailPoints[0].x} ${trailPoints[0].y}`;
        for (let i = 1; i < trailPoints.length; i++) {
            const current = trailPoints[i];
            const previous = trailPoints[i - 1];
            const midX = (previous.x + current.x) / 2;
            const midY = (previous.y + current.y) / 2;
            if (i === 1) path += ` L ${midX} ${midY}`;
            else path += ` Q ${previous.x} ${previous.y} ${midX} ${midY}`;
        }
        const last = trailPoints[trailPoints.length - 1];
        path += ` L ${last.x} ${last.y}`;
        return path;
    }, [trailPoints]);

    const width = containerRef.current?.getBoundingClientRect().width || 0;

    return (
        <div
            ref={containerRef}
            className={`c2-trail-section ${className}`}
            onMouseMove={handleMouseMove}
        >
            <svg className="c2-trail-svg" aria-hidden="true">
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2={width} y2="0" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#FFAFE4" />
                        <stop offset="48%" stopColor="#FFAFE4" />
                        <stop offset="52%" stopColor="#87E0B3" />
                        <stop offset="100%" stopColor="#87E0B3" />
                    </linearGradient>
                    <filter id={filterId}>
                        <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
                    </filter>
                </defs>
                {trailPoints.length > 1 && (
                    <path
                        d={trailPath}
                        stroke={`url(#${gradientId})`}
                        strokeWidth="40"
                        fill="none"
                        strokeLinecap="square"
                        strokeLinejoin="miter"
                        opacity="0.5"
                        filter={`url(#${filterId})`}
                    />
                )}
            </svg>
            {children}
        </div>
    );
};

type LaunchTarget = "cards" | "participate" | null;

interface StarData {
    id: number;
    tx: number;
    ty: number;
    hueRotate: number;
    size: number;
    delay: number;
    rotation: number;
    startLeft: number;
    startTop: number;
}

const Courses = () => {
    const isMobile = useRef<boolean>(false);
    const [launching, setLaunching] = useState<LaunchTarget>(null);
    const [stars, setStars] = useState<StarData[]>([]);
    const [bookPage, setBookPage] = useState<0 | 1>(0);
    const bookTouchStartX = useRef<number | null>(null);

    const handleBookTouchStart = (e: React.TouchEvent) => {
        bookTouchStartX.current = e.touches[0].clientX;
    };
    const handleBookTouchEnd = (e: React.TouchEvent) => {
        if (bookTouchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - bookTouchStartX.current;
        if (Math.abs(dx) > 40) {
            if (dx < 0) setBookPage(1);
            else setBookPage(0);
        }
        bookTouchStartX.current = null;
    };

    useEffect(() => {
        const checkMobile = () =>
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            window.matchMedia('(max-width: 768px)').matches;
        isMobile.current = checkMobile();
    }, []);

    const triggerLaunch = useCallback((target: Exclude<LaunchTarget, null>) => {
        if (launching) return;
        setLaunching(target);
        const hues = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
        const newStars: StarData[] = Array.from({ length: 40 }, (_, i) => {
            const angle = (Math.random() - 0.5) * Math.PI * 0.6;
            const dist = 180 + Math.random() * 240;
            return {
                id: Date.now() + i,
                tx: Math.sin(angle) * dist,
                ty: -Math.abs(Math.cos(angle) * dist),
                hueRotate: hues[Math.floor(Math.random() * hues.length)],
                size: 30 + Math.random() * 50,
                delay: i * 0.025,
                rotation: Math.random() * 360,
                startLeft: 50 + (Math.random() - 0.5) * 30,
                startTop: 50,
            };
        });
        setStars(newStars);
        setTimeout(() => {
            setLaunching(null);
            setStars([]);
        }, 2000);
    }, [launching]);

    const renderStars = (target: Exclude<LaunchTarget, null>) => {
        if (launching !== target) return null;
        return stars.map(star => (
            <img
                key={star.id}
                src="/star.svg"
                className="c2-rocket-star"
                style={{
                    left: `${star.startLeft}%`,
                    top: `${star.startTop}%`,
                    width: `${star.size}px`,
                    height: `${star.size}px`,
                    '--star-hue': `${star.hueRotate}deg`,
                    '--star-rotation': `${star.rotation}deg`,
                    '--star-tx': `${star.tx}px`,
                    '--star-ty': `${star.ty}px`,
                    animationDelay: `${star.delay}s`,
                } as React.CSSProperties}
                alt=""
            />
        ));
    };

    const doodles = useMemo(() => {
        const placements = [
            { src: "/courses/doodle1.svg", top: "8%", left: "4%", w: 110, rot: -12 },
            { src: "/courses/doodle2.svg", top: "14%", left: "88%", w: 90, rot: 18 },
            { src: "/courses/doodle3.svg", top: "22%", left: "70%", w: 120, rot: -6 },
            { src: "/courses/doodle4.svg", top: "30%", left: "10%", w: 100, rot: 24 },
            { src: "/courses/doodle1.svg", top: "55%", left: "92%", w: 110, rot: 30 },
            { src: "/courses/doodle2.svg", top: "62%", left: "8%", w: 85, rot: -14 },
            { src: "/courses/doodle3.svg", top: "70%", left: "84%", w: 105, rot: 8 },
            { src: "/courses/doodle4.svg", top: "76%", left: "12%", w: 100, rot: -22 },
        ];
        return placements;
    }, []);

    return (
        <div className="app courses2-app">
            <div className="c2-doodles" aria-hidden="true">
                {doodles.map((d, i) => (
                    <img
                        key={i}
                        src={d.src}
                        className="c2-doodle"
                        style={{
                            top: d.top,
                            left: d.left,
                            width: `${d.w}px`,
                            transform: `rotate(${d.rot}deg)`,
                        }}
                        alt=""
                    />
                ))}
            </div>

            {/* 1. HEADER */}
            <header className="c2-header">
                <img
                    src="/courses/doodle1.svg"
                    alt=""
                    aria-hidden="true"
                    className="c2-header-doodle c2-header-doodle-1"
                />
                <img
                    src="/courses/doodle2.svg"
                    alt=""
                    aria-hidden="true"
                    className="c2-header-doodle c2-header-doodle-2"
                />
                <div className="c2-title-cloud">
                    <h1>WRITER<br />SUMMER</h1>
                    <span className="c2-subtitle">прожить лето дважды</span>
                </div>
                <div className="c2-header-bottom">
                    <p className="c2-header-lead">
                        Летний писательский интенсив, где мы НЕ пишем черновик на скорость,
                        а пошагово конструируем книгу.
                    </p>
                    <div className="c2-header-deco" aria-hidden="true">
                        <div className="c2-header-deco-sun" />
                        <span className="c2-header-pill c2-pill-writer">WRITER</span>
                        <span className="c2-header-pill c2-pill-summer">SUMMER</span>
                        <div className="c2-header-deco-pen" />
                    </div>
                </div>
            </header>

            {/* 2. ABOUT */}
            <section className="c2-about">
                <div className="c2-about-grid">
                    <div className="c2-about-card c2-about-card-wide c2-about-pink">
                        <h3>1 день = 1 часть писательского процесса.</h3>
                        <p>От заявки в издательство до нарративного профиля.</p>
                        <img className="c2-about-card-deco" src="/courses/about-decoration1.svg" alt="" aria-hidden="true" />
                    </div>
                    <div className="c2-about-card c2-about-orange">
                        <h3>7 тем = 7 гайдов</h3>
                        <p>
                            заполняем <strong>личные гайды</strong> к твоей рукописи.
                            они в разы облегчат процесс и повысят шанс не забросить книгу
                        </p>
                        <img className="c2-about-card-deco" src="/courses/about-decoration2.svg" alt="" aria-hidden="true" />
                    </div>
                    <div className="c2-about-card c2-about-purple">
                        <h3>правим отрывки</h3>
                        <p>
                            теорию мы применяем на ключевых отрывках <strong>из твоего текста</strong>.
                            важные ссоры, знакомство с персонажами, метафоры и тд
                        </p>
                        <img className="c2-about-card-deco" src="/courses/about-decoration3.svg" alt="" aria-hidden="true" />
                    </div>
                </div>
            </section>

            {/* 3. CALENDAR (mouse-trail) */}
            <TrailSection className="c2-calendar-section" isMobile={isMobile.current}>
                <div className="c2-section-title">
                    <h2>ПРОГРАММА КРАТКО</h2>
                    <span className="c2-subdate">2-9 июня</span>
                </div>

                <div className="c2-calendar-panel">
                    <div className="c2-calendar-tape t-tl" />
                    <div className="c2-calendar-tape t-tr" />
                    <div className="c2-calendar-tape t-bl" />

                    <div className="c2-calendar-month">
                        <div className="c2-calendar-month-scribble" />
                        <span>ИЮНЬ</span>
                    </div>

                    <div className="c2-calendar-grid">
                        {["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"].map(d => (
                            <div key={d} className="c2-calendar-dow">{d}</div>
                        ))}

                        {/* Week 1: 1-7 */}
                        <div className="c2-calendar-cell"><span className="c2-calendar-num">1</span></div>
                        <div className="c2-calendar-cell c-event"><span className="c2-calendar-num">2</span>
                            <img className="c2-day-img" src="/courses/calendar-idea.svg" alt="Идея" />
                            <span className="c2-day-label lbl-pink">Идея!</span>
                        </div>
                        <div className="c2-calendar-cell c-event"><span className="c2-calendar-num">3</span>
                            <img className="c2-day-img" src="/courses/calendar-world.svg" alt="Мир" />
                            <span className="c2-day-label lbl-orange">Мир</span>
                        </div>
                        <div className="c2-calendar-cell c-event"><span className="c2-calendar-num">4</span>
                            <img className="c2-day-img" src="/courses/calendar-characters.svg" alt="Персонажи" />
                            <span className="c2-day-label lbl-pink">Персонажи!</span>
                        </div>
                        <div className="c2-calendar-cell c-event"><span className="c2-calendar-num">5</span>
                            <img className="c2-day-img" src="/courses/calendar-plot.svg" alt="Сюжет" />
                            <span className="c2-day-label lbl-red">Сюжет!</span>
                        </div>
                        <div className="c2-calendar-cell c-event"><span className="c2-calendar-num">6</span>
                            <img className="c2-day-img" src="/courses/calendar-dialog.svg" alt="Диалоги" />
                            <span className="c2-day-label lbl-purple">Диалоги</span>
                        </div>
                        <div className="c2-calendar-cell"><span className="c2-calendar-num">7</span>
                            <span className="c2-day-label lbl-pink" style={{ marginTop: 18 }}>отдых!</span>
                        </div>

                        {/* Week 2: 8-14 */}
                        <div className="c2-calendar-cell c-event"><span className="c2-calendar-num">8</span>
                            <img className="c2-day-img" src="/courses/calendar-style.svg" alt="Стиль" />
                            <span className="c2-day-label lbl-purple">Стиль</span>
                        </div>
                        <div className="c2-calendar-cell c-event"><span className="c2-calendar-num">9</span>
                            <img className="c2-day-img" src="/courses/calendar-development.svg" alt="Продвижение" />
                            <span className="c2-day-label lbl-orange">Продви-<br />жение</span>
                        </div>
                        <div className="c2-calendar-cell c-muted"><span className="c2-calendar-num">10</span></div>
                        <div className="c2-calendar-cell c-muted"><span className="c2-calendar-num">11</span></div>
                        <div className="c2-calendar-cell c-muted"><span className="c2-calendar-num">12</span></div>
                        <div className="c2-calendar-cell c-muted"><span className="c2-calendar-num">13</span></div>
                        <div className="c2-calendar-cell c-muted"><span className="c2-calendar-num">14</span></div>

                    </div>

                    <div className="c2-calendar-notes">
                        <ul>
                            <li>7 лекций по 2 часа</li>
                            <li>в зуме в 13:00</li>
                        </ul>
                        <ul>
                            <li>записи лекций до 9 июля</li>
                            <li>гайд отправляется до лекции</li>
                        </ul>
                    </div>
                </div>
            </TrailSection>

            {/* 4. CARDS (mouse-trail) */}
            <TrailSection className="c2-cards-section" isMobile={isMobile.current}>
                <div className="c2-section-title">
                    <h2>КОМУ ПОДОЙДЁТ?</h2>
                </div>

                <div className="c2-cards-bg">
                    <img className="c2-cards-bg-img" src="/courses/cards-bg.png" alt="" aria-hidden="true" />
                    <div className="c2-cards-row">
                        <div className="c2-sticky s-novichku s-rot-1">
                            <span className="c2-sticky-tape tape-blue" />
                            <h4>НОВИЧКУ</h4>
                            <p>есть идея, но не знаю, стоит ли в нее вкладываться</p>
                            <div className="c2-sticky-underline" />
                        </div>
                        <div className="c2-sticky c2-sticky-yellow s-probuyushchemu s-rot-2">
                            <span className="c2-sticky-tape tape-pink" />
                            <h4>ПРОБУЮЩЕМУ</h4>
                            <p>есть отрывки и черновики, но хочу написать что-то цельное</p>
                            <div className="c2-sticky-underline" />
                        </div>
                        <div className="c2-sticky s-pishushchemu s-rot-3">
                            <span className="c2-sticky-tape tape-yellow" />
                            <h4>ПИШУЩЕМУ</h4>
                            <p>есть рукопись или публикация, но интересно улучшить процесс</p>
                            <div className="c2-sticky-underline" />
                        </div>
                    </div>
                </div>

                <div className="c2-cta-wrap">
                    <button
                        type="button"
                        className={`c2-cta-pill ${launching === "cards" ? "launching" : ""}`}
                        onClick={() => triggerLaunch("cards")}
                    >
                        ЗАПИСАТЬСЯ<br />12 990 Р
                    </button>
                    {renderStars("cards")}
                    <p className="c2-cta-disclaimer">
                        *купить в записи после окончания интенсива - нельзя.
                        запись ТОЛЬКО для участников до 9 июля
                    </p>
                </div>
            </TrailSection>

            {/* 5. BOOK */}
            <section className="c2-book-section">
                <img src="/courses/book.png" alt="Открытая книга с описанием курса" />
                <div
                    className="c2-book-slider"
                    aria-label="Страницы книги — пролистайте"
                    onTouchStart={handleBookTouchStart}
                    onTouchEnd={handleBookTouchEnd}
                >
                    <div
                        className="c2-book-slider-viewport"
                        style={{ transform: `translateX(-${bookPage * 50}%)` }}
                    >
                        <img src="/courses/book.png" alt="Открытая книга" />
                    </div>
                </div>
                <div className="c2-book-dots" role="tablist" aria-label="Переключатель страниц">
                    <button
                        type="button"
                        className={`c2-book-dot ${bookPage === 0 ? 'active' : ''}`}
                        onClick={() => setBookPage(0)}
                        aria-label="Страница 1"
                        aria-selected={bookPage === 0}
                    />
                    <button
                        type="button"
                        className={`c2-book-dot ${bookPage === 1 ? 'active' : ''}`}
                        onClick={() => setBookPage(1)}
                        aria-label="Страница 2"
                        aria-selected={bookPage === 1}
                    />
                </div>
            </section>

            {/* 6. PLAN (mouse-trail) */}
            <TrailSection className="c2-plan-section" isMobile={isMobile.current}>
                <img
                    src="/courses/doodle5.svg"
                    alt=""
                    aria-hidden="true"
                    className="c2-plan-squiggle c2-plan-squiggle-top"
                />
                <img
                    src="/courses/doodle6.svg"
                    alt=""
                    aria-hidden="true"
                    className="c2-plan-squiggle c2-plan-squiggle-bottom"
                />
                <div className="c2-section-title">
                    <h2>ПЛАН ИНТЕНСИВА</h2>
                </div>

                <div className="c2-plan-headers-row">
                    <div className="c2-plan-header">Что изучаем?</div>
                    <div className="c2-plan-header">Что редактируем?</div>
                    <div className="c2-plan-header">Какой гайд заполняем?</div>
                </div>

                <div className="c2-plan-grid">
                    {[
                        {
                            n: 1, name: "Идея, заявка, конфликт",
                            studyBody: "оценка идеи и развитие ее до главного конфликта и темы, оформление в заявку",
                            edit: "логлайн (краткое описание истории)",
                            guide: ["заявка для издательства", "презентация"],
                            decoCenter: { src: "/courses/lamp-plan-decoration.svg", className: "deco-lamp" },
                            decoRight: { src: "/courses/book-plan-decoration.svg", className: "deco-book" },
                        },
                        {
                            n: 2, name: "Мир и исследование",
                            studyBody: "изучение и создание конфликтной среды, где будут происходить действия романа",
                            edit: "сцена первого знакомства с миром и окружением",
                            guide: ["устройство мира", "лорные записки"],
                            decoLeft: { src: "/courses/sun-plan-decoration.svg", className: "deco-sun" },
                            decoRight: { src: "/courses/waves-plan-decoration.svg", className: "deco-waves" },
                        },
                        {
                            n: 3, name: "Главный герой",
                            studyBody: "детальная проработка главного героя и его арки",
                            edit: "экспозиция главного героя или злодея",
                            guide: ["библия персонажей"],
                            decoCenter: { src: "/courses/exclamation-plan-decoration.svg", className: "deco-exclamation" },
                            decoRight: { src: "/courses/characters-plan-decoration.svg", className: "deco-characters" },
                        },
                        {
                            n: 4, name: "Сюжет и драматургия",
                            studyBody: "выбор сюжетной структуры и типа планирования истории",
                            edit: "синопсис книги",
                            guide: ["поэпизодный план в карточках"],
                            decoCenter: { src: "/courses/synopsis-plan-decoration.svg", className: "deco-synopsis" },
                            decoRight: { src: "/courses/episode-plan-decoration.svg", className: "deco-episode" },
                        },
                        {
                            n: 5, name: "Диалоги и взаимоотношения",
                            studyBody: "раскрытие второстепенных героев через действия и реплики",
                            edit: "диалог главного конфликта героев",
                            guide: ["речевая карта", "план 5 ключевых диалогов"],
                        },
                        {
                            n: 6, name: "Стиль и нарратив",
                            studyBody: "основа литературного монтажа, поиск авторского стиля",
                            edit: "описание обстановки или эмоционального состояния героя",
                            guide: ["нарративный автопортрет (аналитика своего стиля)"],
                        },
                        {
                            n: 7, name: "Редактура и продвижение",
                            studyBody: "завершающая лекция о будущем черновика",
                            edit: "редактура сценарной заявки для издательства",
                            guide: ["стратегия продвижения книги", "план по редактуре"],
                        },
                    ].map(row => (
                        <div className={`c2-plan-row c2-plan-row-${row.n}`} key={row.n}>
                            <div className="c2-plan-cell">
                                {row.decoLeft && (
                                    <img
                                        src={row.decoLeft.src}
                                        alt=""
                                        aria-hidden="true"
                                        className={`c2-plan-deco c2-plan-deco-left ${row.decoLeft.className}`}
                                    />
                                )}
                                <div className="c2-plan-cell-title">
                                    <span className="c2-plan-cell-name">{row.name}</span>
                                </div>
                                <p className="c2-plan-cell-body">{row.studyBody}</p>
                            </div>
                            <div className="c2-plan-cell c2-plan-cell-center">
                                {row.decoCenter && (
                                    <img
                                        src={row.decoCenter.src}
                                        alt=""
                                        aria-hidden="true"
                                        className={`c2-plan-deco c2-plan-deco-center ${row.decoCenter.className}`}
                                    />
                                )}
                                <span>{row.edit}</span>
                            </div>
                            <div className="c2-plan-cell c2-plan-cell-right">
                                {row.decoRight && (
                                    <img
                                        src={row.decoRight.src}
                                        alt=""
                                        aria-hidden="true"
                                        className={`c2-plan-deco c2-plan-deco-right ${row.decoRight.className}`}
                                    />
                                )}
                                <ul>
                                    {row.guide.map((g, i) => <li key={i}>{g}</li>)}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </TrailSection>

            {/* 7. PARTICIPATE */}
            <section className="c2-participate-section">
                <div className="c2-participate-bg">
                    <img className="c2-participate-bg-img" src="/courses/participate-bg.svg" alt="" aria-hidden="true" />
                    <h2>устрой себе</h2>
                    <h1>HOT WRITER SUMMER</h1>
                    <div style={{ position: "relative", display: "inline-block" }}>
                        <button
                            type="button"
                            className={`c2-cta-pill ${launching === "participate" ? "launching" : ""}`}
                            onClick={() => triggerLaunch("participate")}
                        >
                            УЧАСТИЕ<br />12 990 Р
                        </button>
                        {renderStars("participate")}
                    </div>
                </div>
            </section>

            <div className="c2-footer-purple" />
        </div>
    );
};

export default Courses;
