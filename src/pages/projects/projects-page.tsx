import InfoPanel from '@/components/info-panel/info-panel';
import type { PanelBubble } from '@/components/info-panel/info-panel';
import { PageNav } from '@/components/page-nav/page-nav';
import PageLayout from '@/components/page-layout/page-layout';

const BUBBLES: PanelBubble[] = [
  {
    text: 'Пишу сценарии, создаю концепты, перфоманс-маркетинг и продюсирую.',
    alignEnd: true,
  },
  { text: 'Делаю в целом всё, что связано со сторителлингом и креативом.', alignEnd: true },
  {
    text: 'Всегда открыта к новым форматам, и понимаю, что важна не только эффектность, но и результат.',
  },
  { text: 'Также, у меня большая база аутсорса для проектов.' },
];

function ProjectsPage() {
  return (
    <PageLayout
      name="projects"
      title="ПРОЕКТНАЯ РАБОТА"
      bodyClass="page-bg-purple"
      headerDesktopOnly
    >
      <InfoPanel
        variant="projects"
        mobileTitle={
          <>
            ПРОЕКТНАЯ
            <br />
            РАБОТА
          </>
        }
        character={{
          src: '/projects/outline.webp',
          alt: 'Decorative character illustration for projects section',
        }}
        bubbles={BUBBLES}
        actions={[
          { label: 'ПОРТФОЛИО', style: 'portfolio' },
          { label: 'СВЯЗАТЬСЯ', style: 'contact' },
        ]}
      />
      <PageNav />
    </PageLayout>
  );
}

export default ProjectsPage;
