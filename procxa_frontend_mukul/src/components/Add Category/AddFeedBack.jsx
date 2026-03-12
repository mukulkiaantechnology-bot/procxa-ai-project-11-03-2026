import React, { useState, useEffect, useCallback } from 'react';
import useApi from '../../hooks/useApi';
import endpoints from '../../api/endPoints';

const SupplierPerformance = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [ratings, setRatings] = useState({ KPI1: '', KPI2: '', KPI3: '', KPI4: '' });
  const [message, setMessage] = useState('');
  const { get, post } = useApi();

  // Define KPI limits
  const kpiLimits = {
    KPI1: 50,
    KPI2: 5,
    KPI3: 25,
    KPI4: 50,
  };

  // Memoized fetchSuppliers to avoid infinite loop
  const fetchSuppliers = useCallback(async () => {
    try {
      const supplierResponse = await get(endpoints.getSuppliers);
      if (supplierResponse?.data) {
        setSuppliers(supplierResponse.data);
      } else {
        console.error('Error fetching suppliers');
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  }, []);

  // Fetch suppliers on component mount
  useEffect(() => {
    fetchSuppliers();
  }, []); // Dependency on fetchSuppliers ensures it doesn't run infinitely

  // Handle supplier selection
  const handleSelectSupplier = (e) => {
    const supplierId = e.target.value;
    setSelectedSupplier(supplierId);
    setRatings({ KPI1: '', KPI2: '', KPI3: '', KPI4: '' }); // Reset ratings when a new supplier is selected
    setMessage(''); // Clear the message when a new supplier is selected
  };

  // Handle rating change
  const handleRatingChange = (kpi, value) => {
    if (!isNaN(value)) {
      const numericValue = Math.min(Math.max(Number(value), 0), kpiLimits[kpi]);
      setRatings((prevRatings) => ({
        ...prevRatings,
        [kpi]: numericValue,
      }));
    }
  };

  // Calculate total rating from KPI values
  const calculateTotalRating = () => {
    return Object.values(ratings).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const totalRating = calculateTotalRating();  // Calculate total rating here

      setMessage('Submitting...'); // Show submitting message while waiting for response

      const response = await post(endpoints.addRating, {
        supplierId: selectedSupplier, // Send supplierId instead of supplierName
        ratings,
        totalRating, // Send totalRating
      });

      if (response?.status) {
        setMessage(response.message||`Successfully submitted rating for supplier with ID ${selectedSupplier}.`);
        setRatings({ KPI1: '', KPI2: '', KPI3: '', KPI4: '' }); // Reset ratings
        setSelectedSupplier('');  // Clear selected supplier
      } else {
        setMessage('Failed to submit rating. Please try again.');
      }
    } catch (error) {
      setMessage('Error submitting rating. Please try again.');
      console.error('Error submitting rating:', error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      {message && (
        <p
          style={{
            marginTop: '20px',
            textAlign: 'center',
            color: message.includes('Success') ? 'green' : 'red',
          }}
        >
          {message}
        </p>
      )}

      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Supplier Performance</h2>

      {/* Supplier Selection */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Select Supplier:</label>
        <select
          onChange={handleSelectSupplier}
          value={selectedSupplier}
          style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        >
          <option value="" disabled>Select a supplier</option>
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
          ))}
        </select>
      </div>

      {/* KPI Ratings */}
      <div>
        <h3 style={{ marginBottom: '20px' }}>Rate the performance of {selectedSupplier || 'the supplier'}</h3>
        {Object.keys(kpiLimits).map((kpi) => (
          <div key={kpi} style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              {kpi} (out of {kpiLimits[kpi]}):
            </label>
            <input
              type="number"
              value={ratings[kpi]}
              onChange={(e) => handleRatingChange(kpi, e.target.value)}
              min="0"
              max={kpiLimits[kpi]}
              disabled={!selectedSupplier}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                backgroundColor: !selectedSupplier ? '#f0f0f0' : 'white',
              }}
              placeholder={`Enter rating for ${kpi} (max: ${kpiLimits[kpi]})`}
            />
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!selectedSupplier}
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '5px',
          border: 'none',
          backgroundColor: selectedSupplier ? 'grey' : '#ccc',
          color: 'white',
          fontWeight: 'bold',
          cursor: selectedSupplier ? 'pointer' : 'not-allowed',
        }}
      >
        Submit Rating
      </button>
    </div>
  );
};

export default SupplierPerformance;
