import React, { useState } from 'react';
import SideNavBar from '../components/SideNavBar.jsx';
import { getTaskData } from '../apis/taskService.js';
import CountryYearChart from '../components/CountryYearChart.jsx';
import RiskLevelCharts from '../components/RiskLevelCharts.jsx';

const TasksPage = () => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskData, setTaskData] = useState([]);

  const handleTaskSelect = async (taskName) => {
    setSelectedTask(taskName);
    try {
      const raw = await getTaskData(taskName);
      // raw = [{"task_name":"test","country":"China","discovery_date":"2024-12-08 00:00:00","source":"Provider B","risk_level":5},...]

      // 1) Convert discovery_date => year
      // 2) For the first chart, we want { country, year, count }
      //    For the second chart, we want { country, year, severity, count } (rename risk_level -> severity)
      // We'll do a grouping in JS, then pass it along to D3 component.
      const processed = raw.map(d => {
        return {
          ...d,
          severity: d.risk_level,  // rename for clarity
          year: new Date(d.discovery_date).getFullYear()
        };
      });
      setTaskData(processed);
    } catch (err) {
      console.error("Failed to fetch task data:", err);
    }
  };

  // For CountryYearChart, we need aggregated { country, year, count }:
  const countryYearData = React.useMemo(() => {
    // group by (country, year)
    const map = {};
    taskData.forEach((d) => {
      const key = d.country + "_" + d.year;
      map[key] = (map[key] || 0) + 1;
    });

    return Object.entries(map).map(([key, count]) => {
      const [country, year] = key.split("_");
      return {
        country,
        year: +year,
        count
      };
    });
  }, [taskData]);

  // For RiskLevelCharts, we need aggregated { country, year, severity, count }:
  const riskLevelData = React.useMemo(() => {
    // group by (country, year, severity)
    const map = {};
    taskData.forEach((d) => {
      const key = d.country + "_" + d.year + "_" + d.severity;
      map[key] = (map[key] || 0) + 1;
    });

    return Object.entries(map).map(([key, count]) => {
      const [country, year, severity] = key.split("_");
      return {
        country,
        year: +year,
        severity: +severity,
        count
      };
    });
  }, [taskData]);

  return (
    <div className="d-flex">
      <SideNavBar onSelect={handleTaskSelect} />

      <div className="flex-grow-1 p-5 overflow-auto" style={{ height: '100vh' }}>
        <h3 className="mb-4">{selectedTask}</h3>
        {selectedTask ? (
          <>
            {/* #1 Countries vs No. of Threats per Year */}
            <CountryYearChart data={countryYearData} />

            {/* #2 Multiple bar charts by severity */}
            <RiskLevelCharts data={riskLevelData} />
          </>
        ) : (
          <p>Select a task from the left panel to see analytics.</p>
        )}
      </div>
    </div>
  );
};

export default TasksPage;
