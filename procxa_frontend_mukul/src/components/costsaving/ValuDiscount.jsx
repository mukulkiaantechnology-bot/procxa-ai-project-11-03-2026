import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaEdit, FaArrowLeft, FaSave } from 'react-icons/fa'; // Import icons
import endpoints from '../../api/endPoints';
import useApi from "../../hooks/useApi";
import { useNavigate } from 'react-router-dom'; // For navigation

const ValuDiscount = () => {
  const [discountData, setDiscountData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { get, patch } = useApi();
  const navigate = useNavigate(); // Hook for back button navigation

  // Fetch data from API
  const fetchData = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await get(`${endpoints.getVolumeDiscounts}?page=${page}`);
      if (response.status) {
        setDiscountData(response.data || []);
        setCurrentPage(response.pagination?.currentPage || 1);
        setTotalPages(response.pagination?.totalPages || 1);
      } else {
        setError(response.message || 'Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  // Call the API when the component mounts
  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  // Handle opening the edit modal
  const handleEdit = (supplier) => {
    setEditSupplier({ ...supplier });
    setShowModal(true);
  };

  // Handle saving the updated details
  const handleSave = async () => {
    try {
      const response = await patch(`${endpoints.updateSupplier}/${editSupplier.supplierId}`, editSupplier);
      if (response.status) {
        fetchData(currentPage); // Refresh the data
        setShowModal(false);
      } else {
        console.error('Failed to update supplier');
      }
    } catch (error) {
      console.error('Error updating supplier:', error);
    }
  };

  return (
    <>
      <div className="container-fluid px-3 px-md-4">
        {/* Back Button */}
        <div className="mb-3 d-flex justify-content-end">
          <Button
            onClick={() => navigate(-1)}
            style={{ backgroundColor: "#578E7E", border: "none" }}
            className="btn-sm"
          >
            <FaArrowLeft className="me-2" /> Back
          </Button>
        </div>
        
        <div className="top d-flex flex-wrap justify-content-between align-items-center mb-3">
          <div className="heading">
            <h2 className="mb-3 fw-bold">Volume Discounts</h2>
          </div>
        </div>

        <div className="totalheading mt-4">
          <h5>
            <u className="fw-bold">Total Estimated Savings</u>
          </h5>
        </div>

        {/* ================= LOADING STATE ================= */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading data...</p>
          </div>
        )}

        {/* ================= ERROR STATE ================= */}
        {error && !loading && (
          <div className="alert alert-danger" role="alert">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* ================= TABLE ================= */}
        {!loading && !error && (
          <div className="table-responsive mt-3">
            <table className="table table-striped table-bordered text-center">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Historical Volume <br /> Purchased (last 12 months)</th>
                  <th>Discount Threshold</th>
                  <th>Estimated Savings</th>
                  <th>Recommended Supplier</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>



              <tbody>
                {discountData.length > 0 ? (
                discountData?.map((item, index) => (
                  <tr key={index}>
                    <td className="text-capitalize">{item.subcategoryName}</td>
                    <td>{item.totalUnits} units</td>
                    <td>{item.bestSupplier ? `${item.bestSupplier.maxUnitPurchase} units (${item.bestSupplier.discountPercent}%)` : 'N/A'}</td>
                    <td>${item.bestSupplier ? item.bestSupplier.estimatedSavings.toFixed(2) : 'N/A'}</td>
                    <td className="text-capitalize">{item.bestSupplier ? item.bestSupplier.supplierName : 'N/A'}</td>
                    <td className="text-capitalize">{item.bestSupplier ? item.bestSupplier.volumeDiscountStatus : 'N/A'}</td>
                    <td>
                      {item.bestSupplier && (
                        <FaEdit className="text-primary mx-2 cursor-pointer" onClick={() => handleEdit(item.bestSupplier)} />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No volume discounts found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        )}

        {/* Pagination - Only page numbers, no Previous/Next buttons */}
        {!loading && !error && (
          <nav aria-label="Page navigation" className="mt-4">
          <ul className="pagination justify-content-center flex-wrap">
            {/* Page Numbers Only */}
            {[...Array(totalPages)].map((_, index) => (
              <li key={index} className={` me-1 ms-1 page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                <button
                  className="page-link rounded text-dark fw-semibold"
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        )}

        {/* Cost Saving Navigation Buttons */}
        <div className="d-flex justify-content-between align-items-center mt-4 mb-4" style={{ flexWrap: 'wrap', gap: '10px' }}>
          <button
            className="btn"
            onClick={() => navigate('/costsaving')}
            style={{
              backgroundColor: '#f8f9fa',
              color: '#333',
              border: '1px solid #dee2e6',
              padding: '10px 20px',
              borderRadius: '6px',
              minWidth: '120px'
            }}
          >
            <i className="fa-solid fa-arrow-left me-2"></i>Previous
          </button>
          <button
            className="btn text-white"
            onClick={() => navigate('/suppliercons')}
            style={{
              backgroundColor: '#578e7e',
              border: 'none',
              padding: '10px 30px',
              borderRadius: '6px',
              minWidth: '150px',
              fontWeight: '500'
            }}
          >
            Next<i className="fa-solid fa-arrow-right ms-2"></i>
          </button>
        </div>
      </div>

      {/* Edit Supplier Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Supplier Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Max Unit Purchase */}
            <Form.Group className="mb-3">
              <Form.Label>Max Unit Purchase</Form.Label>
              <Form.Control
                type="number"
                value={editSupplier?.maxUnitPurchase || ''}
                onChange={(e) => setEditSupplier({ ...editSupplier, maxUnitPurchase: e.target.value })}
              />
            </Form.Group>

            {/* Discount Percent */}
            <Form.Group className="mb-3">
              <Form.Label>Discount Percent</Form.Label>
              <Form.Control
                type="number"
                value={editSupplier?.discountPercent || ''}
                onChange={(e) => setEditSupplier({ ...editSupplier, discountPercent: e.target.value })}
              />
            </Form.Group>

            {/* Status Dropdown */}
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={editSupplier?.volumeDiscountStatus || ''}
                onChange={(e) => setEditSupplier({ ...editSupplier, volumeDiscountStatus: e.target.value })}
              >
                <option value="New Opportunity">New Opportunity </option>
                <option value="Under Review">Under Review</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            <FaSave className="me-2" /> Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ValuDiscount;