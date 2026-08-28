import { AppShell } from '@/components/page-layout/page-layout';
import MouseStickers from '@/components/mouse-stickers/mouse-stickers';
import NavBlock from './nav-block';
import { HOME_BLOCKS } from './home-blocks';
import './home.css';

function HomePage() {
  return (
    <AppShell title="СОНЧИ УТОЧКИНА">
      <MouseStickers />
      <div className="nav-blocks">
        <nav className="nav">
          {HOME_BLOCKS.map((block) => (
            <NavBlock key={block.route} {...block} />
          ))}
        </nav>
      </div>
    </AppShell>
  );
}

export default HomePage;
