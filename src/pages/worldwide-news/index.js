import React, { useState, useEffect } from 'react';
import { SaveOutlined, SaveFilled, AreaChartOutlined, GlobalOutlined, DollarCircleOutlined, UserOutlined, BookOutlined, LogoutOutlined, RocketOutlined } from '@ant-design/icons';
import axios from 'axios';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import { BookmarkSquareIcon } from '@heroicons/react/24/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faBookmark as faSolidBookmark } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faRegularBookmark } from '@fortawesome/free-regular-svg-icons'; // Import icons
import { Settings } from "lucide-react";
import Sidebar, { SidebarItem } from "../../components/Sidebar"
import { Layout, Row, Col, message, Button } from 'antd';
import { Card as Carddup } from 'antd';
import {CardBody, Tabs, TabsHeader, TabsBody, Tab, TabPanel} from "@material-tailwind/react";
import { BACKEND_ADDRESS } from '../../config';




const NewsComponent = () => {
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [country, setCountry] = useState('');
  const handleCountryChange = (e) => setCountry(e.target.value);

  const [IsnewsLoading, setIsnewsLoading] = useState(true);

  
  const [productID, setProductID] = useState('');
  const handleProductChange = (e) => setProductID(e.target.value);


  const [Loading, setIsLoading] = useState(false);
  const [newsArticles, setNewsArticles] = useState([]);
  const [error2, setError2] = useState(null);
  const [page, setPage] = useState(1); 
  const [userId, setUserId] = useState(null);
  const { Content } = Layout;
  const [type, setType] = React.useState("card");
  const [bookmarked_articles, set_bookmarked_articles, ] = useState([]);
  const [sortBy, setSortBy] = useState('published_desc');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleClick = () => {
    setProductID(inputValue);
    setInputValue(''); // Clear input field after storing (optional)
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  }

  const handleBookmark = async (article) => {
    try {
      const bookmarkData = {
        userId,
        article
        
      };
      console.log(bookmarkData)

      const response = await axios.post(`${BACKEND_ADDRESS}/api/bookmark`, bookmarkData);
      
      // Update the bookmarked state in the UI
      setNewsArticles(prevArticles => prevArticles.map(item => 
        item.url === article.url ? { ...item, isBookmarked: !item.isBookmarked } : item
      ));

    
      message.success(response.data.message); // Show success message from backend
    } catch (err) {
      message.error("Error updating bookmark");
      console.error("Error updating bookmark:", err);
    }
  };
  
  const handleBookmark2 = async (article) => {
    try {
      const bookmarkData = {
        userId,
        article
        
      };
      console.log(bookmarkData)

      const response = await axios.post(`${BACKEND_ADDRESS}/api/bookmark`, bookmarkData);
    

      set_bookmarked_articles(prevBookmarks => {
        if (!prevBookmarks || prevBookmarks.length === 0) {
            return []; // Return an empty array if prevBookmarks is empty
        }
    
        return prevBookmarks.map(item => (
            item.article.url === article.article.url 
                ? { ...item, article: { ...item.article, isBookmarked: !item.article.isBookmarked } } 
                : item
        ));
    });
    
      message.success(response.data.message); // Show success message from backend
    } catch (err) {
      message.error("Error updating bookmark");
      console.error("Error updating bookmark:", err);
    }
  };


  useEffect(() => {
    // This will log newsArticles whenever it changes
    console.log(newsArticles);
  }, [newsArticles,]);


  useEffect(() => {
    // Fetch user info from localStorage
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo);
      setUserName(userInfo.name || 'Guest');
      setUserId(userInfo.identity);
    }

  }, []); 

  useEffect(() => {
    console.log("Updated user ID:", userId); // Log in a separate useEffect
}, [userId]);


useEffect(() => {
  // Fetch user info from localStorage
  const storedUserInfo = localStorage.getItem('userInfo');
  if (storedUserInfo) {
    const userInfo = JSON.parse(storedUserInfo);
    setUserName(userInfo.name || 'Guest');
    setUserId(userInfo.identity);
    console.log(userId)

    // Fetch bookmarks only when userId is available
    const fetchBookmarks = async () => { 
      try {
        const response = await axios.get(`${BACKEND_ADDRESS}/api/get_bookmarks?userId=${userInfo.identity}`);
        const bookmarked_articles = response.data;
        set_bookmarked_articles(bookmarked_articles);
        console.log("Fetched bookmarks:", bookmarked_articles);
        setIsnewsLoading(false); 
      } catch (err) {
        console.error("Error fetching bookmarks:", err);
        set_bookmarked_articles([]); 
      }
    };

    fetchBookmarks();
    // Call fetchBookmarks after userId is set
  }
}, [userId]);

