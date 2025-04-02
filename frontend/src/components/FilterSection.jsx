// import React from "react";
// import {
//   Grid,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   OutlinedInput,
//   Checkbox,
//   ListItemText,
// } from "@mui/material";

// const FilterSection = ({ values, onChange, isProviderA }) => {
//   const countriesList = ["USA", "China", "India", "UK"];
//   const yearList = Array.from({ length: 10 }, (_, i) => 2016 + i);
//   const levels = [1, 2, 3, 4, 5];

//   return (
//     <Grid container spacing={2}>
//       <Grid item xs={6}>
//         <FormControl fullWidth>
//           <InputLabel>Year From</InputLabel>
//           <Select
//             value={values.year_from}
//             onChange={onChange("year_from")}
//             label="Year From"
//           >
//             {yearList.map((y) => (
//               <MenuItem key={y} value={y}>
//                 {y}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       </Grid>
//       <Grid item xs={6}>
//         <FormControl fullWidth>
//           <InputLabel>Year To</InputLabel>
//           <Select
//             value={values.year_to}
//             onChange={onChange("year_to")}
//             label="Year To"
//           >
//             {yearList.map((y) => (
//               <MenuItem key={y} value={y}>
//                 {y}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       </Grid>
//       <Grid item xs={12}>
//         <FormControl fullWidth>
//           <InputLabel>Countries</InputLabel>
//           <Select
//             multiple
//             value={values.countries}
//             onChange={onChange("countries")}
//             input={<OutlinedInput label="Countries" />}
//             renderValue={(selected) => selected.join(", ")}
//           >
//             {countriesList.map((c) => (
//               <MenuItem key={c} value={c}>
//                 <Checkbox checked={values.countries.indexOf(c) > -1} />
//                 <ListItemText primary={c} />
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       </Grid>
//       <Grid item xs={12}>
//         <FormControl fullWidth>
//           <InputLabel>{isProviderA ? "Threat Level" : "Severity"}</InputLabel>
//           <Select
//             multiple
//             value={isProviderA ? values.threat_levels : values.severity}
//             onChange={onChange(isProviderA ? "threat_levels" : "severity")}
//             input={<OutlinedInput label={isProviderA ? "Threat Level" : "Severity"} />}
//             renderValue={(selected) => selected.join(", ")}
//           >
//             {levels.map((level) => (
//               <MenuItem key={level} value={level}>
//                 <Checkbox
//                   checked={
//                     (isProviderA ? values.threat_levels : values.severity).indexOf(level) > -1
//                   }
//                 />
//                 <ListItemText primary={level} />
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       </Grid>
//     </Grid>
//   );
// };

// export default FilterSection;
import React from 'react';
import { Form } from 'react-bootstrap';
import { MenuItem, Select, Checkbox, ListItemText, InputLabel, OutlinedInput, FormControl } from '@mui/material';

const FilterSection = ({ values, handleChange, isProviderA }) => {
  const countriesList = ['USA', 'China', 'India', 'UK'];
  const yearList = Array.from({ length: 10 }, (_, i) => 2016 + i);
  const levels = [1, 2, 3, 4, 5];

  return (
    <div className="row">
      <div className="col-md-6 mb-3">
        <Form.Label>Year From</Form.Label>
        <Form.Select value={values.year_from} onChange={handleChange('year_from')}>
          <option value="">Select</option>
          {yearList.map((y) => <option key={y} value={y}>{y}</option>)}
        </Form.Select>
      </div>
      <div className="col-md-6 mb-3">
        <Form.Label>Year To</Form.Label>
        <Form.Select value={values.year_to} onChange={handleChange('year_to')}>
          <option value="">Select</option>
          {yearList.map((y) => <option key={y} value={y}>{y}</option>)}
        </Form.Select>
      </div>
      <div className="col-md-12 mb-3">
        <Form.Label>Countries</Form.Label>
        <FormControl fullWidth>
          <InputLabel>Countries</InputLabel>
          <Select
            multiple
            value={values.countries}
            onChange={handleChange('countries')}
            input={<OutlinedInput label="Countries" />}
            renderValue={(selected) => selected.join(', ')}
          >
            {countriesList.map((c) => (
              <MenuItem key={c} value={c}>
                <Checkbox checked={values.countries.indexOf(c) > -1} />
                <ListItemText primary={c} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className="col-md-12 mb-3">
        <Form.Label>{isProviderA ? 'Threat Levels' : 'Severity'}</Form.Label>
        <FormControl fullWidth>
          <InputLabel>{isProviderA ? 'Threat Levels' : 'Severity'}</InputLabel>
          <Select
            multiple
            value={isProviderA ? values.threat_levels : values.severity}
            onChange={handleChange(isProviderA ? 'threat_levels' : 'severity')}
            input={<OutlinedInput label={isProviderA ? 'Threat Levels' : 'Severity'} />}
            renderValue={(selected) => selected.join(', ')}
          >
            {levels.map((lvl) => (
              <MenuItem key={lvl} value={lvl}>
                <Checkbox checked={(isProviderA ? values.threat_levels : values.severity).indexOf(lvl) > -1} />
                <ListItemText primary={lvl} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </div>
  );
};

export default FilterSection;
