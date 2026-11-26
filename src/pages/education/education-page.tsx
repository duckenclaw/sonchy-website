import { useCallback, useState } from 'react';

import PageLayout from '@/components/page-layout/page-layout';
import LectureGallery from './lecture-gallery';
import LectureModal from './lecture-modal';
import { LECTURES } from './lectures-data';
import type { Lecture } from './lecture';
import './education.css';

/** Free materials have no shop link — they are mailed from inside the modal. */
function openBuyLink(lecture: Lecture) {
  if (!lecture.buyLink) return;
  window.open(lecture.buyLink, '_blank', 'noopener,noreferrer');
}

function EducationPage() {
  const [selected, setSelected] = useState<Lecture | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState(0);

  const handleDetailsClick = useCallback((lecture: Lecture, position: number) => {
    setSelected(lecture);
    setModalPosition(position);
    setModalOpen(true);
  }, []);

  return (
    <PageLayout
      name="education"
      title="ОБУЧЕНИЕ"
      headerVariant="education"
      bodyClass="page-bg-purple"
      headerDesktopOnly
    >
      <LectureGallery
        lectures={LECTURES}
        onDetailsClick={handleDetailsClick}
        onBuyClick={openBuyLink}
      />

      <LectureModal
        lecture={selected}
        isOpen={isModalOpen}
        position={modalPosition}
        onClose={() => setModalOpen(false)}
        onBuyClick={() => selected && openBuyLink(selected)}
      />
    </PageLayout>
  );
}

export default EducationPage;