useEffect(() => {
  // Fetch user info from localStorage
  const storedUserInfo = localStorage.getItem('userInfo');
  if (storedUserInfo) {
    const userInfo = JSON.parse(storedUserInfo);
    setUserName(userInfo.name || 'Guest');
    setUserId(userInfo.identity);
    console.log(userId)
    
    const fetchNews = async () => {
      setIsLoading(true);
  
      try {
        const categoriesParam = country// Default to exclude general and sports if nothing selected
        const apiUrl = `${BACKEND_ADDRESS}/api/news?page=${page}&categories=${categoriesParam}&sort=${productID}&userId=${userInfo.identity}`;
        const response = await fetch(apiUrl);
  
        if (!response.ok) {
          throw new Error(`Error fetching news: ${response.status} ${response.statusText}`);
        }
  
        const data = await response.json();
        // Access the articles array within the data object
        const articles = data.data || []; // Provide empty array as default if data.data is undefined

        // Update newsArticles with new data
        setNewsArticles(articles);

        console.log(newsArticles); // You should see the array of articles here
        setIsnewsLoading(false); 
        setProductID('');
      } catch (err) {
        setError2(err.message); 
      } finally {
        setIsLoading(false); 
        console.log(newsArticles); 
      }
    };

    fetchNews();// Call fetchBookmarks after userId is set
  }
}, [userId, country, productID]);
  
  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  const handleLogout = () => {
    localStorage.removeItem('userInfo'); 
    window.location.href = '/login'; 
  };

  return (
    <>
    <div className="bg-indigo-50 h-screen flex-col">
          <header className="z-40 bg-teal-950 sticky top-0">
            <div className="flex justify-between  px-4 py-2 border-b ">
              <div class="justify-center pt-1">
                <img src="/logo.png" alt="Your Company Logo" className="w-18 h-6  mt-1" />
              </div>
              <div className="flex flex-row justify-center">
                <div className="py-2 px-2 rounded-lg bg-white text-base border-gray-300 shadow-sm mr-2">
                                  <select id="country" value={country} onChange={handleCountryChange}
                                    className="focus:outline-none">
                                    <option value="">Select Country</option>
                                    <option value="ar">Argentina</option>
                                    <option value="au">Australia</option>
                                    <option value="at">Austria</option>
                                    <option value="be">Belgium</option>
                                    <option value="Spain">Spain</option>
                                    <option value="Hungary">Hungary</option>
                                    <option value="Switzerland">Switzerland</option>
                                    {/* More countries */}
                                  </select>
                </div>
                <input 
                  type="text"
                  value={inputValue}
                  onChange={handleChange}
                  className="rounded-lg mr-4 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleClick}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 rounded-lg hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700"
                >
                  Search news
                </button>
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
                        <div>{userId}</div>
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
                          
                          <div className="flex flex-col bg-indigo-50"> 
                            <CardBody>
                              <Tabs value={type} className="">
                                <TabsHeader className="relative" indicatorProps={{className: "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none",}}>
                                  <Tab value="card" onClick={() => setType("card")}>
                                   All
                                  </Tab>
                                  <Tab value="paypal" onClick={() => setType("paypal")}>
                                    Bookmarked
                                  </Tab>
                                </TabsHeader>
                                <TabsBody
                                  className="w-fit mx-auto text-amber-500 bg-transparent"
                                  animate={{
                                    initial: {
                                      x: type === "card" ? 400 : -400,
                                    },
                                    mount: {
                                      x: 0,
                                    },
                                    unmount: {
                                      x: type === "card" ? 400 : -400,
                                    },
                                  }}
                                >
                                  <TabPanel value="card" className="p-0">
         
                                          {IsnewsLoading ? ( 
                                            <div class="justify-center ml-[28rem]">
                                              <img src="/loading.gif" alt="Your Company Logo" className="rounded-lg w-[28rem] h-[24rem] " />
                                            </div>
                                          ) : error ? (
                                            <p className="text-center text-red-500">{error}</p>
                                          ) : (
                                            <>
                                            
                                              <h1 className="text-2xl font-bold mb-4 mt-2">News</h1>
                                              <ul className="grid grid-cols-3 gap-4 h-full mx-auto justify-center">
                                                {newsArticles.map(item => (                                                  
                                                      <Carddup
                                                      
                                                        hoverable
                                                        style={{ height: 300 }}
                                                        cover={
                                                          <div style={{ position: 'relative' }}>
                                                            <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
                                                              <img 
                                                                  alt="example"
                                                                  src={item.image || 'placeholder_image_url'}
                                                                  style={{ objectFit: 'cover', width: '100%', height: 150 }}
                                                              />
                                                              </a>
                                                    
                                                              <Button 
                                                                  type="link" 
                                                                  icon={<FontAwesomeIcon 
                                                                    icon={item.isBookmarked ? faSolidBookmark : faRegularBookmark}  // Use FontAwesome icons
                                                                    className={item.isBookmarked ? 'text-amber-500' : 'text-gray-500'}
                                                                    style={{ fontSize: '34px' }}  // Adjust size here
                                                                  />}
                                                                  onClick={() => handleBookmark(item)}
                                                                  style={{ 
                                                                      position: 'absolute', 
                                                                      top: 8, 
                                                                      right: 8, 
                                                                      zIndex: 1 
                                                                  }}
                                                              />
                                                          </div>
                                                      }
                                                  
                                                        
                                                      >
                                                        <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
                                                          <Carddup.Meta 
                                                            title={<div className="text-teal-950 font-light text-base mb-2 text-left leading-5.5">{item.title}</div>}
                                                            description={<div className="text-gray-600 line-clamp-3">{item.description}</div>} 
                                                          />
                                                        </a>
                                                      </Carddup>
                                                   
                                              
                                                ))}
                                            </ul>
                                            </>
                                          )}
                                        
                                   
                                  </TabPanel>
                                  <TabPanel value="paypal" className="p-0">
                                              <>
                                                <h1 className="text-2xl font-bold mb-4  mt-2">Bookmarked News</h1>
                                                <ul className="grid grid-cols-3 gap-4 h-full mx-auto justify-center">
                                                  {bookmarked_articles.map(item => (

                                                    <Carddup
                                                    
                                                    hoverable
                                                    style={{ height: 300 }}
                                                    cover={
                                                      <div style={{ position: 'relative' }}>
                                                        <a href={item.article.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
                                                          <img 
                                                              alt="example"
                                                              src={item.article.image || 'placeholder_image_url'}
                                                              style={{ objectFit: 'cover', width: '100%', height: 150 }}
                                                          />
                                                          </a>

                                                          <Button 
                                                              type="link" 
                                                              icon={<FontAwesomeIcon 
                                                                icon={item.article.isBookmarked ? faSolidBookmark : faRegularBookmark}  // Use FontAwesome icons
                                                                className={item.article.isBookmarked ? 'text-amber-500' : 'text-gray-500'}
                                                                style={{ fontSize: '34px' }}  // Adjust size here
                                                              />}
                                                              onClick={() => handleBookmark2(item)}
                                                              style={{ 
                                                                  position: 'absolute', 
                                                                  top: 8, 
                                                                  right: 8, 
                                                                  zIndex: 1 
                                                              }}
                                                          />
                                                      </div>
                                                  }               
                                                  >
                                                        <a href={item.article.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
                                                          <Carddup.Meta 
                                                            title={<div className="text-teal-950 font-light text-base mb-2 text-left leading-5.5">{item.article.title}</div>}
                                                            description={<div className="text-gray-600 line-clamp-3">{item.article.description}</div>} 
                                                          />
                                                        </a>
                                                      </Carddup>

                                                  ))}
                                                  </ul>
                                              </>

                                  </TabPanel>
                                </TabsBody>
                              </Tabs>
                            </CardBody>
                     
                          

                                
                          </div>
                          
                          
                        </div>
                        <footer class="text-sm text-gray-500 bg-indigo-50 pb-2">
                                 © 2024 C2W™
                                 | <a href="/home" class="hover:underline text-amber-500">C2W home</a>
                                 | <a href="/home" class="hover:underline text-amber-500">Terms of Service</a>
                                 | <a href="/home" class="hover:underline text-amber-500">Privacy Policy</a>
                                 | <a href="/home" class="hover:underline">Send feedback</a>
                            </footer>
                      </div>          
                        
          </main>
            
                    

                    
                      
                    
                
                
      </div>
    </>
  );
};

export default NewsComponent;
