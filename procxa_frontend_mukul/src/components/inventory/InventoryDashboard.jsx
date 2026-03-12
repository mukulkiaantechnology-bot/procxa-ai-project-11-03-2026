import React, { useState, useEffect } from 'react';
import useApi from '../../hooks/useApi';
import endpoints from '../../api/endPoints';

const InventoryDashboard = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateStockModal, setShowUpdateStockModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({
        sku: '',
        item_name: '',
        description: '',
        current_stock: 0,
        threshold_type: 'quantity',
        threshold_value: 10
    });
    const [stockUpdate, setStockUpdate] = useState(0);

    const { get, post, put } = useApi();

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const response = await get(endpoints.getAllInventoryItems);
            if (response.status) setInventory(response.data);
        } catch (error) {
            console.error("Error fetching inventory:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                current_stock: parseInt(formData.current_stock) || 0,
                threshold_value: parseFloat(formData.threshold_value) || 0
            };
            const response = await post(endpoints.createInventoryItem, payload);
            if (response.status) {
                setShowAddModal(false);
                fetchInventory();
            } else {
                alert(response.message || "Failed to add item");
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const handleUpdateStock = async (e) => {
        e.preventDefault();
        try {
            const response = await put(`${endpoints.updateInventoryStock}/${selectedItem.id}`, {
                current_stock: stockUpdate
            });
            if (response.status) {
                setShowUpdateStockModal(false);
                if (response.lowStockAlert) {
                    alert(`Alert: Stock for ${selectedItem.sku} is low!`);
                }
                fetchInventory();
            }
        } catch (error) {
            alert(error.message);
        }
    };

    if (loading) return <div className="container mt-4"><h3>Loading Inventory...</h3></div>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold">Inventory Management</h3>
                <button className="btn btn-primary shadow-sm" onClick={() => setShowAddModal(true)}>
                    <i className="fa-solid fa-plus me-2"></i> Add SKU Item
                </button>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-md-12">
                    <div className="card shadow-sm border-0" style={{ borderRadius: "15px" }}>
                        <div className="card-header bg-white py-3 border-bottom">
                            <h5 className="mb-0 fw-bold">Stock Tracking (SKU-Based)</h5>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>SKU</th>
                                            <th>Item Name</th>
                                            <th className="text-center">Current Stock</th>
                                            <th className="text-center">Threshold</th>
                                            <th>Status</th>
                                            <th className="text-end">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {inventory.map((item) => {
                                            const isLow = item.current_stock <= item.threshold_value;
                                            return (
                                                <tr key={item.id}>
                                                    <td className="fw-bold text-primary">{item.sku}</td>
                                                    <td>{item.item_name}</td>
                                                    <td className="text-center">
                                                        <span className={`badge ${isLow ? 'bg-danger' : 'bg-success'} fs-6`}>
                                                            {item.current_stock}
                                                        </span>
                                                    </td>
                                                    <td className="text-center">{item.threshold_value} ({item.threshold_type})</td>
                                                    <td>
                                                        {isLow ? (
                                                            <span className="text-danger small fw-bold">
                                                                <i className="fa-solid fa-triangle-exclamation me-1"></i> Low Stock
                                                            </span>
                                                        ) : (
                                                            <span className="text-success small fw-bold">Healthy</span>
                                                        )}
                                                    </td>
                                                    <td className="text-end">
                                                        <button
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={() => { setSelectedItem(item); setStockUpdate(item.current_stock); setShowUpdateStockModal(true); }}
                                                        >
                                                            Update Stock
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {inventory.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="text-center py-4 text-muted">No inventory items found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Item Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content p-4">
                        <h4>Add New Inventory Item</h4>
                        <form onSubmit={handleAddItem}>
                            <div className="mb-3">
                                <label className="form-label">SKU ID</label>
                                <input type="text" className="form-control" required onChange={e => setFormData({ ...formData, sku: e.target.value })} placeholder="e.g. SKU-001" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Item Name</label>
                                <input type="text" className="form-control" onChange={e => setFormData({ ...formData, item_name: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Initial Stock</label>
                                <input type="number" className="form-control" onChange={e => setFormData({ ...formData, current_stock: e.target.value })} />
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Threshold Type</label>
                                    <select className="form-select" onChange={e => setFormData({ ...formData, threshold_type: e.target.value })}>
                                        <option value="quantity">Fixed Quantity</option>
                                        <option value="percentage">Percentage</option>
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Threshold Value</label>
                                    <input type="number" className="form-control" onChange={e => setFormData({ ...formData, threshold_value: e.target.value })} />
                                </div>
                            </div>
                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-primary">Add Item</button>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Update Stock Modal */}
            {showUpdateStockModal && (
                <div className="modal-overlay">
                    <div className="modal-content p-4">
                        <h4>Update Stock: {selectedItem?.sku}</h4>
                        <form onSubmit={handleUpdateStock}>
                            <div className="mb-3">
                                <label className="form-label">Current Stock Level</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={stockUpdate}
                                    required
                                    onChange={e => setStockUpdate(e.target.value)}
                                />
                            </div>
                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-primary">Update</button>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowUpdateStockModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryDashboard;
