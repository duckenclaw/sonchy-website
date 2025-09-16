import { useEffect } from 'react';
import Header from './Header';
import ConsultingBlock from './ConsultingBlock';
import gigaImage from '/giga.png';
import expressImage from '/express.png';

const Consulting = () => {
  // Apply consulting-specific background styling
  useEffect(() => {
    document.body.classList.add('consulting-page-background');
    
    // Cleanup function to remove the class when component unmounts
    return () => {
      document.body.classList.remove('consulting-page-background');
    };
  }, []);

  return (
    <div className="app">
      <Header titles={["Главная", "Контакты", "Услуги"]} routes={["", "contact", "services"]} currentPage="КОНСУЛЬТАЦИИ"/>
      <div className="consulting-page">
        <div className="consulting-container">
          <div className="consulting-flexbox">
            <ConsultingBlock
              image={gigaImage}
              title={"ГИГА"}
              bonuses={["1,5 - 2 часа", "2 недели сопровождение в чате", "PDF с гайдами и примерами для реализации проекта"]}
              description={"Подходит для больших организаций или масштабных запросов, как стратегия развития бренда на год или TOV компании."}
              price={"650$"}
              alt={"giga"}
            />
            <ConsultingBlock
              image={expressImage}
              title={"ЭКСПРЕСС"}
              bonuses={["45 мин. - 1 час", "2 дня сопровождения в чате", "список источников/референсов", "без конспектов и материалов", "можно делать видеозапись"]}
              description={"Хватит времени, чтобы обсудить определённый аспект проекта, побрейнштормить или получить отклик на материал."}
              price={"210$"}
              alt={"express"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Consulting;
