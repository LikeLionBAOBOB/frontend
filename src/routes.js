import HomePage from './pages/HomePage';
import SitesPage from './pages/SitesPage';
import SitesPageAd from './pages/SitesPage_ad';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import LoginPagead from './pages/LoginPage_book';
import HomePageAdmin from './pages/HomePage_admin';
import SeatPage from './pages/seatmap';
import Mylib from './pages/mylib';
import MapPage from './pages/map';
import AboutPage from './pages/AboutPage';
import AboutPageAd from './pages/AboutPage_ad';
import ContactPage from './pages/ContactPage';
import ContactPageAd from './pages/ContactPage_ad';
import DetailLib from './pages/detaillib';
import { Navigate } from "react-router-dom";


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
        path: '/sites-ad',
        element: <SitesPageAd />,
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
    {
        path: '/map',
        element: <MapPage />,
    },
    { path: '/detaillib/:libraryId',
        element: <DetailLib /> },
        { path: '/detaillib/:libraryId', 
            element: <DetailLib /> },
            { path: '/detaillib', 
                element: <Navigate to="/detaillib/111179" replace /> },
                { path: '*', 
                    element: <div>404</div> },
    {
        path: '/about',
        element: <AboutPage />,
    },
    {
        path: '/about-ad',
        element: <AboutPageAd />,
    },
    {
        path: '/contact',
        element: <ContactPage />,
    },
    {
        path: '/contact-ad',
        element: <ContactPageAd />,
    },
];

export default routes;