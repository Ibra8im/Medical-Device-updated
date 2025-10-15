import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { Phone, Mail, MapPin, Globe, User, Building2 } from 'lucide-react';
import jsPDF from 'jspdf';

const DistributorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);
  const [distributor, setDistributor] = useState(null);
  const [loading, setLoading] = useState(true);

  const placeholderImage =
    "https://cdn-icons-png.freepik.com/256/11680/11680860.png?semt=ais_white_label";

  useEffect(() => {
    const fetchDistributor = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/distributor/${id}`);
        if (res.data.success) setDistributor(res.data.distributor);
      } catch (error) {
        console.error('Error fetching distributor:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDistributor();
  }, [id, backendUrl]);

  const handleDownloadPDF = async () => {
    if (!distributor) return;

    const doc = new jsPDF();

    // تحميل الصورة كـ Base64
    const loadImageToBase64 = (url) =>
      new Promise((resolve) => {
        const img = new Image();
        img.setAttribute('crossOrigin', 'anonymous'); // لمنع مشاكل CORS
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => resolve(null);
        img.src = url;
      });

    let imageBase64 = await loadImageToBase64(distributor.image || placeholderImage);

    // إضافة الصورة أعلى التقرير
    if (imageBase64) {
      const imgProps = doc.getImageProperties(imageBase64);
      const pdfWidth = 50; // عرض الصورة في PDF بالملم
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(imageBase64, 'PNG', 14, 20, pdfWidth, pdfHeight);
    }

    let y = 20 + 55; // بدء النص بعد الصورة

    // عنوان التقرير
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text("Distributor Details Report", 80, y - 30);

    // اسم الموزع والدولة
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 150);
    doc.text(`${distributor.name}`, 14, y);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Country: ${distributor.country || 'N/A'}`, 14, y + 7);

    // خط فاصل
    doc.setDrawColor(180);
    doc.line(14, y + 10, 195, y + 10);

    y += 20;

    // معلومات الاتصال
    doc.setFontSize(13);
    doc.setTextColor(0, 0, 0);
    doc.text("Contact Information", 14, y);
    y += 8;

    const fields = [
      { label: "Name", value: distributor.contact_name },
      { label: "Email", value: distributor.email },
      { label: "Phone", value: distributor.phone },
      { label: "Telephone", value: distributor.telephone },
      { label: "Address", value: distributor.address },
      { label: "Website", value: distributor.website },
    ];

    doc.setFontSize(11);
    doc.setTextColor(80);
    fields.forEach(field => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(`${field.label}: ${field.value || 'N/A'}`, 14, y);
      y += 6;
    });

    // الوصف
    y += 4;
    doc.setFontSize(13);
    doc.setTextColor(0, 0, 0);
    doc.text("Description:", 14, y);
    y += 6;
    doc.setFontSize(11);
    doc.setTextColor(80);
    doc.text(distributor.description || "No description available.", 14, y, { maxWidth: 180 });

    doc.save(`${distributor.name}_Report.pdf`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <p className="text-gray-500">Loading distributor details...</p>
      </div>
    );
  }

  if (!distributor) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <p className="text-red-500">Distributor not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-20 p-6 bg-white rounded-xl shadow-lg">
      <div className='flex flex-col-reverse mb-10 gap-y-6 md:flex-row items-center justify-between'>
        <div className="flex md:flex-col items-start ">
          <div className='flex items-start gap-3 mb-6' >
            <Building2 className="text-blue-600 w-8 h-8" />
            <h1 className="text-2xl font-bold">{distributor.name}</h1>
          </div>
          <p className="flex items-center text-gray-500 gap-2">
            <Globe className="hidden md:block w-5 h-5 text-blue-300" />
            ({distributor.country || 'N/A'})
          </p>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <img
            src={distributor.image || placeholderImage}
            alt={distributor.name}
            onError={(e) => (e.target.src = placeholderImage)}
            className="w-full max-w-sm h-auto rounded-xl object-cover shadow-md"
          />
        </div>
      </div>

      <h2 className='text-lg font-semibold'>Contact Information:</h2>
      <hr className='mb-7' />
      <div className="space-y-3 text-gray-700">
        <p className="flex items-center gap-2"><User className="w-5 h-5 text-blue-500" /><span className="font-semibold">Name:</span> {distributor.contact_name || ' - '}</p>
        <p className="flex items-center gap-2"><Mail className="w-5 h-5 text-blue-500" /><span className="font-semibold">Email:</span> {distributor.email}</p>
        <p className="flex items-center gap-2"><Phone className="w-5 h-5 text-green-500" /><span className="font-semibold">Phone:</span> {distributor.phone || 'N/A'}</p>
        <p className="flex items-center gap-2"><Phone className="w-5 h-5 text-green-500" /><span className="font-semibold">Telephone:</span> {distributor.telephone || 'N/A'}</p>
        <p className="flex items-center gap-2"><MapPin className="w-5 h-5 text-red-500" /><span className="font-semibold">Address:</span> {distributor.address || 'N/A'}</p>
        <p className="flex items-center gap-2"><Globe className="w-5 h-5 text-purple-500" /><span className="font-semibold">Website:</span> {distributor.website || 'N/A'}</p>
      </div>

      <div className="mt-6">
        <p className="font-semibold mb-2 text-gray-800">Description:</p>
        <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{distributor.description || 'No description available.'}</p>
      </div>

      <div className="mt-6 flex gap-4">
        <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition" onClick={() => navigate(`/edit-supplier/${distributor._id}`)}>Edit</button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition" onClick={handleDownloadPDF}>Download PDF</button>
        <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-400 transition" onClick={() => navigate('/supplier')}>Back</button>
      </div>
    </div>
  );
};

export default DistributorDetails;
