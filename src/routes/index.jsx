import { landingRooutes } from "./landingRoute";
import { authRoutes } from "./authRoutes";
import { studentRoutes } from "./studentRoutes";
import { adminRoutes } from "./adminRoutes";

export const routes = [
  ...landingRooutes,
  ...authRoutes,
  ...studentRoutes,
  ...adminRoutes,
];