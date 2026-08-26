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

type TierId = "listener" | "trying" | "consult";

/** Every purchase button on the page, so the rocket animation can target one. */
type LaunchTarget =
    | `sticky-${TierId}`
    | `tariff-${TierId}`
    | "cards";

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

const PAYMENT_LINKS: Record<TierId, string> = {
    listener: "https://app.lava.top/products/2e904852-f5f2-4f28-8039-b4fdcdee5358",
    trying: "https://app.lava.top/products/a504d32c-85b6-4bef-ad89-97ebc8fa1285",
    consult: "https://app.lava.top/products/bd25d7a6-2fb5-4a5d-a613-b9242abb2d43",
};

/** The general CTA opens the storefront rather than a single product. */
const STOREFRONT_LINK = "https://app.lava.top/xsonchy?sort=published";

/**
 * How long before a launched button is restored: the pill animates for 1.6s and
 * the last star carries a 0.975s stagger on top of its own 1.6s run.
 */
const LAUNCH_RESET_MS = 2600;

interface Tier {
    id: TierId;
    /** Sticky-note label — differs from the tariff-table name by design. */
    stickyTitle: string;
    stickyClass: string;
    blurb: string;
    seats: string | null;
    price: string;
    /** Tariff-table column heading. */
    tableName: string;
}

const TIERS: Tier[] = [
    {
        id: "listener",
        stickyTitle: "НОВИЧКУ",
        stickyClass: "s-novichku",
        blurb: "есть идея, но не знаю, стоит ли в нее вкладываться, хочу послушать курс лекций и решить сам",
        seats: null,
        price: "10 900 ₽",
        tableName: "НОВИЧОК",
    },
    {
        id: "trying",
        stickyTitle: "ПРОБУЮЩЕМУ",
        stickyClass: "s-probuyushchemu",
        blurb: "есть отрывки и черновики, но хочу написать что-то цельное. не хватает обратной связи и упражнений",
        seats: "30 мест!",
        price: "17 900 ₽",
        tableName: "ПРОБУЮЩИЙ",
    },
    {
        id: "consult",
        stickyTitle: "С КОНСУЛЬТАЦИЯМИ",
        stickyClass: "s-consult",
        blurb: "есть рукопись или готов писать сейчас — нужно личное сопровождение и полный разбор",
        seats: "4 места!",
        price: "33 900 ₽",
        tableName: "С КОНСУЛЬТАЦИЯМИ",
    },
];

/** `true` renders a check, `false` a dash, a string renders as-is. */
type TariffCell = boolean | string;

const TARIFF_ROWS: { label: string; values: [TariffCell, TariffCell, TariffCell] }[] = [
    { label: "Кол-во мест", values: ["∞", "30 мест", "4 места"] },
    { label: "7 лекций + записи интенсива", values: [true, true, true] },
    { label: "7 практических гайдов", values: [true, true, true] },
    { label: "Доступ в общий чат писателей", values: [true, true, true] },
    { label: "Отрывки на разбор", values: [false, "7 отрывков (по 1 на тему)", "7 отрывков (по 1 на тему)"] },
    { label: "Разбор текстов на лекции", values: [false, "выборочно на лекции", "Все в отдельном видео"] },
    { label: "Письменный фидбек от мастера", values: [false, true, true] },
    { label: "Индивидуальная редактура", values: [false, false, true] },
    { label: "Помощь с гайдами", values: [false, false, true] },
    { label: "2 личные зум-консультации", values: [false, false, true] },
    { label: "Доступ к материалам", values: ["3 месяца", "3 месяца", "навсегда"] },
];

