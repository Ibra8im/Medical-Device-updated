import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { motion, AnimatePresence } from 'framer-motion'

// Export libraries
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import ExportDropdown from '../components/ExportDropdown'

const Device = () => {
  const navigate = useNavigate()
  const { backendUrl, setDeviceLength } = useContext(AppContext)

  const [devices, setDevices] = useState([])
  const [filteredDevices, setFilteredDevices] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [subcategoryFilter, setSubcategoryFilter] = useState('all')
  const [categories, setCategories] = useState([])
  const [register, setregister] = useState(false);
  const [notRegister, setNotRegister] = useState(false);

  const placeholderImage = '/placeholder-device.jpg'

  // Fetch devices
  const fetchDevices = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/device')
      if (response.data.success) {
        const data = response.data.devices
        setDevices(data)
        setDeviceLength(data)
        setFilteredDevices(data)
        const uniqueCategories = [...new Set(data.map(d => d.category).filter(Boolean))]
        setCategories(uniqueCategories)
      }
    } catch (error) {
      console.error('Error fetching devices:', error)
    }
  }

  // Apply filters
  const filterDevices = () => {
    let filtered = devices

    if (searchTerm) {
      filtered = filtered.filter(d =>
        (d.name || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(d => d.category === categoryFilter)
    }

    if (subcategoryFilter !== 'all') {
      filtered = filtered.filter(d => d.subcategory === subcategoryFilter)
    }

    if (register === true) {
      filtered = filtered.filter(d => d.register === true)
    }

    if (notRegister === true) {
      filtered = filtered.filter(d => d.register === false)
    }

    setFilteredDevices(filtered)
  }

  useEffect(() => {
    fetchDevices()
  }, [])

  useEffect(() => {
    filterDevices()
  }, [devices, searchTerm, categoryFilter, subcategoryFilter, register, notRegister])

  // --------- Export helpers ---------
  const normalizeRow = (d) => {
    // Transform each device into a plain object for export
    return {
      ID: d._id || '',
      Name: d.name || '',
      'SDFA-Registeration': d.register ? 'Registered' : 'Not-Registered',
      Model: d.model || '',
      Price: d.price != null ? d.price : '',
      'B2B Price': d.price_p != null ? d.price_p : '',
      Category: d.category || '',
      Subcategory: d.subcategory || '',
      Manufacturer: d.manufacturer?.name || (typeof d.manufacturer === 'string' ? d.manufacturer : ''),
      Agent: d.has_agent ? (d.agent || 'Available') : 'No',
      Suppliers: d.suppliers && d.suppliers.length ? d.suppliers.map(s => s.name).join(', ') : '',
      Description: d.description || '',
    }
  }

  const exportToExcel = () => {
    if (!filteredDevices || filteredDevices.length === 0) {
      alert('No devices to export.')
      return
    }
    const rows = filteredDevices.map(normalizeRow)

    // Create worksheet and workbook
    const ws = XLSX.utils.json_to_sheet(rows, { header: Object.keys(rows[0]) })
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Devices')

    // optional: set column widths
    const cols = Object.keys(rows[0]).map(() => ({ wch: 20 }))
    ws['!cols'] = cols

    // Generate binary and save
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([wbout], { type: 'application/octet-stream' })
    const fileName = `devices_export_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.xlsx`
    saveAs(blob, fileName)
  }

  const exportToPDF = () => {
    if (!filteredDevices || filteredDevices.length === 0) {
      alert('No devices to export.')
      return
    }

    const doc = new jsPDF('l', 'pt', 'a4') // landscape
    const title = 'Devices Export'
    doc.setFontSize(14)
    doc.text(title, 40, 40)

    // Build table columns and rows
    const headers = [
      'No', 'Name', 'Model', 'SDFA Registeration', 'Price', 'Category', 'Subcategory', 'Manufacturer', 'Agent', 'Suppliers'
    ]
    const body = filteredDevices.map((d, index) => [
      index + 1 || '',
      d.name || '',
      d.model || '',
      d.register ? 'Registered' : 'Not-Registered',
      d.price != null ? String(d.price) : '',

      d.category || '',
      d.subcategory || '',
      d.manufacturer?.name || (typeof d.manufacturer === 'string' ? d.manufacturer : ''),
      d.has_agent ? (d.agent || 'Available') : 'No',
      d.suppliers && d.suppliers.length ? d.suppliers.map(s => s.name).join(', ') : '',
    ])

    autoTable(doc, {
      head: [headers],
      body,
      startY: 60,
      styles: { fontSize: 9, cellPadding: 6 },
      headStyles: { fillColor: [40, 40, 40], textColor: 255 },
      theme: 'striped',
      margin: { left: 20, right: 20 },
    })

    const fileName = `devices_export_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.pdf`
    doc.save(fileName)
  }


  // --------- UI ---------
  return (
    <div className='mt-30 w-[90%] sm:w-[80%] mx-auto'>
      {/* Filters + Search + Export */}
      {/* Filters Card */}
      <div className="bg-white p-4 rounded-2xl shadow-md w-full mb-6">
        <div className="flex flex-col lg:flex-row md:items-center  gap-4">

          {/* Search */}
          <div className="flex-1 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search devices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Checkboxes */}
          <div className="flex flex-col   gap-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={register}
                onChange={(e) => setregister(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-black"
              />
              <span className="text-gray-800 text-sm font-medium">Registered</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={notRegister}
                onChange={(e) => setNotRegister(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-black"
              />
              <span className="text-gray-800 text-sm font-medium">Not Registered</span>
            </label>
          </div>

          {/* Category / Subcategory */}
          <div className="flex justify-center mb-4 items-start sm:items-center gap-2">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value)
                  setSubcategoryFilter('all')
                }}
                className="px-3 py-2 rounded-lg border w-full sm:w-auto"
              >
                <option value="all">All</option>
                {categories.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Subcategory</label>
              <select
                value={subcategoryFilter}
                onChange={(e) => setSubcategoryFilter(e.target.value)}
                disabled={categoryFilter === 'all'}
                className="px-3 py-2 rounded-lg border w-full sm:w-auto bg-white disabled:opacity-60"
              >
                <option value="all">All</option>
                {categoryFilter !== 'all' &&
                  devices
                    .filter(d => d.category === categoryFilter)
                    .map(d => d.subcategory)
                    .filter(Boolean)
                    .filter((v, i, a) => a.indexOf(v) === i)
                    .map((sub, idx) => <option key={idx} value={sub}>{sub}</option>)
                }
              </select>
            </div>


          </div>
          {/* Export + Add Device */}
          <div className="flex items-start sm:items-center gap-2">
            <ExportDropdown
              exportToExcel={exportToExcel}
              exportToPDF={exportToPDF}
            />
            <div
              onClick={() => navigate('/add-device')}
              className="px-4 py-2 bg-black text-white rounded-lg cursor-pointer"
            >
              Add Device
            </div>
          </div>


        </div>
      </div>


      {/* Devices grid (same as before) */}
      <AnimatePresence>
        {filteredDevices.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {filteredDevices.map((device, index) => (
              <motion.div
                key={device._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, delay: index * 0.03, ease: 'easeOut' }}
                className='bg-white border rounded-2xl overflow-hidden shadow'
              >
                <img
                  src={device.image || placeholderImage}
                  alt={device.name}
                  className='w-full h-44 object-cover'
                  onError={(e) => { e.target.src = placeholderImage }}
                />
                <div className='p-4 space-y-1'>
                  <h3 className='text-lg font-semibold'>{device.name}</h3>
                  <p className='text-sm text-gray-600'>{device.manufacturer.name}  ({device.manufacturer.country})</p>
                  <p className='text-sm text-gray-600'>{device.category} / {device.subcategory}</p>
                  <p className='text-sm'><strong>Price:</strong> {device.price ?? 'N/A'} SAR</p>
                  {device.register ? <p className='text-sm text-green-500'><strong>Registered</strong>  </p> : <p className='text-sm text-red-400'><strong>Not-Registered</strong>  </p>}

                  <button
                    onClick={() => navigate(`/device/${device._id}`)}
                    className='w-full mt-2 bg-blue-600 text-white py-2 rounded-lg'
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='text-center py-20'>
            <p className='text-gray-500'>No devices found.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Device
