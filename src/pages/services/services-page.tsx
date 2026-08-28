import PageLayout from '@/components/page-layout/page-layout';
import { PageReturnButton } from '@/components/page-nav/page-nav';
import ServiceBox from './service-box';
import { SERVICES } from './services-data';
import './services.css';

function ServicesPage() {
  return (
    <PageLayout
      name="services"
      title="УСЛУГИ"
      headerVariant="services"
      bodyClass="page-bg-services"
    >
      <div className="services-flexbox">
        {SERVICES.map((service, index) => (
          <ServiceBox key={service.id} {...service} flipOutlineOnMobile={index === 1} />
        ))}
      </div>
      <PageReturnButton />
    </PageLayout>
  );
}

export default ServicesPage;
