import HomePage from './pages/HomePage';
import SitesPage from './pages/SitesPage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import LoginPagead from './pages/LoginPage_book';
import HomePageAdmin from './pages/HomePage_admin';

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
];

export default routes;