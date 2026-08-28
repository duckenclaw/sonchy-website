import InfoPanel from '@/components/info-panel/info-panel';
import type { PanelBubble } from '@/components/info-panel/info-panel';
import { PageNav } from '@/components/page-nav/page-nav';
import PageLayout from '@/components/page-layout/page-layout';

const BUBBLES: PanelBubble[] = [
  { text: 'Нужно подтянуть креатив в команде?' },
  { text: 'Или дать ей возможность взглянуть на работу под другим углом?' },
  {
    text: 'Провожу лекции и воркшопы для театральных фестивалей, TEDX, Яндекса, Британской школы Дизайна и другим.',
    alignEnd: true,
  },
  { text: 'Материал подбираем в зависимости от запроса и времени.', alignEnd: true },
  { text: 'Можем экспериментировать с форматом!', alignEnd: true },
];

function LecturesPage() {
  return (
    <PageLayout
      name="lectures"
      title="ЛЕКЦИИ/ВОРКШОПЫ"
      bodyClass="page-bg-purple"
      headerDesktopOnly
    >
      <InfoPanel
        variant="lectures"
        mobileTitle={
          <>
            ЛЕКЦИИ/
            <br />
            ВОРКШОПЫ
          </>
        }
        character={{
          src: '/lectures/outline.webp',
          alt: 'Decorative character illustration for lectures section',
        }}
        bubbles={BUBBLES}
        logos={{
          desktop: '/lectures/logos.webp',
          mobile: '/lectures/logos-mobile.webp',
          alt: 'Logos of companies including Yandex, TEDX, and British School of Design',
          afterBubble: 3,
        }}
        price="от 450$"
        actions={[{ label: 'СВЯЗАТЬСЯ', style: 'contact' }]}
      />
      <PageNav />
    </PageLayout>
  );
}

export default LecturesPage;
