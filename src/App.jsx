import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home2 from './pages/Home2';
import Portfolio2 from './pages/Portfolio2';
import About2 from './pages/About2';
import Contact from './pages/Contact';
import { Privacy, Terms } from './pages/Legal';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home2 />} />
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
