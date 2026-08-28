import PageLayout from '@/components/page-layout/page-layout';
import { PageReturnButton } from '@/components/page-nav/page-nav';
import { ABOUT_BLOCKS } from './about-blocks';
import type { AboutBlock, AboutDecoration } from './about-blocks';
import './about.css';

function Decoration({ src, width, height }: AboutDecoration) {
  return (
    <img
      className="about-block-decoration"
      src={src}
      alt=""
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
    />
  );
}

function AboutCard({ id, title, texts, decorations, centeredDecoration, links }: AboutBlock) {
  const body = (
    <>
      <h2 className="about-block-title">{title}</h2>
      {texts?.map((text) => (
        <p className="about-block-text" key={text}>
          {text}
        </p>
      ))}
    </>
  );

  return (
    <div className={`about-block about-block-${id}`}>
      {/* The writer card right-aligns its copy, which needs its own wrapper */}
      {id === 'writer' ? <div className="about-block-writer-content">{body}</div> : body}

      {links && (
        <div className="about-lector-buttons">
          {links.map((label) => (
            <button type="button" className="about-lector-link-btn" key={label} disabled>
              {label}
            </button>
          ))}
        </div>
      )}

      {centeredDecoration ? (
        <div className="about-block-center-decoration">
          {decorations.map((decoration) => (
            <Decoration key={decoration.src} {...decoration} />
          ))}
        </div>
      ) : (
        decorations.map((decoration) => <Decoration key={decoration.src} {...decoration} />)
      )}
    </div>
  );
}

function AboutPage() {
  return (
    <PageLayout name="about" title="ОБО МНЕ" bodyClass="page-bg-about">
      <div className="about-grid">
        {ABOUT_BLOCKS.map((block) => (
          <AboutCard key={block.id} {...block} />
        ))}
      </div>
      <PageReturnButton />
    </PageLayout>
  );
}

export default AboutPage;