const Courses = () => {
    const isMobile = useRef<boolean>(false);
    const [bookPage, setBookPage] = useState<0 | 1>(0);
    const bookTouchStartX = useRef<number | null>(null);
    const appRef = useRef<HTMLDivElement>(null);
    const [doodleContainerH, setDoodleContainerH] = useState<number>(0);
    const [launching, setLaunching] = useState<LaunchTarget | null>(null);
    const [stars, setStars] = useState<StarData[]>([]);
    const launchTimer = useRef<number | null>(null);

    useEffect(() => () => {
        if (launchTimer.current !== null) window.clearTimeout(launchTimer.current);
    }, []);

    const triggerLaunch = useCallback((target: LaunchTarget, href: string) => {
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
        window.open(href, "_blank", "noopener,noreferrer");

        // c2-launch ends at opacity 0 with fill-mode forwards, so without this
        // the button stays invisible once the user returns from the payment tab.
        launchTimer.current = window.setTimeout(() => {
            setLaunching(null);
            setStars([]);
        }, LAUNCH_RESET_MS);
    }, [launching]);

    const renderStars = (target: LaunchTarget) => {
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

    useEffect(() => {
        const app = appRef.current;
        if (!app) return;
        const update = () => setDoodleContainerH(app.scrollHeight);
        update();
        const ro = new ResizeObserver(update);
        ro.observe(app);
        // Observe section children too — their growth changes scrollHeight
        for (const child of Array.from(app.children)) {
            if (child instanceof HTMLElement) ro.observe(child);
        }
        return () => ro.disconnect();
    }, []);

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

    // Long, horizontally elongated hand-drawn spirals.
    // viewBox is 1000×200 — wide and short — so each spiral sprawls horizontally.
    // Strokes are #F5D381 5px wide; scaled to ~1500px across (or 100vw + overflow on small screens).
    const spiralPaths = useMemo(() => [
        // Loose horizontal coil winding left-to-right
        "M 20 100 C 80 20, 160 180, 240 100 S 400 20, 480 100 S 640 180, 720 100 S 880 20, 980 100",
        // Bigger looping spiral with a curl at the end
        "M 10 110 C 100 30, 200 30, 300 110 S 500 190, 600 110 S 800 30, 900 110 Q 950 160, 880 170 Q 820 175, 840 110",
        // Long meandering wavy curl
        "M 980 90 C 900 170, 800 10, 700 90 S 500 170, 400 90 S 200 10, 100 90 Q 30 130, 80 160 Q 130 175, 150 120",
        // Tight cluster in middle with tails extending out
        "M 20 120 Q 200 60, 400 120 C 500 150, 580 60, 500 90 S 400 150, 480 130 Q 600 100, 700 120 Q 900 140, 980 80",
        // Long flowing S-curve with extra loop
        "M 10 100 C 150 10, 300 190, 450 100 Q 550 40, 600 80 Q 650 130, 580 130 Q 540 120, 600 100 S 800 180, 990 100",
        // Vertical loops marching across
        "M 30 100 Q 80 20, 130 100 Q 180 180, 230 100 Q 280 20, 330 100 Q 380 180, 430 100 Q 480 20, 530 100 Q 580 180, 630 100 Q 680 20, 730 100 Q 780 180, 830 100 Q 880 20, 970 100",
    ], []);

    const doodles = useMemo(() => {
        // top% positions spread across the page, deliberately SKIPPING the plan section
        // (roughly 68%–87% of page height) so doodles don't overlap the rows.
        return [
            { d: spiralPaths[0], top: "6%", rot: -3 },
            { d: spiralPaths[1], top: "16%", rot: 4 },
            { d: spiralPaths[2], top: "26%", rot: -2 },
            { d: spiralPaths[3], top: "38%", rot: 5 },
            { d: spiralPaths[4], top: "50%", rot: -4 },
            { d: spiralPaths[5], top: "62%", rot: 3 },
            { d: spiralPaths[0], top: "93%", rot: -3, flip: true },
        ];
    }, [spiralPaths]);

    return (
        <div className="app courses2-app" ref={appRef}>
            <div
                className="c2-doodles"
                aria-hidden="true"
                style={doodleContainerH ? { height: `${doodleContainerH}px` } : undefined}
            >
                {doodles.map((d, i) => (
                    <svg
                        key={i}
                        className="c2-doodle"
                        viewBox="0 0 1000 200"
                        preserveAspectRatio="none"
                        style={{
                            top: d.top,
                            transform: `translateX(-50%) rotate(${d.rot}deg)${d.flip ? ' scaleX(-1)' : ''}`,
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d={d.d}
                            fill="none"
                            stroke="#F5D381"
                            strokeWidth="5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            vectorEffect="non-scaling-stroke"
                        />
                    </svg>
                ))}
            </div>

            {/* 1. HEADER */}
            <header className="c2-header">
                <div className="c2-title-cloud">
                    <h1>WRITER<br />AUTUMN</h1>
                    <span className="c2-subtitle">уютная осень со своей книгой</span>
                </div>
                <div className="c2-header-bottom">
                    <p className="c2-header-lead">
                        Осенний писательский интенсив, где мы НЕ пишем черновик на скорость,
                        а пошагово конструируем книгу.
                    </p>
                    <div className="c2-header-deco" aria-hidden="true">
                        <div className="c2-header-deco-sun" />
                        <span className="c2-header-pill c2-pill-writer">WRITER</span>
                        <span className="c2-header-pill c2-pill-autumn">AUTUMN</span>
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
                    <div className="c2-about-card c2-about-coral">
                        <h3>правим отрывки</h3>
                        <p>
                            помимо общей теории для всей истории, мы работаем с{" "}
                            <strong>ключевыми элементами</strong>: диалоги, лор и тд.
                        </p>
                        <img className="c2-about-card-deco" src="/courses/about-decoration3.svg" alt="" aria-hidden="true" />
                    </div>
                </div>
            </section>

            {/* 3. CALENDAR (mouse-trail) */}
            <TrailSection className="c2-calendar-section" isMobile={isMobile.current}>
                <div className="c2-section-title">
                    <h2>ПРОГРАММА КРАТКО</h2>
                    <span className="c2-subdate">24 сент – 4 окт</span>
                </div>

                <div className="c2-calendar-panel">
                    <div className="c2-calendar-tape t-tl" />
                    <div className="c2-calendar-tape t-tr" />
                    <div className="c2-calendar-tape t-bl" />

                    <div className="c2-calendar-month">
                        <div className="c2-calendar-month-scribble" />
                        <span>сентябрь – октябрь</span>
                    </div>

                    <div className="c2-calendar-grid">
                        {["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"].map(d => (
                            <div key={d} className="c2-calendar-dow">{d}</div>
                        ))}

                        {/* Week 1: 21–27 сентября */}
                        <div className="c2-calendar-cell"><span className="c2-calendar-num">21</span></div>
                        <div className="c2-calendar-cell"><span className="c2-calendar-num">22</span></div>
                        <div className="c2-calendar-cell"><span className="c2-calendar-num">23</span></div>
                        <div className="c2-calendar-cell c-event"><span className="c2-calendar-num">24</span>
                            <img className="c2-day-img" src="/courses/calendar-idea.svg" alt="Идея" />
                            <span className="c2-day-label">Идея!</span>
                        </div>
                        <div className="c2-calendar-cell c-event"><span className="c2-calendar-num">25</span>
                            <img className="c2-day-img" src="/courses/calendar-world.svg" alt="Мир" />
                            <span className="c2-day-label">Мир</span>
                        </div>
                        <div className="c2-calendar-cell c-event"><span className="c2-calendar-num">26</span>
                            <img className="c2-day-img" src="/courses/calendar-characters.svg" alt="Персонажи" />
                            <span className="c2-day-label">Персонажи!</span>
                        </div>
                        <div className="c2-calendar-cell c-event"><span className="c2-calendar-num">27</span>
                            <img className="c2-day-img" src="/courses/calendar-plot.svg" alt="Сюжет" />
                            <span className="c2-day-label">Сюжет!</span>
                        </div>

                        {/* Week 2: 28 сентября – 4 октября */}
                        <div className="c2-calendar-cell"><span className="c2-calendar-num">28</span></div>
                        <div className="c2-calendar-cell"><span className="c2-calendar-num">29</span></div>
                        <div className="c2-calendar-cell"><span className="c2-calendar-num">30</span></div>
                        <div className="c2-calendar-cell"><span className="c2-calendar-num">1</span></div>
                        <div className="c2-calendar-cell c-event"><span className="c2-calendar-num">2</span>
                            <img className="c2-day-img" src="/courses/calendar-dialog.svg" alt="Диалоги" />
                            <span className="c2-day-label">Диалоги</span>
                        </div>
                        <div className="c2-calendar-cell c-event"><span className="c2-calendar-num">3</span>
                            <img className="c2-day-img" src="/courses/calendar-style.svg" alt="Стиль" />
                            <span className="c2-day-label">Стиль</span>
                        </div>
                        <div className="c2-calendar-cell c-event"><span className="c2-calendar-num">4</span>
                            <img className="c2-day-img" src="/courses/calendar-development.svg" alt="Продвижение" />
                            <span className="c2-day-label">Продви-<br />жение</span>
                        </div>

                        {/* Week 3: 5–11 октября */}
                        <div className="c2-calendar-cell c-muted"><span className="c2-calendar-num">5</span></div>
                        <div className="c2-calendar-cell c-muted"><span className="c2-calendar-num">6</span></div>
                        <div className="c2-calendar-cell c-muted"><span className="c2-calendar-num">7</span></div>
                        <div className="c2-calendar-cell c-muted"><span className="c2-calendar-num">8</span></div>
                        <div className="c2-calendar-cell c-muted"><span className="c2-calendar-num">9</span></div>
                        <div className="c2-calendar-cell c-muted"><span className="c2-calendar-num">10</span></div>
                        <div className="c2-calendar-cell c-muted"><span className="c2-calendar-num">11</span></div>

                    </div>

                    <div className="c2-calendar-notes">
                        <ul>
                            <li>7 лекций по 2 часа</li>
                            <li>в зуме в 13:00</li>
                        </ul>
                        <ul>
                            <li>записи лекций до 4 января</li>
                            <li>гайд отправляется до лекции</li>
                        </ul>
                    </div>
                </div>
            </TrailSection>

            {/* 4. CARDS (mouse-trail) */}
            <TrailSection className="c2-cards-section" isMobile={isMobile.current}>
                <div className="c2-section-title t-gold">
                    <h2>КОМУ ПОДХОДИТ?</h2>
                </div>

                <div className="c2-cards-bg">
                    <img className="c2-cards-bg-img" src="/courses/cards-section-bg.svg" alt="" aria-hidden="true" />
                    <div className="c2-cards-row">
                        {TIERS.map(tier => (
                            <div className={`c2-sticky-col ${tier.stickyClass}`} key={tier.id}>
                                <div className={`c2-sticky ${tier.stickyClass}`}>
                                    <div className="c2-sticky-content">
                                        <h4>{tier.stickyTitle}</h4>
                                        <p>{tier.blurb}</p>
                                    </div>
                                </div>
                                <span className={`c2-sticky-badge ${tier.seats ? "" : "is-empty"}`}>
                                    {tier.seats ?? "—"}
                                </span>
                                <div className="c2-sticky-price-wrap">
                                    <button
                                        type="button"
                                        className={`c2-sticky-price ${launching === `sticky-${tier.id}` ? "launching" : ""}`}
                                        onClick={() => triggerLaunch(`sticky-${tier.id}`, PAYMENT_LINKS[tier.id])}
                                    >
                                        {tier.price}
                                    </button>
                                    {renderStars(`sticky-${tier.id}`)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="c2-cta-wrap">
                    <button
                        type="button"
                        className={`c2-cta-pill ${launching === "cards" ? "launching" : ""}`}
                        onClick={() => triggerLaunch("cards", STOREFRONT_LINK)}
                    >
                        ЗАПИСАТЬСЯ<br />на осенний интенсив
                    </button>
                    {renderStars("cards")}
                    <p className="c2-cta-disclaimer">
                        *купить в записи после окончания интенсива - нельзя.
                        запись ТОЛЬКО для участников
                    </p>
                </div>
            </TrailSection>

            {/* 5. BOOK
                TODO: the autumn design replaces this with a new image
                (Figma node 670:2817 on the sonchy-landing page). Still the
                summer artwork here — export blocked by the Figma plan's MCP
                call limit. book.png is also 2.8 MB; re-export as WebP. */}
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
                <p className="c2-book-note">
                    в тарифе «Пробующий» будет короткий фидбэк на отрывки в комментариях
                    с пояснениями на лекции типичных ошибок, полный разбор только для
                    тарифа с консультациями
                </p>
            </section>

            {/* 6. PLAN (mouse-trail) */}
            <TrailSection className="c2-plan-section" isMobile={isMobile.current}>
                <div className="c2-section-title t-pink">
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
                            decoCol1: { src: "/courses/lamp-plan-decoration.svg", className: "deco-lamp" },
                            decoCol3: { src: "/courses/book-plan-decoration.svg", className: "deco-book" },
                        },
                        {
                            n: 2, name: "Мир и исследование",
                            studyBody: "изучение и создание конфликтной среды, где будут происходить действия романа",
                            edit: "сцена первого знакомства с миром и окружением",
                            guide: ["устройство мира", "лорные записки"],
                            decoCol1: { src: "/courses/star-plan-decoration.svg", className: "deco-star" },
                            decoCol2: { src: "/courses/sun-plan-decoration.svg", className: "deco-sun" },
                            decoCol3: { src: "/courses/waves-plan-decoration.svg", className: "deco-waves" },
                        },
                        {
                            n: 3, name: "Главный герой",
                            studyBody: "детальная проработка главного героя и его арки",
                            edit: "экспозиция главного героя или злодея",
                            guide: ["библия персонажей"],
                            decoCol2: { src: "/courses/exclamation-plan-decoration.svg", className: "deco-exclamation" },
                            decoCol3: { src: "/courses/characters-plan-decoration.svg", className: "deco-characters" },
                        },
                        {
                            n: 4, name: "Сюжет и драматургия",
                            studyBody: "выбор сюжетной структуры и типа планирования истории",
                            edit: "синопсис книги",
                            guide: ["поэпизодный план в карточках"],
                            decoCol1: { src: "/courses/check-plan-decoration.svg", className: "deco-check" },
                            decoCol2: { src: "/courses/synopsis-plan-decoration.svg", className: "deco-synopsis" },
                            decoCol3: { src: "/courses/episode-plan-decoration.svg", className: "deco-episode" },
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
                                <div className="c2-plan-cell-title">
                                    <span className="c2-plan-cell-name">{row.name}</span>
                                </div>
                                <p className="c2-plan-cell-body">{row.studyBody}</p>
                                {row.decoCol1 && (
                                    <img
                                        src={row.decoCol1.src}
                                        alt=""
                                        aria-hidden="true"
                                        className={`c2-plan-deco ${row.decoCol1.className}`}
                                    />
                                )}
                            </div>
                            <div className="c2-plan-cell c2-plan-cell-center">
                                <span>{row.edit}</span>
                                {row.decoCol2 && (
                                    <img
                                        src={row.decoCol2.src}
                                        alt=""
                                        aria-hidden="true"
                                        className={`c2-plan-deco ${row.decoCol2.className}`}
                                    />
                                )}
                            </div>
                            <div className="c2-plan-cell c2-plan-cell-right">
                                <ul>
                                    {row.guide.map((g, i) => <li key={i}>{g}</li>)}
                                </ul>
                                {row.decoCol3 && (
                                    <img
                                        src={row.decoCol3.src}
                                        alt=""
                                        aria-hidden="true"
                                        className={`c2-plan-deco ${row.decoCol3.className}`}
                                    />
                                )}
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
                    <h1>WARM WRITER AUTUMN</h1>
                </div>
            </section>

            {/* 8. TARIFF COMPARISON */}
            <section className="c2-tariff-section">
                <div className="c2-section-title t-cream">
                    <h2>СРАВНЕНИЕ ТАРИФОВ</h2>
                </div>

                <div className="c2-tariff-wrapper">
                    <div className="c2-tariff-row c2-tariff-head">
                        <div className="c2-tariff-cell c2-tariff-cell-label" />
                        {TIERS.map((tier, i) => (
                            <div className={`c2-tariff-cell tier-${i + 1}`} key={tier.id}>
                                {tier.tableName}
                            </div>
                        ))}
                    </div>

                    <div className="c2-tariff-body">
                        {TARIFF_ROWS.map(row => (
                            <div className="c2-tariff-row" key={row.label}>
                                <div className="c2-tariff-cell c2-tariff-cell-label">{row.label}</div>
                                {row.values.map((value, i) => (
                                    <div className={`c2-tariff-cell tier-${i + 1}`} key={i}>
                                        {value === true && (
                                            <span className="c2-tariff-check" aria-label="включено">✓</span>
                                        )}
                                        {value === false && (
                                            <span className="c2-tariff-dash" role="img" aria-label="не включено" />
                                        )}
                                        {typeof value === "string" && value}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    <div className="c2-tariff-row c2-tariff-cta">
                        <div className="c2-tariff-cell c2-tariff-cell-label" />
                        {TIERS.map((tier, i) => (
                            <div className="c2-tariff-cell" key={tier.id}>
                                <button
                                    type="button"
                                    className={`c2-tariff-buy tier-${i + 1} ${launching === `tariff-${tier.id}` ? "launching" : ""}`}
                                    onClick={() => triggerLaunch(`tariff-${tier.id}`, PAYMENT_LINKS[tier.id])}
                                >
                                    {tier.price}
                                </button>
                                {renderStars(`tariff-${tier.id}`)}
                            </div>
                        ))}
                    </div>
                </div>

                <p className="c2-tariff-note">
                    * Запись интенсива предоставляется только участникам курса и доступна
                    до 4 января. Успейте забронировать место на потоке.
                </p>
            </section>

            <div className="c2-footer-purple" />
        </div>
    );
};

export default Courses;
