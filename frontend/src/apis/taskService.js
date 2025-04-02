import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1";

export const createTask = async (taskName, filters) => {
  console.log("Creating task with name:", taskName);
  console.log("Filters:", filters);
  const res = await axios.post(`${BASE_URL}/create_task/${taskName}`, filters);
  return res.data;
  // return null;
};

export const getTaskNames = async () => {
  const res = await axios.get(`${BASE_URL}/get_task_names`);
  return res.data;
};

export const getTaskData = async (taskName) => {
  const res = await axios.get(`${BASE_URL}/get_task/${taskName}`);
  return res.data;
};

