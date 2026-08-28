import { useCallback, useState } from 'react';

import PageLayout from '@/components/page-layout/page-layout';
import LectureModal from './lecture-modal';
import LectureSlider from './lecture-slider';
import { LECTURES } from './lectures-data';
import type { Lecture } from './lecture';
import './education.css';

function openBuyLink(lecture: Lecture) {
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
      <LectureSlider
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
