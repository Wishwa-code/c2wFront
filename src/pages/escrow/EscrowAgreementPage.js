import React, { useState, useEffect } from 'react';
import { RocketOutlined, MenuOutlined, AreaChartOutlined, GlobalOutlined, DollarCircleOutlined, UserOutlined, BookOutlined, LogoutOutlined } from '@ant-design/icons';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid';
import Sidebar, { SidebarItem } from "../../components/Sidebar";
import { Settings } from "lucide-react";
import axios from 'axios';
import StatusPopup from "../../components/StatusPopup";
import CreateTransactionPopup from "../../components/CreateTransactionPopup.js";

import { PencilIcon } from "@heroicons/react/24/solid";
import { ArrowDownTrayIcon, MagnifyingGlassIcon,} from "@heroicons/react/24/outline";
import {Card, CardHeader, Typography, Button, CardBody, Chip, CardFooter, Avatar, IconButton, Tooltip, Input,} from "@material-tailwind/react";
import { BACKEND_ADDRESS } from '../../config.js';

const TABLE_HEAD = ["Transaction", "Amount", "Date", "Status", "Account", ""];

const EscrowAgreementPage = () => {

  const [loggedInUser, setLoggedInUser] = useState(null);
  
  const [userName, setUserName] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [transactions,setTransactions] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showCreatePopup, setShowCreatePopup] = useState(false);

  

  

  const handlePopupClose = () => {
    setShowPopup(false);
    setSelectedTransaction(null);
  };

  useEffect(() => {
    const fetchtransactions = async () => {
      try {
        const response = await axios.get(`${BACKEND_ADDRESS}/fetch_transaction_data`, {});
        const transactions = response.data;
        console.log(transactions)
        setTransactions(transactions)
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };
    fetchtransactions();
  }, []);

  const handleStatusUpdate = async (updatedTransaction) => {
    try {
      console.log(updatedTransaction._id);
      console.log(updatedTransaction.status);
      console.log(updatedTransaction.userId); // Access the userId

      const response = await axios.put(`${BACKEND_ADDRESS}/update_transaction_status`, {
          transactionId: updatedTransaction._id,
          newStatus: updatedTransaction.status,
          userId: updatedTransaction.userId, // Include userId in the request
      });

      if (response.status === 200) {
        fetchtransactions();
        setSelectedTransaction(null);
        setShowPopup(false);
      } else {
        console.error('Failed to update transaction status:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating transaction status:', error);
    }
  };

  const fetchtransactions = async () => {
    try {
      const response = await axios.get(`${BACKEND_ADDRESS}/fetch_transaction_data`, {});
      const transactions = response.data;
      console.log(transactions);
      setTransactions(transactions); // Update the state with fresh data
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

const TABLE_ROWS = transactions

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  }

  useEffect(() => {
    // Simulate fetching logged-in user info (replace with actual authentication)
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setLoggedInUser(JSON.parse(storedUserInfo));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
  };

  useEffect(() => {
    // Simulate fetching the logged-in user's info from local storage
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo);
      setLoggedInUser(userInfo);
    }
  }, []);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo);
      setUserName(userInfo.name || 'Guest');
    }
  }, []);

  return (
    <>
    <div className="bg-indigo-50 h-screen flex-col">
          <header className="z-10 bg-teal-950 sticky top-0">
            <div className="flex justify-between  px-4 py-2 border-b ">
              <div class="justify-center pt-1">
                <img src="/logo.png" alt="Your Company Logo" className="w-18 h-6  mt-1" />
              </div>
                


              <div className="flex items-center">
              <button
                
                className="text-white focus:outline-none rounded-lg p-2 hover:text-amber-500 flex items-center" // Tailwind classes
              >
                <QuestionMarkCircleIcon className="h-6 w-6 mr-2" /> {/* Icon (optional) */}
              </button>
                
                <button 
                  id="dropdownInformationButton" 
                  data-dropdown-toggle="dropdownInformation" 
                  class="text-white font-medium text-center inline-flex " 
                  type="button"
                  aria-expanded="false" 
                  aria-haspopup="true"
                  onClick={toggleDropdown}
                >
              
                  <img src="/userprofile.png" alt="Your Company Logo" className="mt-1 size-8" />
                </button>
                <div id="dropdownInformation" className={`absolute right-0 mt-72 mr-4 ${isDropdownOpen ? '' : 'hidden'} bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600`}>
                    <div class="px-4 py-3 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white rounded-lg">
                      <a href="#" class="block px-4 py-2 ">
                        <div>{userName}</div>
                        <div class="font-medium truncate">wishwajayanath@gmail.com</div>
                    </a>
                      
                    </div>
                    <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownInformationButton">
                      <li>
                        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Recommendations</a>
                      </li>
                      <li>
                        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Messages</a>
                      </li>
                      <li>
                        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
                      </li>
                    </ul>
                    <div class="py-2">
                      <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-white">
                        <button onClick={handleLogout} className="">
                          <LogoutOutlined className="mr-2" /> Sign out
                        </button>
                      </a>
                    </div>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 bg-indigo-50 ">
            <div className="flex flex-col h-[calc(100lvh-56px)]">  
                        <div className="flex flex-row ">
                          <div className="top-14 left-0 right-0 text-left indent-2">
                            <Sidebar>
                              <SidebarItem icon={<AreaChartOutlined />} text="Predictions" alert to="/identify"/>
                              <SidebarItem icon={<GlobalOutlined />} text="News"  to="/worldwide-news" />
                              <SidebarItem icon={<UserOutlined />} text="Buyers" alert to="/find-buyers"/>
                              <SidebarItem icon={<BookOutlined />} text="Lessons" to="/lessions"/>
                              <SidebarItem icon={<DollarCircleOutlined />} text="Escrow" to="/escrow"/>
                              <SidebarItem icon={<RocketOutlined />} text="Premium" to="/home"/>
                              <hr className="my-3"/>
                              <SidebarItem icon={<Settings size={20} />} text="Settings"/>
                            </Sidebar>
                          </div>
                          
                          <div className="flex flex-col w-full bg-indigo-50">

                          <button type="button" content="Create New Agreement" onClick={() => setShowCreatePopup(true) } className="text-lg w-4/5 mx-auto mt-4 shadow-sm items-center  py-2 text-sm font-medium text-teal-950 bg-amber-500 rounded-lg hover:bg-gray-900 hover:text-white">
                            Create New Agreement
                          </button>
                          <div>
                            {/* ... Your existing code ... */}

                            {showCreatePopup && (
                              <CreateTransactionPopup 
                                onCreate={(newTransaction) => {
                                  setTransactions(prevTransactions => [...prevTransactions, newTransaction]);
                                }} 
                                onClose={() => setShowCreatePopup(false)} 
                              />
                            )}
                          </div>
                          {showPopup && (
                            <StatusPopup
                              onStatusChange={handleStatusUpdate}
                              onClose={handlePopupClose}
                              selectedTransaction={selectedTransaction}
                            />
                          )}
                          <Card className="h-full w-4/5 mx-auto my-5 ">
                            <CardHeader floated={false} shadow={false} className="rounded-none">
                              <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
                                <div>
                                  <Typography variant="h5" color="blue-gray">
                                    Recent Transactions
                                  </Typography>
                                  <Typography color="gray" className="mt-1 font-normal">
                                    These are details about the last transactions
                                  </Typography>
                                </div>
                                <div className="flex w-full shrink-0 gap-2 md:w-max">
                                  <div className="w-full md:w-72">
                                    <Input
                                      label=""
                                      placeholder="Search"
                                      icon={<MagnifyingGlassIcon className="mt-2 h-5 w-5" />}
                                    />
                                  </div>
                                </div>
                              </div>
                            </CardHeader>
                            <CardBody className=" px-0">
                              <table className="w-full min-w-max table-auto text-left">
                                <thead>
                                  <tr>
                                    {TABLE_HEAD.map((head) => (
                                      <th
                                        key={head}
                                        className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                                      >
                                        <Typography
                                          variant="small"
                                          color="blue-gray"
                                          className="font-normal leading-none opacity-70"
                                        >
                                          {head}
                                        </Typography>
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {TABLE_ROWS.map(
                                    (
                                      {
                                        img,
                                        partner,
                                        amount,
                                        startdate,
                                        status,
                                        product,
                                        userId,
                                        quantity,
                                      },
                                      index,
                                    ) => {
                                      const isLast = index === TABLE_ROWS.length - 1;
                                      const classes = isLast
                                        ? "p-4"
                                        : "p-4 border-b border-blue-gray-50";
                      
                                      return (
                                        <tr key={partner}>
                                          <td className={classes}>
                                            <div className="flex items-center gap-3">
                                              <Avatar
                                                src={img}
                                                alt={partner}
                                                size="md"
                                                className="border border-blue-gray-50 bg-blue-gray-50/50 object-contain p-1"
                                              />
                                              <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-bold"
                                              >
                                                {partner}
                                              </Typography>
                                            </div>
                                          </td>
                                          <td className={classes}>
                                            <Typography
                                              variant="small"
                                              color="blue-gray"
                                              className="font-normal"
                                            >
                                              {amount}
                                            </Typography>
                                          </td>
                                          <td className={classes}>
                                            <Typography
                                              variant="small"
                                              color="blue-gray"
                                              className="font-normal"
                                            >
                                              {startdate}
                                            </Typography>
                                          </td>
                                          <td className={classes}>
                                            <div className="w-max">
                                              <Chip
                                                className={`inline-flex items-center rounded-md px-2 text-xs font-medium  ${
                                                  status === "pending"
                                                    ? "bg-purple-500 text-white"
                                                    : status === "50% payment recieved"
                                                    ? "bg-yellow-400 text-black"
                                                    : status === "Shipment sent"
                                                    ? "bg-blue-500 text-white"
                                                    : status === "full payment received"
                                                    ? "bg-green-500 text-white"
                                                    : "bg-gray-400 text-black" // For 'completed' or any other status
                                                }`}
                                                size="sm"
                                                variant="ghost"
                                                value={status}
                                              />
                                            </div>
                                          </td>
                                          <td className={classes}>
                                            <div className="flex items-center gap-3">
                                              <div className="flex flex-col">
                                                <Typography
                                                  variant="small"
                                                  color="blue-gray"
                                                  className="font-normal capitalize"
                                                >
                                                  {product.split("-").join(" ")} {quantity}
                                                </Typography>
                                                
                                              </div>
                                            </div>
                                          </td>
                                          <td className={classes}>
                                            <Button 
                                              content="Update Status"
                                              onClick={() => {
                                                setSelectedTransaction({
                                                  img,
                                                  partner,
                                                  amount,
                                                  startdate,
                                                  status,
                                                  product,
                                                  userId,
                                                  quantity,
                                                });
                                                setShowPopup(true);
                                              }}>
                                              <IconButton variant="text" >
                                                <PencilIcon className="h-4 w-4" />
                                              </IconButton>
                                            </Button>
                                          </td>
                                        </tr>
                                      );
                                    },
                                  )}
                                </tbody>
                              </table>
                            </CardBody>
                          </Card>
 
                        <footer class="text-sm text-gray-500 bg-indigo-50 pb-2">
                                 © 2024 C2W™
                                 | <a href="/home" class="hover:underline text-amber-500">C2W home</a>
                                 | <a href="/home" class="hover:underline text-amber-500">Terms of Service</a>
                                 | <a href="/home" class="hover:underline text-amber-500">Privacy Policy</a>
                                 | <a href="/home" class="hover:underline">Send feedback</a>
                            </footer>
                      </div> 
                    </div>
                          
                          
                </div>         
                        
          </main>       
      </div>
    </>
    
  );
};

export default EscrowAgreementPage;



