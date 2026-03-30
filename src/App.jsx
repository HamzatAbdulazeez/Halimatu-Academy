import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from 'sonner';
import { LanguageProvider } from "./context/LanguageContext";
import { routes } from './routes'; 

// Recursive route renderer
const renderRoutes = (routes) => {
  return routes.map((route, index) => (
    <Route 
      key={index} 
      path={route.path} 
      element={route.element}
    >
      {route.children && renderRoutes(route.children)}
    </Route>
  ));
};

const App = () => {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          {renderRoutes(routes)}
        </Routes>
        
        <Toaster position="top-center" richColors closeButton />
      </Router>
    </LanguageProvider>
  );
};

export default App;