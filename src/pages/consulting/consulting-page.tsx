import PageLayout from '@/components/page-layout/page-layout';
import { PageNav } from '@/components/page-nav/page-nav';
import ConsultingCard from './consulting-card';
import { CONSULTING_PACKAGES } from './consulting-data';
import './consulting.css';

function ConsultingPage() {
  return (
    <PageLayout
      name="consulting"
      title="КОНСУЛЬТАЦИИ"
      headerVariant="consulting"
      bodyClass="page-bg-purple"
    >
      <div className="consulting-flexbox">
        {CONSULTING_PACKAGES.map((pkg) => (
          <ConsultingCard key={pkg.id} {...pkg} />
        ))}
      </div>
      <PageNav />
    </PageLayout>
  );
}

export default ConsultingPage;
