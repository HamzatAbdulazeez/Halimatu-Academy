import LandingLayout from "../layouts/landing";
import LandingHomepage from "../modules/Home";
import AboutUs from "../modules/Home/About";
import NotFoundPage from "../components/ui/NotFoundPage";
import Knowledge from "../modules/Home/Knowledge";
import Curriculum from "../modules/Home/Curriculum";
import ContactUsPage from "../modules/Home/Contact";

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
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
];
