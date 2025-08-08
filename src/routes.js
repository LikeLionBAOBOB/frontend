import HomePage from './pages/HomePage';
import SitesPage from './pages/SitesPage';
import SearchPage from './pages/SearchPage';

const routes = [
    {
        path: '/',
        element: <HomePage />,
    },
    {
        path: '/sites',
        element: <SitesPage />,
    },
    {
        path: '/search',
        element: <SearchPage />,
    },
];

export default routes;