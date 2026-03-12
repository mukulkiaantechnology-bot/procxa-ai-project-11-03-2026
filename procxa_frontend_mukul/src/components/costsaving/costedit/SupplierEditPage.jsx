import React from "react";

function SupplierEditPage() {
  return (
    <div className="supplier-edit-section my-5">
      <div className="container">
        <h3>Supplier Edit</h3>
        <form className="row g-3 mt-4">
          <div className="col-md-6">
            <label className="form-label">Category Name </label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter The Category Name "
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Contact Detail</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter The Cantact Detail"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Phone</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Your Phone"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Email </label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter The Email"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Address </label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter YOur Address"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Department</label>
            <select className="form-select">
              <option>Supplier X</option>
              <option>Supplier Y</option>
              <option>Supplier A</option>
              <option>Supplier B</option>
            </select>
          </div>
          <div className="col-6">
            <label className="form-label">Sub Category </label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Your Sub Category "
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Amount </label>
            <input type="text" className="form-control" />
          </div>

          <div className="col-12">
            <button
              type="submit"
              className="btn "
              style={{ backgroundColor: "#578e7e", color: "white" }}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SupplierEditPage;
