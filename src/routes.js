import HomePage from './pages/HomePage';
import SitesPage from './pages/SitesPage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import LoginPagead from './pages/LoginPage_book';
import HomePageAdmin from './pages/HomePage_admin';
import SeatPage from './pages/seatmap';
import Mylib from './pages/mylib';

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
    {   path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/login-ad',
        element: <LoginPagead />,
    },
    {
        path: '/home-ad',
        element: <HomePageAdmin />,
    },
        {
        path: '/admin-seat',
        element: <SeatPage />,
    },
            {
        path: '/mylib',
        element: <Mylib />,
    },
];

export default routes;