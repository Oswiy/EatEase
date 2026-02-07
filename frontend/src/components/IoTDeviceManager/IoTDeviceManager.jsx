import React, { useState, useEffect } from 'react';
import './IoTDeviceManager.css';

const API_BASE_URL = "http://localhost:8000/api";

const IoTDeviceManager = ({ restaurant }) => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [newDevice, setNewDevice] = useState({
    device_id: '',
    device_name: '',
    device_type: 'esp32_button'
  });
  const [error, setError] = useState('');

  const fetchDevices = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/iot/devices`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setDevices(data.devices || []);
      } else {
        setError(data.message || 'Failed to fetch devices');
      }
    } catch (err) {
      setError('Network error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (restaurant) {
      fetchDevices();
    }
  }, [restaurant]);

  const handleRegisterDevice = async (e) => {
    e.preventDefault();
    setRegistering(true);
    setError('');

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/iot/register-device`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(newDevice)
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`✅ Device registered!\nAPI Key: ${data.device.api_key}\n\nSave this key for your ESP32 code!`);
        setShowRegisterForm(false);
        setNewDevice({
          device_id: '',
          device_name: '',
          device_type: 'esp32_button'
        });
        fetchDevices();
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setRegistering(false);
    }
  };

  const handleResetCounters = async (deviceId) => {
    if (!confirm('Reset all counters to zero? This will set current occupancy to 0.')) return;

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/iot/reset-counters`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          device_id: deviceId,
          reason: 'Manual reset from dashboard'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('✅ Counters reset successfully!');
        window.location.reload(); // Refresh to show updated occupancy
      } else {
        alert('❌ ' + (data.message || 'Reset failed'));
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="iot-device-manager">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="iot-device-manager">
      <div className="iot-header">
        <h3>IoT Sensor Management</h3>
        <button 
          className="btn-primary"
          onClick={() => setShowRegisterForm(true)}
        >
          + Add
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Register Form Modal */}
      {showRegisterForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h4>Register IoT Device</h4>
              <button 
                className="close-btn"
                onClick={() => setShowRegisterForm(false)}
              >×</button>
            </div>
            
            <form onSubmit={handleRegisterDevice}>
              <div className="form-group">
                <label>Device ID *</label>
                <input
                  type="text"
                  value={newDevice.device_id}
                  onChange={(e) => setNewDevice({...newDevice, device_id: e.target.value})}
                  placeholder="ESP32CAM-001"
                  required
                />
                <small>Must match the ID in your ESP32 code</small>
              </div>

              <div className="form-group">
                <label>Device Name</label>
                <input
                  type="text"
                  value={newDevice.device_name}
                  onChange={(e) => setNewDevice({...newDevice, device_name: e.target.value})}
                  placeholder="Main Entrance Counter"
                />
              </div>

              <div className="form-group">
                <label>Device Type</label>
                <select
                  value={newDevice.device_type}
                  onChange={(e) => setNewDevice({...newDevice, device_type: e.target.value})}
                >
                  <option value="esp32_button">ESP32 Button Counter</option>
                  <option value="esp32_camera">ESP32 Camera</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-actions">
                <button 
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowRegisterForm(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn-primary"
                  disabled={registering}
                >
                  {registering ? 'Registering...' : 'Register Device'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Devices List */}
      {devices.length === 0 ? (
        <div className="no-devices">
          <div className="empty-state">
            <div className="empty-icon">📱</div>
            <h4>No IoT Devices Registered</h4>
            <p>Register your ESP32-CAM device to enable real-time occupancy tracking.</p>
            <button 
              className="btn-primary"
              onClick={() => setShowRegisterForm(true)}
            >
              Register First Device
            </button>
          </div>
        </div>
      ) : (
        <div className="devices-grid">
          {devices.map(device => (
            <div key={device.id} className="device-card">
              <div className="device-header">
                <div className="device-status">
                  <div className={`status-indicator ${device.is_online ? 'online' : 'offline'}`}>
                    {device.is_online ? '●' : '○'}
                  </div>
                  <span className="device-name">{device.device_name}</span>
                </div>
                <span className={`device-badge ${device.device_type}`}>
                  {device.device_type.replace('esp32_', '')}
                </span>
              </div>

              <div className="device-info">
                <div className="info-row">
                  <span className="info-label">Device ID:</span>
                  <span className="info-value">{device.device_id}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Status:</span>
                  <span className={`info-value ${device.is_online ? 'online' : 'offline'}`}>
                    {device.is_online ? 'Online' : 'Offline'}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Last Seen:</span>
                  <span className="info-value">{formatDate(device.last_seen)}</span>
                </div>
              </div>

              <div className="device-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => handleResetCounters(device.device_id)}
                >
                  Reset Counters
                </button>
                <button className="btn-text">
                  View Logs
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Instructions Panel */}
      <div className="instructions-panel">
        <h4>Setup Instructions</h4>
        <ol>
          <li>Register your ESP32 device with a unique Device ID</li>
          <li>Update your ESP32 code with the device</li>
          <li>Connect the ESP32 to power and WiFi</li>
          <li>Press the button to test entry/exit counting</li>
          <li>Real-time occupancy will update automatically</li>
        </ol>
      </div>
    </div>
  );
};

export default IoTDeviceManager;