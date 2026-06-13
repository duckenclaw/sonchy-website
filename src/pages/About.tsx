import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.tsx';
import { useBodyClass } from '../hooks/useBodyClass';
import { ROUTES } from '../constants/routes';

const About = () => {
  const navigate = useNavigate();
  useBodyClass('about-page-background');

  return (
    <div className="app">
      <Header currentPage="ОБО МНЕ" />
      <div className="about-page">
        <div className="about-container">

          <div className="about-grid">

            {/* 1. Образование */}
            <div className="about-block about-block-education">
              <h2 className="about-block-title">Образование.</h2>
              <p className="about-block-text">
                Художественный переводчик с французского, Литературный институт им. А. М. Горького.
              </p>
              <p className="about-block-text">
                Сейчас только перевожу продукты в доме, но меня научили адаптировать стиль к любому жанру текста, что помогло в работе.
              </p>
              <img
                className="about-block-decoration"
                src="/about-education.png"
                alt=""
                width={95}
                height={111}
              />
            </div>

            {/* 2. Писательница */}
            <div className="about-block about-block-writer">
              <div className="about-block-writer-content">
                <h2 className="about-block-title">Писательница.</h2>
                <p className="about-block-text">
                  Да, с книжками, да издательство выбрало.
                </p>
                <p className="about-block-text">
                  Сейчас пишу фэнси версию Ведьмака с гиперпоп ведьмами. И ещё делаем из неё визуальную новеллу!
                </p>
                <p className="about-block-text">
                  Я так развлекаюсь.
                </p>
              </div>
              <img
                className="about-block-decoration"
                src="/about-writer0.png"
                alt=""
                width={131}
                height={173}
              />
              <img
                className="about-block-decoration"
                src="/about-writer1.png"
                alt=""
                width={88}
                height={92}
              />
            </div>

            {/* 3. Новая книжка */}
            <div className="about-block about-block-new-book">
              <h2 className="about-block-title">Новая книжка!</h2>
              <div className="about-block-center-decoration">
                <img
                  className="about-block-decoration"
                  src="/about-new_book.png"
                  alt=""
                  width={178}
                  height={157}
                />
              </div>
            </div>

            {/* 4. Рецензия на «анти-ты» */}
            <div className="about-block about-block-anti-ty">
              <h2 className="about-block-title">Рецензия на «анти-ты»</h2>
              <div className="about-block-center-decoration">
                <img
                  className="about-block-decoration"
                  src="/about-anti_ty.png"
                  alt=""
                  width={190}
                  height={160}
                />
              </div>
            </div>

            {/* 5. Консультантка */}
            <div className="about-block about-block-consultant">
              <h2 className="about-block-title">Консультантка.</h2>
              <p className="about-block-text">
                Работаю креативной консультанткой, потому что мне нравится вариативность.
              </p>
              <p className="about-block-text">
                Последние три года над проектами в геймдеве как нарративный дизайнер.
              </p>
              <p className="about-block-text">
                Можно посмотреть что я могу через портфолио
              </p>
              <img
                className="about-block-decoration"
                src="/about-consultant.png"
                alt=""
                width={145}
                height={185}
              />
            </div>

            {/* 6. Лекторка — spans 2 rows */}
            <div className="about-block about-block-lector">
              <h2 className="about-block-title">Лекторка.</h2>
              <p className="about-block-text">
                Помимо всего я обожаю преподавать. Провожу тематические лекции, воркшопы, недавно начала вести группы и курсы.
              </p>
              <p className="about-block-text">
                Материалы авторские, потому что у меня загон на эту тему
              </p>
              <div className="about-lector-buttons">
                <button type="button" className="about-lector-link-btn" disabled>
                  Открытая лекция
                </button>
                <button type="button" className="about-lector-link-btn" disabled>
                  Учебные материалы
                </button>
              </div>
              <img
                className="about-block-decoration"
                src="/about-lector.png"
                alt=""
                width={120}
                height={181}
              />
            </div>

            {/* 7. Сеттерс */}
            <div className="about-block about-block-setters">
              <h2 className="about-block-title">Сеттерс о моей профессии</h2>
              <div className="about-block-center-decoration">
                <img
                  className="about-block-decoration"
                  src="/about-setter.png"
                  alt=""
                  width={204}
                  height={153}
                />
              </div>
            </div>

            {/* 8. Ещё чуть-чуть обо мне */}
            <div className="about-block about-block-more">
              <h2 className="about-block-title">Ещё чуть-чуть обо мне!</h2>
              <p className="about-block-text">
                Обожаю видеоигры, занудные эсе против капитализма и ещё во мне осталось немного любви к литературе.
              </p>
              <p className="about-block-text">
                Мои соц. сети в основном о попкультуре и разных сторителлинговских приёмах.
              </p>
              <img
                className="about-block-decoration"
                src="/about-more0.png"
                alt=""
                width={123}
                height={148}
              />
              <img
                className="about-block-decoration"
                src="/about-more1.png"
                alt=""
                width={106}
                height={98}
              />
            </div>

            {/* 9. Визуальная новелла */}
            <div className="about-block about-block-visual-novel">
              <h2 className="about-block-title">Визуальная новелла!</h2>
              <div className="about-block-center-decoration">
                <img
                  className="about-block-decoration"
                  src="/about-visual_novel.png"
                  alt=""
                  width={173}
                  height={113}
                />
              </div>
            </div>

          </div>

          <button
            type="button"
            className="services-return-button"
            onClick={() => navigate(`/${ROUTES.HOME}`)}
            aria-label="Return to main page"
          >
            ВЕРНУТЬСЯ НА ГЛАВНУЮ
          </button>

        </div>
      </div>
    </div>
  );
};

export default About;
