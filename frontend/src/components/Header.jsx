// import React from 'react';
// import '../assets/Header.css';

// const Header = () => {
//   return (
//     <header className="narravance-header">
//       <div className="header-content container text-center py-3">
//         <h5 className="mb-0 fw-bold">
//           Narravance FULL-STACK ENGINEER: SCREENING TASK
//         </h5>
//       </div>
//     </header>
//   );
// };

// export default Header;
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../assets/Header.css';

const Header = () => {
  const location = useLocation();

  return (
    <header className="narravance-header">
      <div className="container d-flex justify-content-between align-items-center py-3">
        <h6 className="mb-0 fw-bold text-white">
          Narravance FULL-STACK ENGINEER: SCREENING TASK
        </h6>

        <nav>
          <Link
            to="/"
            className={`nav-link-header ${location.pathname === '/' ? 'active' : ''}`}
          >
            Add Task
          </Link>
          <Link
            to="/tasks"
            className={`nav-link-header ${location.pathname === '/tasks' ? 'active' : ''}`}
          >
            Tasks
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
