import NavBlock from './NavBlock';

interface MainPageProps {
  blocks: Array<{
    image: string;
    title: string;
    description: string;
    alt?: string;
    position: 'left' | 'right';
    route: string;
  }>;
}

const MainPage = ({ blocks }: MainPageProps) => {
  return (
    <div className="nav-blocks">
      <nav className="nav">
        {blocks.map((block, index) => (
          <NavBlock
            key={index}
            image={block.image}
            title={block.title}
            description={block.description}
            alt={block.alt}
            position={block.position}
            route={block.route}
          />
        ))}
      </nav>
    </div>
  );
};

export default MainPage;
