import React, { useState } from 'react';

const StatusPopup = ({ onStatusChange, onClose, selectedTransaction }) => {
  const [selectedStatus, setSelectedStatus] = useState(selectedTransaction.status || '');
  const [userId, setSelectedId] = useState(selectedTransaction.userId || '');

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const handleSubmit = () => {
    const updatedTransaction = {
      ...selectedTransaction, 
      status: selectedStatus,
      userId: userId // Access the userId from the appropriate source
    };
    onStatusChange(updatedTransaction);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-500">
    <div className="fixed inset-0 flex items-center justify-center z-50 ">
      <div className="bg-white rounded-lg p-6 shadow-lg border-2 w-2/5">
        <h2 className="text-lg font-bold mb-4">Update Transaction Status</h2>
        <div className="mb-4">
          <label className="block mb-2">
            <input
              type="radio"
              value="pending"
              checked={selectedStatus === 'pending'}
              onChange={() => handleStatusChange('pending')}
            />
            Pending
          </label>
          <label className="block mb-2">
            <input
              type="radio"
              value="50% payment received"
              checked={selectedStatus === '50% payment received'}
              onChange={() => handleStatusChange('50% payment received')}
            />
            50% payment received
          </label>
          <label className="block mb-2">
            <input
              type="radio"
              value="Shipment sent"
              checked={selectedStatus === 'Shipment sent'}
              onChange={() => handleStatusChange('Shipment sent')}
            />
            Shipment sent
          </label>
          <label className="block mb-2">
            <input
              type="radio"
              value="full payment received"
              checked={selectedStatus === 'full payment received'}
              onChange={() => handleStatusChange('full payment received')}
            />
            Full payment received
          </label>
          <label className="block mb-2">
            <input
              type="radio"
              value="completed"
              checked={selectedStatus === 'completed'}
              onChange={() => handleStatusChange('completed')}
            />
            Completed
          </label>
        </div>
        <div className="flex justify-center">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default StatusPopup;