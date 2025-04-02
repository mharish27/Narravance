import React, { useEffect, useState } from 'react';
import { getTaskNames } from '../apis/taskService';
import './SideNavBar.css';

const SideNavBar = ({ onSelect }) => {
  const [taskNames, setTaskNames] = useState([]);

  useEffect(() => {
    getTaskNames()
    .then(setTaskNames)
    .catch(console.error);
  }, []);

  return (
    <div className="sidenav-container">
      <h6 className="px-3 pt-3 text-black fw-bold">Tasks</h6>
      <ul className="sidenav-list">
        {taskNames.map((name, idx) => (
          <li key={idx} className="sidenav-item" onClick={() => onSelect(name)}>
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideNavBar;
