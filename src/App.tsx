import { Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage'
import Header from './components/Header';
import BlankPage from './components/BlankPage';
import educationLogo from '/education.png'
import servicesLogo from '/services.png'
import aboutLogo from '/about.png'
import './App.css'

function App() {
  const blocks = [
    {
      image: educationLogo,
      title: "ОБУЧЕНИЕ",
      description: "лекции, материалы, курсы",
      alt: "education",
      position: "left" as const,
      route: "education"
    },
    {
      image: servicesLogo,
      title: "услуги",
      description: "со мной очень приятно работать",
      alt: "services",
      position: "right" as const,
      route: "services"
    },
    {
      image: aboutLogo,
      title: "обо мне",
      description: "тут я выпендриваюсь",
      alt: "about",
      position: "left" as const,
      route: "about"
    }
  ];

  const HomePage = () => (
    <div className="app">
      <Header titles={["ГЛАВНАЯ", "КОНТАКТЫ"]} routes={["", "contacts"]} />
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
