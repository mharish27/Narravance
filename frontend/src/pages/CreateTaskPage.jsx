// import React, { useState } from 'react';
// import ProviderAForm from '../components/ProviderAFilter.jsx';
// import ProviderBForm from '../components/ProviderBFilter.jsx';
// import { Form } from 'react-bootstrap';
// import { createTask } from '../apis/taskService.js';

// const CreateTaskPage = () => {
//   const [taskName, setTaskName] = useState('');
//   const [form, setForm] = useState({
//     provider_A: {
//       year_from: '',
//       year_to: '',
//       countries: [],
//       threat_levels: [],
//     },
//     provider_B: {
//       year_from: '',
//       year_to: '',
//       countries: [],
//       severity: [],
//     },
//   });

//   const handleChange = (provider) => (field) => (event) => {
//     const value = event.target.value;
//     setForm((prev) => ({
//       ...prev,
//       [provider]: { ...prev[provider], [field]: value },
//     }));
//   };

//   const handleSubmit = async () => {
//     if (!taskName) {
//       alert('Please enter a task name!');
//       return;
//     }

//     try {
//       await createTask(taskName, form);
//       alert('Task added to Queue, Please wait some time to see the analytics!');
//     } catch (err) {
//       console.error('Failed to create task:', err);
//       alert('Something went wrong while creating the task.');
//     }
//   };

//   return (
//     <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100">
//       <div className="w-100 overflow-auto px-3" style={{ maxWidth: '1000px', maxHeight: 'calc(100vh - 100px)' }}>
//         <h2 className="text-center mb-4">Create Threat Task</h2>

//         {/* Task Name Input */}
//         <div className="d-flex justify-content-center mb-4">
//           <Form.Control
//             type="text"
//             placeholder="Enter Task Name"
//             value={taskName}
//             onChange={(e) => setTaskName(e.target.value)}
//             style={{ maxWidth: '300px', borderRadius: '20px', padding: '10px 15px' }}
//           />
//         </div>

//         {/* Filters Side by Side */}
//         <div className="row">
//           <div className="col-md-6">
//             <ProviderAForm values={form.provider_A} handleChange={handleChange} yearFrom={form.provider_A.year_from}/>
//           </div>
//           <div className="col-md-6">
//             <ProviderBForm values={form.provider_B} handleChange={handleChange} yearFrom={form.provider_B.year_from}/>
//           </div>
//         </div>

//         {/* Submit Button */}
//         <div className="text-center mb-4">
//           <button className="btn btn-gradient" onClick={handleSubmit}>Create Task</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateTaskPage;
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import ProviderAForm from '../components/ProviderAFilter.jsx';
import ProviderBForm from '../components/ProviderBFilter.jsx';
import { createTask } from '../apis/taskService.js';

// 1) Import Toastify
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateTaskPage = () => {
  const [taskName, setTaskName] = useState('');
  const [form, setForm] = useState({
    provider_A: {
      year_from: '',
      year_to: '',
      countries: [],
      threat_levels: [],
    },
    provider_B: {
      year_from: '',
      year_to: '',
      countries: [],
      severity: [],
    },
  });

  const handleChange = (provider) => (field) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({
      ...prev,
      [provider]: { ...prev[provider], [field]: value },
    }));
  };

  const handleSubmit = async () => {
    if (!taskName) {
      toast.error('Please enter a task name!');
      return;
    }

    try {
      await createTask(taskName, form);
      // Show success toast instead of alert
      toast.success('Task queued successfully! Please wait a moment to view analytics.');
    } catch (err) {
      console.error('Failed to create task:', err);
      toast.error('Something went wrong while creating the task.');
    }
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100">
      <div
        className="w-100 overflow-auto px-3"
        style={{ maxWidth: '1000px', maxHeight: 'calc(100vh - 100px)' }}
      >
        {/* Big Title + Horizontal Line */}
        <h1
          className="text-center"
          style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}
        >
          Create Threat Task
        </h1>
        <hr style={{ height: '1px' , marginBottom: '2rem', borderTop: '2px solid #bab7b6' }} />

        {/* Task Name Input */}
        <div className="d-flex justify-content-center mb-4">
          <Form.Control
            type="text"
            placeholder="Enter Task Name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            // Style: large, round, grey
            style={{
              maxWidth: '400px',
              borderRadius: '30px',
              padding: '15px 20px',
              backgroundColor: '#f5f5f5',
              border: 'none',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
            }}
          />
        </div>

        {/* Filters Side by Side */}
        <div className="row">
          <div className="col-md-6">
            <ProviderAForm
              values={form.provider_A}
              handleChange={handleChange}
              yearFrom={form.provider_A.year_from}
            />
          </div>
          <div className="col-md-6">
            <ProviderBForm
              values={form.provider_B}
              handleChange={handleChange}
              yearFrom={form.provider_B.year_from}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center mb-4">
          <button
            className="btn"
            onClick={handleSubmit}
            style={{
              background: 'linear-gradient(to right, #36C3FF, #35E4A1)',
              color: '#fff',
              fontWeight: 'bold',
              borderRadius: '50px',
              padding: '0.75rem 2rem',
              border: 'none',
              boxShadow: '0px 2px 10px rgba(0,0,0,0.1)',
            }}
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskPage;
