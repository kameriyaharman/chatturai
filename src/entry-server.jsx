import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from './App';
import { PAGES } from './seo';
import BookACall from './pages/BookACall';

export { PAGES };

export function render(url) {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );
}

export function renderBook() {
  return renderToString(<BookACall />);
}
