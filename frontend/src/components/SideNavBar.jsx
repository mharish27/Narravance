import React, { useEffect, useState } from 'react';
import { getTaskNames } from '../apis/taskService';
import './SideNavBar.css';

const SideNavBar = ({ onSelect }) => {
  const [taskNames, setTaskNames] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getTaskNames()
    .then(setTaskNames)
    .catch(console.error);
  }, []);

  const handleSelect = (name) => {
    setSelected(name);    // highlight this item
    onSelect(name);       // notify parent
  };

  return (
    <div className="sidenav-container">
      <h6 className="px-3 pt-3 text-black fw-bold">Tasks</h6>
      <ul className="sidenav-list">
        {taskNames.map((name, idx) => {
            const classes = ["sidenav-item"];
            if (name === selected) {
            classes.push("selected");
            }
            return (
            <li key={idx} className={classes.join(" ")} onClick={() => handleSelect(name)}>
                {name}
            </li>
            );
        })}
      </ul>
    </div>
  );
};

export default SideNavBar;
