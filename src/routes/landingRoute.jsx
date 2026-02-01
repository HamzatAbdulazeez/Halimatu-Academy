import LandingLayout from "../layouts/landing";
import LandingHomepage from "../modules/Home";
import AboutUs from "../modules/Home/About";
import NotFoundPage from "../components/ui/NotFoundPage";
import Knowledge from "../modules/Home/Knowledge";
import Curriculum from "../modules/Home/Curriculum";
import ContactUsPage from "../modules/Home/Contact";
import SchedulePage from "../modules/Home/Schedule";
import FAQsPage from "../modules/Home/FAQs";

// Define landing routes

export const landingRooutes = [
  {
    path: "/",
    element: <LandingLayout />,
    children: [
      {
        index: true,
        element: <LandingHomepage />,
      },
      {
        path: 'about',
        element: <AboutUs />,
      },
      {
        path: 'knowledge',
        element: <Knowledge />,
      },
      {
        path: 'curriculum',
        element: <Curriculum />,
      },
      {
        path: 'contact',
        element: <ContactUsPage />,
      },
      {
        path: 'schedule',
        element: <SchedulePage />,
      },
      {
        path: 'faqs',
        element: <FAQsPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
];
