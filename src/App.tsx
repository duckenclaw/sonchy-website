import { Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage'
import Header from './components/Header';
import BlankPage from './components/BlankPage';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const blocks = [
    {
      image: viteLogo,
      title: "ОБУЧЕНИЕ",
      description: "лекции, материалы, курсы",
      alt: "education",
      position: "left" as const,
      route: "обучение"
    },
    {
      image: reactLogo,
      title: "услуги",
      description: "со мной очень приятно работать",
      alt: "services",
      position: "right" as const,
      route: "услуги"
    },
    {
      image: viteLogo,
      title: "обо мне",
      description: "тут я выпендриваюсь",
      alt: "about",
      position: "left" as const,
      route: "обо-мне"
    }
  ];

  const HomePage = () => (
    <div className="app">
      <Header />
      <MainPage blocks={blocks} />
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/:section" element={<BlankPage />} />
    </Routes>
  )
}

export default App
