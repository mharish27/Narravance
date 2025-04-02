// import React from "react";
// import CreateTaskPage from "./pages/CreateTaskPage";
// import Header from './components/Header';

// function App() {
//   return (
//     <>
//       <Header />
//       <CreateTaskPage />
//     </>
//   );
// }

// export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import CreateTaskPage from './pages/CreateTaskPage';
import TasksPage from './pages/TasksPage';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<CreateTaskPage />} />
        <Route path="/tasks" element={<TasksPage />} />
      </Routes>
    </Router>
  );
};

export default App;
