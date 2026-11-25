import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home2 from './pages/Home2';
import HomeA from './pages/HomeA';
import HomeB from './pages/HomeB';
import HomeC from './pages/HomeC';
import HomeD from './pages/HomeD';
import Versions from './pages/Versions';
import Home5 from './pages/Home5';
import Portfolio2 from './pages/Portfolio2';
import About2 from './pages/About2';
import Contact from './pages/Contact';
import { Privacy, Terms } from './pages/Legal';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home2 />} />
        <Route path="home-5" element={<Home5 />} />
        <Route path="home-1" element={<HomeA />} />
        <Route path="home-2" element={<HomeB />} />
        <Route path="home-3" element={<HomeC />} />
        <Route path="home-4" element={<HomeD />} />
        <Route path="versions" element={<Versions />} />
        <Route path="portfolio" element={<Portfolio2 />} />
        <Route path="about-us" element={<About2 />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy-policy" element={<Privacy />} />
        <Route path="terms-condition" element={<Terms />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
