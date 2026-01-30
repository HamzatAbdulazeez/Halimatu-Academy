import { landingRooutes } from "./landingRoute";
import { authRoutes } from "./authRoutes";
import { studentRoutes } from "./studentRoutes";
export const routes = [
  ...landingRooutes,
  ...authRoutes,
  ...studentRoutes,
];