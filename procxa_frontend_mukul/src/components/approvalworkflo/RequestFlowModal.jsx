import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, ListGroup } from "react-bootstrap";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endPoints";
import { FaPlus, FaTrash, FaSave, FaArrowUp, FaArrowDown, FaGripVertical } from "react-icons/fa";

const RequestFlowModal = ({ show, onHide, requestId, onSaveSuccess }) => {
  const { get, post } = useApi();
  const [availableDepartments, setAvailableDepartments] = useState([]);
  const [selectedFlow, setSelectedFlow] = useState([]);
  const [loading, setLoading] = useState(false);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  useEffect(() => {
    if (show) {
      fetchDepartments();
      fetchCurrentFlow();
    }
  }, [show, requestId]);

  const fetchDepartments = async () => {
    try {
      const response = await get(endpoints.getAllDepartments);
      if (response.status) {
        setAvailableDepartments(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchCurrentFlow = async () => {
    try {
      const response = await get(`${endpoints.approverFlow}/${requestId}`);
      if (response && Array.isArray(response.requests)) {
        const flow = response.requests.map(req => ({
          id: req.userId || req.departmentId,
          name: req.departmentName || req.firstName || "Unknown"
        }));
        setSelectedFlow(flow);
      } else {
        setSelectedFlow([]);
      }
    } catch (error) {
      console.error("Error fetching current flow:", error);
      setSelectedFlow([]);
    }
  };

  const addToFlow = (dept) => {
    if (selectedFlow.some(item => item.id === dept.id)) {
      alert("Department already added to flow.");
      return;
    }
    setSelectedFlow(prev => [...prev, { id: dept.id, name: dept.name }]);
  };

  const removeFromFlow = (index) => {
    setSelectedFlow(prev => prev.filter((_, i) => i !== index));
  };

  // Move item up by one position
  const moveUp = (index) => {
    if (index === 0) return;
    setSelectedFlow(prev => {
      const updated = [...prev];
      [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
      return updated;
    });
  };

  // Move item down by one position
  const moveDown = (index) => {
    setSelectedFlow(prev => {
      if (index === prev.length - 1) return prev;
      const updated = [...prev];
      [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
      return updated;
    });
  };

  // Drag and drop handlers
  const handleDragStart = (index) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    const from = dragItem.current;
    const to = dragOverItem.current;
    if (from === null || to === null || from === to) return;
    setSelectedFlow(prev => {
      const updated = [...prev];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return updated;
    });
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleSave = async () => {
    if (selectedFlow.length === 0) {
      alert("Please select at least one department.");
      return;
    }
    setLoading(true);
    try {
      const response = await post(endpoints.assign_request_flow, {
        intakeRequestId: requestId,
        departmentIds: selectedFlow.map(item => item.id)
      });
      if (response.status) {
        alert("Approval flow updated successfully!");
        onSaveSuccess();
        onHide();
      } else {
        alert(response.message || "Failed to update flow.");
      }
    } catch (error) {
      console.error("Error saving flow:", error);
      alert("Something went wrong while saving the flow.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton style={{ backgroundColor: "#578E7E", color: "white" }}>
        <Modal.Title>Configure Approval Workflow (Request #{requestId})</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row g-3">
          {/* Left: Available Departments */}
          <div className="col-md-5 border-end">
            <h6 className="fw-bold mb-2">Available Departments</h6>
            <div style={{ maxHeight: "320px", overflowY: "auto" }}>
              <ListGroup>
                {Array.isArray(availableDepartments) && availableDepartments.map(dept => {
                  const alreadyAdded = selectedFlow.some(item => item.id === dept.id);
                  return (
                    <ListGroup.Item
                      key={dept.id}
                      className="d-flex justify-content-between align-items-center py-2"
                      style={{ opacity: alreadyAdded ? 0.5 : 1 }}
                    >
                      <div>
                        <strong className="d-block">{dept.name}</strong>
                        <small className="text-muted">{dept.type}</small>
                      </div>
                      <Button
                        variant={alreadyAdded ? "outline-secondary" : "outline-primary"}
                        size="sm"
                        onClick={() => addToFlow(dept)}
                        disabled={alreadyAdded}
                        title={alreadyAdded ? "Already added" : "Add to flow"}
                      >
                        <FaPlus />
                      </Button>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            </div>
          </div>

          {/* Right: Selected Sequence with Drag/Reorder */}
          <div className="col-md-7">
            <h6 className="fw-bold mb-2">Selected Approval Sequence</h6>
            <p className="text-muted small mb-2">
              <FaGripVertical className="me-1" />
              Drag items to reorder, or use ↑↓ arrows
            </p>
            <div style={{ maxHeight: "320px", overflowY: "auto" }}>
              {selectedFlow.length === 0 ? (
                <div className="text-center py-5 text-muted border rounded">
                  <i className="fa-solid fa-route mb-2" style={{ fontSize: "2rem" }}></i>
                  <p className="mb-0">No departments selected yet.</p>
                  <small>Click + on the left to add.</small>
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {selectedFlow.map((item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragEnter={() => handleDragEnter(index)}
                      onDragEnd={handleDragEnd}
                      onDragOver={e => e.preventDefault()}
                      className="d-flex align-items-center gap-2 p-2 rounded border bg-white"
                      style={{
                        cursor: "grab",
                        userSelect: "none",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
                      }}
                    >
                      {/* Step number */}
                      <span
                        className="badge rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{
                          width: "26px",
                          height: "26px",
                          backgroundColor: "#578E7E",
                          color: "white",
                          fontSize: "0.75rem"
                        }}
                      >
                        {index + 1}
                      </span>

                      {/* Drag handle */}
                      <FaGripVertical className="text-muted flex-shrink-0" style={{ fontSize: "1rem" }} />

                      {/* Name */}
                      <span className="fw-semibold flex-grow-1 text-truncate">{item.name}</span>

                      {/* Up/Down controls */}
                      <div className="d-flex flex-column gap-1">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => moveUp(index)}
                          disabled={index === 0}
                          style={{ padding: "1px 5px", lineHeight: 1 }}
                          title="Move Up"
                        >
                          <FaArrowUp style={{ fontSize: "0.65rem" }} />
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => moveDown(index)}
                          disabled={index === selectedFlow.length - 1}
                          style={{ padding: "1px 5px", lineHeight: 1 }}
                          title="Move Down"
                        >
                          <FaArrowDown style={{ fontSize: "0.65rem" }} />
                        </Button>
                      </div>

                      {/* Delete */}
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeFromFlow(index)}
                        title="Remove"
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {selectedFlow.length > 0 && (
              <small className="text-muted d-block mt-2">
                ✅ Workflow will follow this exact order.
              </small>
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
        <Button variant="primary" onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : <><FaSave className="me-2" />Save Workflow</>}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RequestFlowModal;
