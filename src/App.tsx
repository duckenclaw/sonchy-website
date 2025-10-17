import { Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage.tsx'
import Header from './components/Header';
import BlankPage from './components/BlankPage';
import Services from './pages/Services.tsx';
import Consulting from './pages/Consulting.tsx';
import Lectures from "./pages/Lectures.tsx";
import Projects from "./pages/Projects.tsx";
import educationLogo from '/education.png'
import servicesLogo from '/services.png'
import aboutLogo from '/about.png'
import Courses from "./pages/Courses.tsx";

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
      title: "УСЛУГИ",
      description: "со мной очень приятно работать",
      alt: "services",
      position: "right" as const,
      route: "services"
    },
    {
      image: aboutLogo,
      title: "ОБО МНЕ",
      description: "тут я выпендриваюсь",
      alt: "about",
      position: "left" as const,
      route: "about"
    }
  ];

  const HomePage = () => (
    <div className="app">
      <Header titles={["Главная", "Контакты"]} routes={["", "contacts"]} currentPage="СОНЧИ УТОЧКИНА" />
      <MainPage blocks={blocks} />
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/services" element={<Services />} />
      <Route path="/services/consulting" element={<Consulting />} />
      <Route path="/services/lectures" element={<Lectures />} />
      <Route path="/services/projects" element={<Projects />} />
        <Route path="/courses" element={<Courses />} />
      <Route path="/:section" element={<BlankPage />} />
    </Routes>
  )
}

export default App
