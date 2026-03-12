import React, { useState, useEffect } from "react";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endPoints";

const Profile = () => {
    const { get, patch, post, loading } = useApi();
    const [profileData, setProfileData] = useState({
        first_name: "",
        last_name: "",
        email_id: "",
        phone_no: "",
        country: "",
        city: "",
        state: "",
        userType: "",
        name: "" // for department users
    });

    const [passwordData, setPasswordData] = useState({
        old_password: "",
        new_password: "",
        confirm_password: ""
    });

    const [message, setMessage] = useState({ type: "", text: "" });

    const fetchProfile = async () => {
        const response = await get(endpoints.getProfile);
        if (response.status) {
            setProfileData(response.data);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const updateProfile = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });
        const response = await patch(endpoints.updateProfile, profileData);
        if (response.status) {
            setMessage({ type: "success", text: "Profile updated successfully!" });
        } else {
            setMessage({ type: "danger", text: response.message || "Failed to update profile." });
        }
    };

    const changePassword = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        if (passwordData.new_password !== passwordData.confirm_password) {
            setMessage({ type: "danger", text: "New passwords do not match." });
            return;
        }

        const response = await post(endpoints.changePassword, {
            old_password: passwordData.old_password,
            new_password: passwordData.new_password
        });

        if (response.status) {
            setMessage({ type: "success", text: "Password changed successfully!" });
            setPasswordData({ old_password: "", new_password: "", confirm_password: "" });
        } else {
            setMessage({ type: "danger", text: response.message || "Failed to change password." });
        }
    };

    const isDepartment = profileData.userType === "department";

    return (
        <div className="container-fluid px-4 py-4">
            <h3 className="mb-4 fw-bold" style={{ color: "#578e7e" }}>User Profile</h3>

            {message.text && (
                <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
                    {message.text}
                    <button type="button" className="btn-close" onClick={() => setMessage({ type: "", text: "" })}></button>
                </div>
            )}

            <div className="row g-4">
                {/* Profile Information */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm" style={{ borderRadius: "12px" }}>
                        <div className="card-body p-4">
                            <h5 className="card-title mb-4 fw-bold">Profile Details</h5>
                            <form onSubmit={updateProfile}>
                                <div className="row g-3">
                                    {isDepartment ? (
                                        <div className="col-md-12">
                                            <label className="form-label text-muted small uppercase fw-bold">Department Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="name"
                                                value={profileData.name || ""}
                                                onChange={handleProfileChange}
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <div className="col-md-6">
                                                <label className="form-label text-muted small uppercase fw-bold">First Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="first_name"
                                                    value={profileData.first_name || ""}
                                                    onChange={handleProfileChange}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label text-muted small uppercase fw-bold">Last Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="last_name"
                                                    value={profileData.last_name || ""}
                                                    onChange={handleProfileChange}
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div className="col-md-6">
                                        <label className="form-label text-muted small uppercase fw-bold">Email Address</label>
                                        <input
                                            type="email"
                                            className="form-control bg-light"
                                            value={profileData.email_id || ""}
                                            disabled
                                        />
                                        <div className="form-text small">Email cannot be changed.</div>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label text-muted small uppercase fw-bold">Phone Number</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="phone_no"
                                            value={profileData.phone_no || ""}
                                            onChange={handleProfileChange}
                                        />
                                    </div>

                                    {!isDepartment && (
                                        <>
                                            <div className="col-md-4">
                                                <label className="form-label text-muted small uppercase fw-bold">Country</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="country"
                                                    value={profileData.country || ""}
                                                    onChange={handleProfileChange}
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label text-muted small uppercase fw-bold">State</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="state"
                                                    value={profileData.state || ""}
                                                    onChange={handleProfileChange}
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label text-muted small uppercase fw-bold">City</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="city"
                                                    value={profileData.city || ""}
                                                    onChange={handleProfileChange}
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div className="col-12 mt-4 text-end">
                                        <button type="submit" className="btn btn-primary px-4" disabled={loading} style={{ background: "#578e7e", border: "none" }}>
                                            {loading ? "Updating..." : "Save Changes"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Password Change */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm" style={{ borderRadius: "12px" }}>
                        <div className="card-body p-4">
                            <h5 className="card-title mb-4 fw-bold">Security</h5>
                            <form onSubmit={changePassword}>
                                <div className="mb-3">
                                    <label className="form-label text-muted small uppercase fw-bold">Current Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="old_password"
                                        value={passwordData.old_password}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-muted small uppercase fw-bold">New Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="new_password"
                                        value={passwordData.new_password}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label text-muted small uppercase fw-bold">Confirm New Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="confirm_password"
                                        value={passwordData.confirm_password}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-outline-dark w-100" disabled={loading}>
                                    Update Password
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="card mt-4 border-0 shadow-sm bg-light" style={{ borderRadius: "12px" }}>
                        <div className="card-body p-4 text-center">
                            <div className="user-icon-bg mb-3 mx-auto shadow-sm" style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <i className="fa-solid fa-circle-user" style={{ fontSize: "50px", color: "#578e7e" }}></i>
                            </div>
                            <h6 className="fw-bold mb-1">{isDepartment ? profileData.name : `${profileData.first_name} ${profileData.last_name}`}</h6>
                            <p className="text-muted small mb-3">{profileData.email_id}</p>
                            <span className="badge rounded-pill" style={{ background: "#578e7e", color: "#fff", fontSize: "10px", textTransform: "uppercase" }}>{profileData.userType}</span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .form-control:focus {
                    border-color: #578e7e;
                    box-shadow: 0 0 0 0.25rem rgba(87, 142, 126, 0.25);
                }
                .form-label {
                    letter-spacing: 0.5px;
                }
            `}</style>
        </div>
    );
};

export default Profile;
