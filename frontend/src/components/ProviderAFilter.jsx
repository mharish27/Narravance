import React from 'react';
import FilterSection from './FilterSection';

const ProviderAForm = ({ values, handleChange }) => (
  <div className="form-section">
    <h5>Provider A Filters</h5>
    <hr style={{ width: '50%', height: '1px' , marginBottom: '2rem', borderTop: '2px solid #bab7b6' }} />
    <FilterSection values={values} handleChange={handleChange('provider_A')} isProviderA={true} />
  </div>
);

export default ProviderAForm;
