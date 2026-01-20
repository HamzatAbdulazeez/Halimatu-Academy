import LandingLayout from "../layouts/landing";
import LandingHomepage from "../modules/Home";
import AboutUs from "../modules/Home/About";


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
    ],
  },
];
