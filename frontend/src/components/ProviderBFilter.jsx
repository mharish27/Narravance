import React from 'react';
import FilterSection from './FilterSection';

const ProviderBForm = ({ values, handleChange }) => (
  <div className="form-section">
    <h5>Provider B Filters</h5>
    <FilterSection values={values} handleChange={handleChange('provider_B')} isProviderA={false} />
  </div>
);

export default ProviderBForm;
