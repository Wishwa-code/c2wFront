import React, { useState } from 'react';
import axios from "axios";

const CreateTransactionPopup = ({ onCreate, onClose }) => {
  const [formData, setFormData] = useState({
    userId:"",
    img: "",
    partner: "",
    amount: "",
    startdate: "",
    status: "pending",
    product: "",
    quantity: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5001/create_transaction', formData);
      console.log(formData);
      if (response.status === 201) { 
        onCreate(response.data);
        onClose();
      } else {
        console.error('Failed to create transaction:', response.data);
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-500">
      <div className="bg-white rounded-lg p-8 w-3/5">
      <h2 className="text-xl font-semibold mb-4">Create New Agreement</h2>
      <div className=" flex justify-center w-full">
        <div className="mb-4 w-1/2 mr-4">
            <label htmlFor="userId" className="block text-gray-700 text-sm font-bold mb-2">
            User ID:
            </label>
            <input
            type="number"
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
        </div>
      
      <div className="w-1/2">
        <label htmlFor="img" className="block text-gray-700 text-sm font-bold mb-2">
          Image URL:
        </label>
        <input
          type="text"
          id="img"
          name="img"
          value={formData.img}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      
      </div>
      <div className="">
        <label htmlFor="partner" className="block text-gray-700 text-sm font-bold mb-2">
          Partner:
        </label>
        <input
          type="text"
          id="partner"
          name="partner"
          value={formData.partner}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      

      <div className="">
        <label htmlFor="startdate" className="block text-gray-700 text-sm font-bold mb-2">
          Start Date:
        </label>
        <input
          type="date"
          id="startdate"
          name="startdate"
          value={formData.startdate}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      {/* Product and Quantity */}
      <div className="mb-4 flex justify-between mt-6">
      <div className="mb-4">
        <label htmlFor="product" className="block text-gray-700 text-sm font-bold mb-2">
          Product:
        </label>
        <input
          type="text"
          id="product"
          name="product"
          value={formData.product}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="quantity" className="block text-gray-700 text-sm font-bold mb-2">
          Quantity:
        </label>
        <input
          type="text"
          id="quantity"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="">
        <label htmlFor="amount" className="block text-gray-700 text-sm font-bold mb-2">
          Amount:
        </label>
        <input
          type="text"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      </div>

      <div className="flex justify-center mt-2 ">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={handleSubmit}>
          Create
        </button>
        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
    </div>
  );
};

export default CreateTransactionPopup;