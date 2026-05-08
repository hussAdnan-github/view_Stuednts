import React, { useState } from 'react';
import axios from 'axios';
import { Home, MapPin, Users, DollarSign, Waves, Loader2, CheckCircle2 } from 'lucide-react';

function App() {
  const [formData, setFormData] = useState({
    longitude: -122.23,
    latitude: 37.88,
    housing_median_age: 41,
    total_rooms: 880,
    total_bedrooms: 129,
    population: 322,
    households: 126,
    median_income: 8.32,
    ocean_proximity: 'NEAR BAY'
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'ocean_proximity' ? value : parseFloat(value)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('https://house-regression.onrender.com/predict', formData);
      setPrediction(response.data.prediction);
    } catch (err) {
      setError("فشل الاتصال بالخادم. تأكد من تشغيل الـ API.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-right" dir="rtl">
      {/* Header */}
      <header className="bg-blue-700 text-white py-8 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3">
            <Home size={32} />
            <h1 className="text-3xl font-bold">نظام التنبؤ بأسعار المنازل</h1>
          </div>
          <p className="text-center mt-2 text-blue-100">أدخل بيانات المنطقة للحصول على السعر التقديري للمنزل</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form Section */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Location Data */}
              <div className="md:col-span-2 border-b pb-2 mb-2">
                <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                  <MapPin size={20} className="text-blue-600" /> البيانات الجغرافية
                </h2>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">خطي الطول (Longitude)</label>
                <input type="number" step="any" name="longitude" value={formData.longitude} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">دائرة العرض (Latitude)</label>
                <input type="number" step="any" name="latitude" value={formData.latitude} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
              </div>

              {/* House Data */}
              <div className="md:col-span-2 border-b pb-2 mb-2 mt-4">
                <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                  <Home size={20} className="text-green-600" /> تفاصيل العقارات
                </h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">متوسط عمر البناء</label>
                <input type="number" min="0" max="100" name="housing_median_age" value={formData.housing_median_age} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">إجمالي الغرف</label>
                <input type="number" min="0" max="10000" name="total_rooms" value={formData.total_rooms} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">إجمالي غرف النوم</label>
                <input type="number" min="0" max="5000" name="total_bedrooms" value={formData.total_bedrooms} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">القرب من المحيط</label>
                <select name="ocean_proximity" value={formData.ocean_proximity} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <option value="<1H OCEAN">أقل من ساعة واحدة في المحيط</option>
                  <option value="INLAND">داخلي</option>
                  <option value="NEAR OCEAN">بالقرب من المحيط</option>
                  <option value="NEAR BAY">بالقرب من الخليج</option>
                  <option value="ISLAND">جزيرة</option>
                </select>
              </div>

              {/* Socio-economic Data */}
              <div className="md:col-span-2 border-b pb-2 mb-2 mt-4">
                <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                  <Users size={20} className="text-purple-600" /> السكان والدخل
                </h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">عدد السكان</label>
                <input type="number" name="population" value={formData.population} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">عدد الأسر (Households)</label>
                <input type="number" name="households" value={formData.households} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">متوسط الدخل (بالآلاف)</label>
                <input type="number" step="any" name="median_income" value={formData.median_income} onChange={handleChange} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
              </div>

              <div className="md:col-span-2 mt-6">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md disabled:bg-blue-400"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "تحليل وتوقع السعر"}
                </button>
              </div>
            </form>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sticky top-8">
              <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">النتيجة المتوقعة</h2>
              
              {!prediction && !loading && !error && (
                <div className="text-center py-10">
                  <div className="bg-slate-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <DollarSign size={40} className="text-slate-400" />
                  </div>
                  <p className="text-slate-500">أدخل البيانات واضغط على توقع لعرض السعر هنا</p>
                </div>
              )}

              {loading && (
                <div className="text-center py-10">
                  <Loader2 size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-slate-600 font-medium">جاري معالجة البيانات...</p>
                </div>
              )}

              {prediction && !loading && (
                <div className="text-center animate-fade-in">
                  <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={40} className="text-green-600" />
                  </div>
                  <p className="text-slate-500 mb-2 font-medium">السعر التقديري للمنزل:</p>
                  <div className="text-4xl font-black text-slate-900 mb-2">
                    ${prediction.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </div>
                  <div className="inline-block px-4 py-1 bg-green-50 text-green-700 rounded-full text-sm font-semibold border border-green-200">
                    تم التنبؤ بنجاح
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm text-center">
                  {error}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
      
       
    </div>
  );
}

export default App;