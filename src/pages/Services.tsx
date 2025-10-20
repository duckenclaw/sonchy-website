import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.tsx';
import ServiceBox from '../components/ServiceBox.tsx';
import { useBodyClass } from '../hooks/useBodyClass';
import { ROUTES } from '../constants/routes';
import { PageType } from '../types/pages';
import consultingImage from '/consulting.png';
import lecturesImage from '/lectures.png';
import projectsImage from '/projects.png';

const Services = () => {
  const navigate = useNavigate();

  // Apply services-specific background styling
  useBodyClass('services-page-background');

  const services = [
    {
      id: 'consulting',
      image: consultingImage,
      title: "КОНСУЛЬТАЦИИ",
      description: "Частные консультации почти на любой запрос. Для компаний и частников.",
      svgPath: "M251.884 479.681C250.774 479.89 249.643 479.963 248.516 479.9L174.192 475.767C173.425 475.724 172.655 475.737 171.889 475.805L126.379 479.848C125.289 479.944 124.192 479.914 123.109 479.755L83.0762 473.887C81.5398 473.662 79.9788 473.661 78.4424 473.886L41.4717 479.289C38.4801 479.726 35.4269 479.183 32.7695 477.741L8.40039 464.517C3.84969 462.047 1.03335 457.268 1.07812 452.091L3.69727 149.284V149.271L3.69629 149.256L1.20605 25.293C1.08987 19.5099 4.5423 14.25 9.89453 12.0566L34.3242 2.0459C36.0089 1.3555 37.8122 1.00004 39.6328 1H301.566C302.874 1 304.176 1.18288 305.433 1.54395L344.865 12.873C350.866 14.5969 355 20.0859 355 26.3291V448.657C355 455.39 350.207 461.169 343.59 462.415L251.884 479.681Z",
      viewBox: "0 0 356 481",
      route: ROUTES.CONSULTING,
      alt: "consulting"
    },
    {
      id: 'lectures',
      image: lecturesImage,
      title: "ЛЕКЦИИ/ВОРКШОПЫ",
      description: "Подтянем уровень креатива, сторителлинга и уверенность в себе.",
      svgPath: "M104.091 487.67C105.218 487.886 106.367 487.962 107.513 487.897L181.789 483.697C182.57 483.653 183.352 483.667 184.131 483.737L229.594 487.843C230.701 487.943 231.817 487.911 232.917 487.747L272.886 481.791C274.447 481.558 276.034 481.558 277.596 481.79L314.455 487.267C317.49 487.717 320.589 487.159 323.275 485.677L347.687 472.209C352.189 469.725 354.968 464.974 354.924 459.832L352.303 151.768V151.753L352.304 151.739L354.798 25.4756C354.912 19.724 351.496 14.4879 346.186 12.2754L321.706 2.07715C320 1.36637 318.169 1 316.321 1H54.4668C53.1385 1.00001 51.817 1.18914 50.542 1.56152L11.0752 13.0889C5.10433 14.8328 1 20.307 1 26.5273V456.364C1.00004 463.081 5.77082 468.851 12.3682 470.114L104.091 487.67Z",
      viewBox: "0 0 356 489",
      route: ROUTES.LECTURES,
      alt: "lectures"
    },
    {
      id: 'projects',
      image: projectsImage,
      title: "ПРОЕКТЫ",
      description: "Открыта к проектам! Сценарии, продюсирование, нарративный дизайн",
      svgPath: "M104.116 1.31934C105.226 1.11045 106.357 1.03692 107.484 1.09961L181.808 5.2334C182.575 5.27609 183.345 5.26334 184.111 5.19531L229.621 1.15234C230.711 1.05555 231.808 1.08648 232.891 1.24512L272.924 7.11328C274.46 7.33844 276.021 7.33879 277.558 7.11426L314.528 1.71094C317.52 1.27374 320.573 1.8168 323.23 3.25879L347.6 16.4834C352.15 18.9528 354.967 23.7318 354.922 28.9092L352.303 331.716V331.729L352.304 331.744L354.794 455.707C354.91 461.49 351.458 466.75 346.105 468.943L321.676 478.954C319.991 479.644 318.188 480 316.367 480H54.4336C53.1259 480 51.8242 479.817 50.5674 479.456L11.1348 468.127C5.1343 466.403 1 460.914 1 454.671V32.3428L1.01367 31.7148C1.30098 25.2532 5.99999 19.7918 12.4102 18.585L104.116 1.31934Z",
      viewBox: "0 0 356 481",
      route: ROUTES.PROJECTS,
      alt: "projects"
    }
  ];

  return (
    <div className="app">
      <Header
        currentPage={PageType.SERVICES}
      />
      <div className="services-page">
        <div className="services-container">
          <div className="services-flexbox">
            {services.map((service, index) => (
              <ServiceBox
                key={service.id}
                shouldFlipOnMobile={index === 1}
                image={service.image}
                title={service.title}
                description={service.description}
                svgPath={service.svgPath}
                viewBox={service.viewBox}
                route={service.route}
                alt={service.alt}
              />
            ))}
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

export default Services;
