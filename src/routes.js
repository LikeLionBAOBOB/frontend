import HomePage from './pages/HomePage';
import SitesPage from './pages/SitesPage';
import LoginPage from './pages/LoginPage';
import LoginPagead from './pages/LoginPage_book';
import Seatmappage from './pages/seatmap';

const routes = [
    {
        path: '/',
        element: <HomePage />,
    },
    {
        path: '/sites',
        element: <SitesPage />,
    },
    {   path: '/login',
        element: <LoginPage />,
    },{
            path: '/login-ad',
        element: <LoginPagead />,
    },
    {
            path: '/seatmap',
        element: <Seatmappage />,
    },
];

export default routes;