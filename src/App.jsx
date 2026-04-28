import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, BookOpen, Activity, GraduationCap, 
  Clock, AlertCircle, CheckCircle2, ChevronRight 
} from 'lucide-react';

const App = () => {
  const [formData, setFormData] = useState({
    Age: 16, Gender: 0, Ethnicity: 0, ParentalEducation: 1,
    StudyTimeWeekly: 10, Absences: 0, Tutoring: 0,
    ParentalSupport: 2, Extracurricular: 0, Sports: 0,
    Music: 0, Volunteering: 0
  });
const gradeMapping = {
  "0": "A (ممتاز)",
  "1": "B (جيد جداً)",
  "2": "C (جيد)",
  "3": "D (مقبول)",
  "4": "F (راسب)"
};
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
   setFormData(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    // 1. استخدام POST بدلاً من GET
    const response = await axios.post('https://student-performance-ead0.onrender.com/predict', formData);
    
    // 2. الوصول للمفتاح الصحيح (prediction) الذي حددناه في FastAPI
    setPrediction(response.data.prediction); 
    
  } catch (error) {
    console.error("خطأ في الاتصال بالخادم", error);
    alert("فشل في جلب النتيجة من الخادم");
  }
  setLoading(false);
};

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 dir-rtl" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b py-6 px-4 mb-8">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <GraduationCap size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">نظام EduPredict للتنبؤ بالأداء الأكاديمي</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form Section */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* القسم الأول: معلومات الطالب */}
              <Card title="المعلومات العامة" icon={<User className="text-blue-500" />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputSelect label="العمر" name="Age" value={formData.Age} onChange={handleChange} options={[15,16,17,18]} />
                  <InputSelect label="الجنس" name="Gender" value={formData.Gender} onChange={handleChange} options={{0: 'ذكر', 1: 'أنثى'}} />
                  <InputSelect label="العرق" name="Ethnicity" value={formData.Ethnicity} onChange={handleChange} options={{0: 'أوروبي', 1: 'أفريقي', 2: 'آسيوي', 3: 'آخر'}} />
                  <InputSelect label="تعليم الوالدين" name="ParentalEducation" value={formData.ParentalEducation} onChange={handleChange} options={{0:'لا يوجد', 1:'ثانوي', 2:'جامعي جزئي', 3:'بكالوريوس', 4:'أعلى'}} />
                </div>
              </Card>

              {/* القسم الثاني: العادات الدراسية */}
              <Card title="العادات الدراسية" icon={<BookOpen className="text-emerald-500" />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">ساعات الدراسة الأسبوعية ({formData.StudyTimeWeekly})</label>
                    <input type="range" name="StudyTimeWeekly" min="0" max="20" step="0.5" value={formData.StudyTimeWeekly} onChange={handleChange} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                  </div>
                  <InputNumber label="عدد مرات الغياب (أعلى غياب 30)" name="Absences" value={formData.Absences} onChange={handleChange} max={30} />
                  <InputSelect label="دعم الوالدين" name="ParentalSupport" value={formData.ParentalSupport} onChange={handleChange} options={{0:'منعدم', 1:'منخفض', 2:'متوسط', 3:'عالي', 4:'ممتاز'}} />
                  <InputSelect label="دروس خصوصية" name="Tutoring" value={formData.Tutoring} onChange={handleChange} options={{0:'لا', 1:'نعم'}} />
                </div>
              </Card>

              {/* القسم الثالث: الأنشطة */}
              <Card title="الأنشطة" icon={<Activity className="text-orange-500" />}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <ToggleButton label="رياضة" name="Sports" value={formData.Sports} onClick={handleChange} />
                  <ToggleButton label="موسيقى" name="Music" value={formData.Music} onClick={handleChange} />
                  <ToggleButton label="تطوع" name="Volunteering" value={formData.Volunteering} onClick={handleChange} />
                  <ToggleButton label="أنشطة أخرى" name="Extracurricular" value={formData.Extracurricular} onClick={handleChange} />
                </div>
              </Card>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
              >
                {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "تحليل النتيجة المتوقعة"}
              </button>
            </form>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <AnimatePresence mode="wait">
                {!prediction ? (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="bg-white p-8 rounded-2xl border-2 border-dashed border-slate-200 text-center text-slate-400"
                  >
                    <Clock size={48} className="mx-auto mb-4 opacity-20" />
                    <p>قم بتعبئة البيانات والضغط على زر التحليل لعرض النتائج</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100 text-center"
                  >
                    <CheckCircle2 size={64} className="mx-auto mb-4 text-emerald-500" />
                    <h3 className="text-xl font-bold text-slate-700 mb-2">النتيجة المتوقعة:</h3>
                    <div className="text-3xl font-black text-blue-600 p-4 bg-blue-50 rounded-xl mb-6">
                     {gradeMapping[prediction] || prediction}
                    </div>
                    <div className="text-right space-y-3">
                      <div className="text-sm text-slate-500 flex items-center gap-2">
                        <AlertCircle size={16} />
                        نصيحة: زيادة ساعات الدراسة قد ترفع التقدير.
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// مكونات صغيرة (Sub-components) لتحسين نظافة الكود
const Card = ({ title, icon, children }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
    <div className="flex items-center gap-2 mb-6 border-b pb-4">
      {icon}
      <h2 className="font-bold text-slate-700">{title}</h2>
    </div>
    {children}
  </div>
);

const InputSelect = ({ label, name, value, onChange, options }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-slate-600">{label}</label>
    <select name={name} value={value} onChange={onChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all">
      {Array.isArray(options) 
        ? options.map(opt => <option key={opt} value={opt}>{opt}</option>)
        : Object.entries(options).map(([val, text]) => <option key={val} value={val}>{text}</option>)
      }
    </select>
  </div>
);

const InputNumber = ({ label, name, value, onChange, max }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-slate-600">{label}</label>
    <input type="number" name={name} value={value} onChange={onChange} min="0" max={max} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
  </div>
);

const ToggleButton = ({ label, name, value, onClick }) => (
  <button
    type="button"
    onClick={() => onClick({ target: { name, value: value === 1 ? 0 : 1 } })}
    className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
      value === 1 ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 bg-slate-50 text-slate-400'
    }`}
  >
    <div className={`w-4 h-4 rounded-full ${value === 1 ? 'bg-blue-500' : 'bg-slate-300'}`} />
    <span className="text-xs font-bold">{label}</span>
  </button>
);

export default App;