import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import BookACall from './pages/BookACall';
import './book.css';

const root = document.getElementById('root');
const app = <StrictMode><BookACall /></StrictMode>;
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
