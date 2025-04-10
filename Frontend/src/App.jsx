import { useState, useEffect } from 'react'
import axios from 'axios'
import { Listbox } from '@headlessui/react'
import { FiTrash2, FiEdit, FiCalendar, FiLink, FiSun, FiMoon, FiBox } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

const API_URL = 'http://localhost:5000/api/applications'
const statusOptions = ['Applied', 'Interview', 'Offer', 'Rejected']

export default function App() {
  const [applications, setApplications] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState({ show: false, message: '', type: '' })
  const [filters, setFilters] = useState({ status: '', fromDate: '' })
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    status: 'Applied',
    applicationDate: new Date().toISOString().split('T')[0],
    link: ''
  })

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  useEffect(() => {
    fetchApplications()
  }, [filters])

  const fetchApplications = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get(API_URL, { params: filters })
      setApplications(res.data)
    } catch (err) {
      showNotification('Failed to fetch applications', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await axios.post(API_URL, formData)
      setFormData({ ...formData, company: '', role: '', link: '' })
      fetchApplications()
      showNotification('Application added successfully')
    } catch (err) {
      showNotification('Failed to add application', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`${API_URL}/${id}`, { status: newStatus })
      fetchApplications()
    } catch (err) {
      console.error(err)
    }
  }

  const deleteApplication = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`)
      fetchApplications()
    } catch (err) {
      console.error(err)
    }
  }

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      console.log(isDarkMode)
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      console.log(isDarkMode)
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Notification */}
        <AnimatePresence>
          {notification.show && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
                notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'
              } text-white z-50`}
            >
              {notification.message}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Job Application Tracker
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          >
            {isDarkMode ? (
              <FiMoon className="w-6 h-6 text-yellow-500" />
            ) : (
              <FiSun className="w-6 h-6 text-gray-600" />
            )}
          </motion.button>
        </div>

        {/* Form with loading state */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-6 mb-8 dark:bg-gray-800"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Company Name"
                className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={formData.company}
                onChange={e => setFormData({ ...formData, company: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Job Role"
                className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
                required
              />
              <input
                type="date"
                className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={formData.applicationDate}
                onChange={e => setFormData({ ...formData, applicationDate: e.target.value })}
              />
              <select
                className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
              >
                {statusOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <input
                type="url"
                placeholder="Job Posting URL"
                className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={formData.link}
                onChange={e => setFormData({ ...formData, link: e.target.value })}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={isSubmitting}
              className={`w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition 
                dark:bg-blue-700 dark:hover:bg-blue-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Adding...' : 'Add Application'}
            </motion.button>
          </form>
        </motion.div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-wrap gap-4 dark:bg-gray-800">
          <select
            className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={filters.status}
            onChange={e => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Statuses</option>
            {statusOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <input
            type="date"
            className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={filters.fromDate}
            onChange={e => setFilters({ ...filters, fromDate: e.target.value })}
          />
        </div>

        {/* Applications List with loading and empty states */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : applications.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-gray-500 dark:text-gray-400"
            >
              <FiBox className="w-12 h-12 mx-auto mb-4" />
              <p>No applications found. Start by adding your first application!</p>
            </motion.div>
          ) : (
            <AnimatePresence>
              {applications.map(app => (
                <motion.div
                  key={app._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-lg shadow p-4 dark:bg-gray-800 dark:text-white"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{app.company}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{app.role}</p>
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <FiCalendar className="inline" />
                        <span>{new Date(app.applicationDate).toLocaleDateString()}</span>
                      </div>
                      {app.link && (
                        <a
                          href={app.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-600 hover:underline dark:text-blue-400"
                        >
                          <FiLink className="inline" />
                          Job Posting
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Listbox
                        value={app.status}
                        onChange={(value) => updateStatus(app._id, value)}
                      >
                        <div className="relative">
                          <Listbox.Button className={`px-4 py-1 rounded-full text-sm font-medium ${
                            app.status === 'Applied' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200' :
                            app.status === 'Interview' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200' :
                            app.status === 'Offer' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' :
                            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                          }`}>
                            {app.status}
                          </Listbox.Button>
                          <Listbox.Options className="absolute right-0 mt-1 bg-white shadow-lg rounded-md py-1 dark:bg-gray-700">
                            {statusOptions.map(status => (
                              <Listbox.Option
                                key={status}
                                value={status}
                                className={({ active }) => 
                                  `px-4 py-2 cursor-pointer ${active ? 'bg-gray-100 dark:bg-gray-600' : ''} text-gray-900 dark:text-gray-100`
                                }
                              >
                                {status}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </div>
                      </Listbox>
                      <button
                        onClick={() => deleteApplication(app._id)}
                        className="text-red-600 hover:text-red-700 p-2 rounded hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  )
}