import React, { useState, useEffect } from 'react';
import API from '../services/api';
import './Dashboard.css';

const ProctorDashboard = () => {
    const [hackathons, setHackathons] = useState([]);
    const [participationApprovals, setParticipationApprovals] = useState([]);
    const [activeSection, setActiveSection] = useState('participation');
    const [selectedYear, setSelectedYear] = useState('');
    const [years, setYears] = useState([]);
    const [selectedHackathon, setSelectedHackathon] = useState('');
    const [hackathonTitles, setHackathonTitles] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [showParticipants, setShowParticipants] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [studentHackathons, setStudentHackathons] = useState([]);
    const [showStudentHackathons, setShowStudentHackathons] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAssignedHackathons();
        fetchParticipationApprovals();
        fetchHackathonYears();
        fetchHackathonTitles();
    }, []);

    const fetchAssignedHackathons = async () => {
        try {
            const res = await API.get('/hackathons/assigned');
            setHackathons(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchParticipationApprovals = async () => {
        try {
            const res = await API.get('/upcoming-hackathons/proctor/approvals');
            setParticipationApprovals(res.data);
        } catch (err) {
            console.error('Error fetching participation approvals:', err);
        }
    };

    const fetchHackathonYears = async () => {
        try {
            const res = await API.get('/hackathons/stats');
            const yearList = res.data.map(item => item._id);
            setYears(yearList);
        } catch (err) {
            console.error('Error fetching years:', err);
        }
    };

    const fetchHackathonTitles = async () => {
        try {
            const res = await API.get('/hackathons/accepted');
            const titles = [...new Set(res.data.map(item => item.hackathonTitle))];
            setHackathonTitles(titles);
        } catch (err) {
            console.error('Error fetching titles:', err);
        }
    };

    const fetchHackathonsByYear = async (year) => {
        try {
            const res = await API.get(`/hackathons/by-year?year=${year}`);
            setHackathons(res.data);
        } catch (err) {
            console.error('Error fetching hackathons by year:', err);
        }
    };

    const fetchHackathonParticipants = async (title, year) => {
        try {
            const res = await API.get(`/hackathons/participants?hackathonTitle=${title}&year=${year}`);
            setParticipants(res.data);
            setShowParticipants(true);
        } catch (err) {
            console.error('Error fetching participants:', err);
        }
    };

    const fetchStudentHackathons = async (studentId) => {
        try {
            const res = await API.get(`/hackathons/student/${studentId}`);
            setStudentHackathons(res.data);
            setShowStudentHackathons(true);
        } catch (err) {
            console.error('Error fetching student hackathons:', err);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        if (status === 'Accepted') {
            if (!window.confirm('Are you sure you want to accept this hackathon?')) {
                return;
            }
        }

        if (status === 'Declined' && !rejectionReason) {
            setSelectedId(id);
            return;
        }

        try {
            await API.put(`/hackathons/${id}/status`, { status, rejectionReason });
            setRejectionReason('');
            setSelectedId(null);
            fetchAssignedHackathons();
        } catch (err) {
            alert('Update failed: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleParticipationApproval = async (approvalId, status, reason = '') => {
        try {
            await API.put(`/upcoming-hackathons/proctor/${approvalId}/status`, { 
                status, 
                rejectionReason: reason 
            });
            
            // Refresh participation approvals
            await fetchParticipationApprovals();
            
            alert(`Participation request ${status} successfully!`);
        } catch (err) {
            alert('Update failed: ' + (err.response?.data?.message || err.message));
        }
    };

    if (loading) return <div className="dashboard-container"><p>Loading assignments...</p></div>;

    return (
        <div className="dashboard-container">
            <h2 style={{ color: '#830000', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Proctor Dashboard</h2>

            {/* Section Navigation */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                <button
                    onClick={() => setActiveSection('participation')}
                    style={{
                        padding: '10px 20px',
                        background: activeSection === 'participation' ? '#830000' : '#f5f5f5',
                        color: activeSection === 'participation' ? 'white' : '#333',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.95rem'
                    }}
                >
                    📋 Participation Approval
                </button>
                <button
                    onClick={() => setActiveSection('certification')}
                    style={{
                        padding: '10px 20px',
                        background: activeSection === 'certification' ? '#830000' : '#f5f5f5',
                        color: activeSection === 'certification' ? 'white' : '#333',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.95rem'
                    }}
                >
                    📜 Certification Verification
                </button>
            </div>

            {activeSection === 'participation' && (
                <div>
                    <h3 style={{ color: '#830000', marginBottom: '20px' }}>📋 Participation Approval Requests</h3>
                    {participationApprovals.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', background: '#f5f5f5', borderRadius: '8px', color: '#666' }}>
                            <p style={{ fontSize: '2rem', margin: 0 }}>📭</p>
                            <p>No participation requests pending approval.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '20px' }}>
                            {participationApprovals.map(approval => (
                                <div key={approval._id} className="hackathon-card-item" style={{
                                    background: 'white',
                                    padding: '20px',
                                    borderRadius: '8px',
                                    border: '1px solid #eee',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                        <div>
                                            <h4 style={{ color: '#830000', margin: '0 0 10px 0' }}>
                                                {approval.upcomingHackathonId?.title || 'Hackathon'}
                                            </h4>
                                            <p style={{ margin: '5px 0', color: '#666' }}>
                                                <strong>Student:</strong> {approval.enrollmentDetails.studentName} ({approval.enrollmentDetails.registerNo})
                                            </p>
                                            <p style={{ margin: '5px 0', color: '#666' }}>
                                                <strong>Department:</strong> {approval.enrollmentDetails.department} • {approval.enrollmentDetails.year} Year
                                            </p>
                                            <p style={{ margin: '5px 0', color: '#666' }}>
                                                <strong>Email:</strong> {approval.enrollmentDetails.email}
                                            </p>
                                            <p style={{ margin: '5px 0', color: '#666' }}>
                                                <strong>Phone:</strong> {approval.enrollmentDetails.phone}
                                            </p>
                                        </div>
                                        <span className={`status-badge ${approval.status.toLowerCase()}`} style={{
                                            padding: '6px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.85rem',
                                            fontWeight: '600',
                                            background: approval.status === 'Approved' ? '#e8f5e9' : approval.status === 'Declined' ? '#ffebee' : '#fff3e0',
                                            color: approval.status === 'Approved' ? '#2e7d32' : approval.status === 'Declined' ? '#c62828' : '#ef6c00',
                                            border: `1px solid ${approval.status === 'Approved' ? '#a5d6a7' : approval.status === 'Declined' ? '#ef9a9a' : '#ffe0b2'}`
                                        }}>
                                            {approval.status === 'Pending' ? '⏳ Pending' : approval.status === 'Approved' ? '✅ Approved' : '❌ Declined'}
                                        </span>
                                    </div>
                                    
                                    <div style={{ marginBottom: '15px' }}>
                                        <p style={{ margin: '5px 0', color: '#666' }}>
                                            <strong>Experience:</strong> {approval.enrollmentDetails.experience}
                                        </p>
                                        <p style={{ margin: '5px 0', color: '#666' }}>
                                            <strong>Motivation:</strong> {approval.enrollmentDetails.motivation}
                                        </p>
                                        <p style={{ margin: '5px 0', color: '#666' }}>
                                            <strong>Skills:</strong> {approval.enrollmentDetails.skills}
                                        </p>
                                        <p style={{ margin: '5px 0', color: '#666' }}>
                                            <strong>Team Preference:</strong> {approval.enrollmentDetails.teamPreference}
                                        </p>
                                    </div>
                                    
                                    {approval.status === 'Pending' && (
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <button
                                                onClick={() => handleParticipationApproval(approval._id, 'Approved')}
                                                style={{
                                                    background: '#4caf50',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '8px 16px',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.85rem'
                                                }}
                                            >
                                                ✅ Approve
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedId(approval._id);
                                                    setRejectionReason('');
                                                }}
                                                style={{
                                                    background: '#d32f2f',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '8px 16px',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.85rem'
                                                }}
                                            >
                                                ❌ Decline
                                            </button>
                                            {selectedId === approval._id && (
                                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flex: 1 }}>
                                                    <input
                                                        type="text"
                                                        placeholder="Rejection reason..."
                                                        value={rejectionReason}
                                                        onChange={(e) => setRejectionReason(e.target.value)}
                                                        style={{
                                                            flex: 1,
                                                            padding: '8px',
                                                            border: '1px solid #ddd',
                                                            borderRadius: '4px'
                                                        }}
                                                    />
                                                    <button
                                                        onClick={() => handleParticipationApproval(approval._id, 'Declined', rejectionReason)}
                                                        style={{
                                                            background: '#d32f2f',
                                                            color: 'white',
                                                            border: 'none',
                                                            padding: '8px 16px',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        Submit
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedId(null);
                                                            setRejectionReason('');
                                                        }}
                                                        style={{
                                                            background: '#666',
                                                            color: 'white',
                                                            border: 'none',
                                                            padding: '8px 16px',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeSection === 'certification' && (
                <div>
                    <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Filter Hackathons</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Filter by Year:</label>
                                <select 
                                    value={selectedYear} 
                                    onChange={(e) => {
                                        setSelectedYear(e.target.value);
                                        if (e.target.value) {
                                            fetchHackathonsByYear(e.target.value);
                                        } else {
                                            fetchAssignedHackathons();
                                        }
                                    }}
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                                >
                                    <option value=''>All Years</option>
                                    {years.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>View Participants:</label>
                                <select 
                                    value={selectedHackathon} 
                                    onChange={(e) => setSelectedHackathon(e.target.value)}
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                                >
                                    <option value=''>Select Hackathon</option>
                                    {hackathonTitles.map(title => (
                                        <option key={title} value={title}>{title}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>&nbsp;</label>
                                <button
                                    onClick={() => {
                                        if (selectedHackathon && selectedYear) {
                                            fetchHackathonParticipants(selectedHackathon, selectedYear);
                                        } else {
                                            alert('Please select both hackathon and year');
                                        }
                                    }}
                                    disabled={!selectedHackathon || !selectedYear}
                                    style={{ 
                                        width: '100%', 
                                        padding: '8px', 
                                        borderRadius: '4px', 
                                        border: 'none', 
                                        background: (!selectedHackathon || !selectedYear) ? '#ccc' : '#830000', 
                                        color: 'white',
                                        cursor: (!selectedHackathon || !selectedYear) ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    View Participants
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="list-card">
                <h3 style={{ marginTop: 0 }}>Assigned Hackathons</h3>
                {hackathons.length === 0 ? (
                    <p style={{ color: '#666', fontStyle: 'italic' }}>No hackathons assigned to you yet.</p>
                ) : (
                    <div style={{ display: 'grid', gap: '20px' }}>
                        {hackathons.map(hack => (
                            <div key={hack._id} className="hackathon-item" style={{
                                border: '1px solid #ddd',
                                padding: '20px',
                                borderRadius: '8px',
                                background: '#fff',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 5px 0', fontSize: '1.2rem', color: '#333' }}>{hack.studentId?.name}</h4>
                                        <p style={{ margin: 0, color: '#666' }}>Reg No: <strong>{hack.studentId?.registerNo}</strong> | Year: {hack.studentId?.year}</p>
                                        <button
                                            onClick={() => fetchStudentHackathons(hack.studentId?._id)}
                                            style={{
                                                marginTop: '5px',
                                                padding: '4px 8px',
                                                fontSize: '0.8rem',
                                                background: '#666',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            View All Hackathons
                                        </button>
                                    </div>
                                    <span className={`status-${hack.status.toLowerCase()}`} style={{
                                        padding: '5px 10px',
                                        borderRadius: '15px',
                                        fontSize: '0.85rem',
                                        fontWeight: 'bold',
                                        background: hack.status === 'Pending' ? '#fff3e0' : hack.status === 'Accepted' ? '#e8f5e9' : '#ffebee',
                                        color: hack.status === 'Pending' ? '#ef6c00' : hack.status === 'Accepted' ? '#2e7d32' : '#c62828'
                                    }}>
                                        {hack.status}
                                    </span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
                                    <div>
                                        <p style={{ margin: '5px 0' }}><strong>Hackathon:</strong> {hack.hackathonTitle}</p>
                                        <p style={{ margin: '5px 0' }}><strong>Organization:</strong> {hack.organization}</p>
                                        <p style={{ margin: '5px 0' }}><strong>Mode:</strong> {hack.mode}</p>
                                        <p style={{ margin: '5px 0' }}><strong>Date:</strong> {new Date(hack.date).toLocaleDateString()} ({hack.year})</p>
                                    </div>
                                    <div>
                                        <p style={{ margin: '5px 0' }}><strong>Description:</strong></p>
                                        <p style={{ margin: '0', fontSize: '0.9rem', color: '#555', background: '#f9f9f9', padding: '10px', borderRadius: '4px' }}>{hack.description}</p>
                                    </div>
                                </div>

                                <div className="file-links" style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
                                    <a href={`http://localhost:5000/${hack.certificateFilePath}`} target="_blank" rel="noopener noreferrer" className="file-link">📄 Certificate</a>
                                </div>

                                {hack.status === 'Pending' && (
                                    <div className="action-buttons" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                        <button
                                            onClick={() => handleStatusUpdate(hack._id, 'Accepted')}
                                            className="accept-btn"
                                            style={{ background: '#2e7d32', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(hack._id, 'Declined')}
                                            className="decline-btn"
                                            style={{ background: '#c62828', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Decline
                                        </button>
                                    </div>
                                )}

                                {selectedId === hack._id && (
                                    <div className="rejection-input" style={{ marginTop: '15px', background: '#ffebee', padding: '15px', borderRadius: '8px' }}>
                                        <p style={{ margin: '0 0 10px 0', color: '#c62828', fontWeight: 'bold' }}>Reason for Rejection:</p>
                                        <textarea
                                            placeholder="Enter reason..."
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ef9a9a' }}
                                        />
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button
                                                onClick={() => handleStatusUpdate(hack._id, 'Declined')}
                                                style={{ background: '#c62828', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
                                            >
                                                Confirm Reject
                                            </button>
                                            <button
                                                onClick={() => { setSelectedId(null); setRejectionReason(''); }}
                                                style={{ background: '#666', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
                </div>
            )}

            {/* Participants Modal */}
            {showParticipants && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        padding: '30px',
                        borderRadius: '8px',
                        maxWidth: '800px',
                        maxHeight: '80vh',
                        overflow: 'auto'
                    }}>
                        <h3 style={{ marginTop: 0 }}>Participants: {selectedHackathon} ({selectedYear})</h3>
                        {participants.length === 0 ? (
                            <p>No participants found.</p>
                        ) : (
                            <div style={{ display: 'grid', gap: '15px' }}>
                                {participants.map(participant => (
                                    <div key={participant._id} style={{
                                        border: '1px solid #ddd',
                                        padding: '15px',
                                        borderRadius: '8px',
                                        background: '#f9f9f9'
                                    }}>
                                        <p><strong>{participant.studentId?.name}</strong> ({participant.studentId?.registerNo})</p>
                                        <p style={{ margin: '5px 0', color: '#666' }}>Department: {participant.studentId?.department}</p>
                                        <p style={{ margin: '5px 0', color: '#666' }}>Email: {participant.studentId?.email}</p>
                                        <p style={{ margin: '5px 0', color: '#666' }}>Status: {participant.status}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        <button
                            onClick={() => setShowParticipants(false)}
                            style={{
                                marginTop: '20px',
                                padding: '10px 20px',
                                background: '#666',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Student Hackathons Modal */}
            {showStudentHackathons && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        padding: '30px',
                        borderRadius: '8px',
                        maxWidth: '800px',
                        maxHeight: '80vh',
                        overflow: 'auto'
                    }}>
                        <h3 style={{ marginTop: 0 }}>Student's Hackathons</h3>
                        {studentHackathons.length === 0 ? (
                            <p>No hackathons found for this student.</p>
                        ) : (
                            <div style={{ display: 'grid', gap: '15px' }}>
                                {studentHackathons.map(hack => (
                                    <div key={hack._id} style={{
                                        border: '1px solid #ddd',
                                        padding: '15px',
                                        borderRadius: '8px',
                                        background: '#f9f9f9'
                                    }}>
                                        <p><strong>{hack.hackathonTitle}</strong></p>
                                        <p style={{ margin: '5px 0', color: '#666' }}>Organization: {hack.organization}</p>
                                        <p style={{ margin: '5px 0', color: '#666' }}>Date: {new Date(hack.date).toLocaleDateString()} ({hack.year})</p>
                                        <p style={{ margin: '5px 0', color: '#666' }}>Mode: {hack.mode}</p>
                                        <p style={{ margin: '5px 0', color: '#666' }}>Status: {hack.status}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        <button
                            onClick={() => setShowStudentHackathons(false)}
                            style={{
                                marginTop: '20px',
                                padding: '10px 20px',
                                background: '#666',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProctorDashboard;
