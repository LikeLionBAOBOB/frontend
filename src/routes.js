import HomePage from './pages/HomePage';
import SitesPage from './pages/SitesPage';

const routes = [
    {
        path: '/',
        element: <HomePage />,
    },
    {
        path: '/sites',
        element: <SitesPage />,
    },
];

export default routes;