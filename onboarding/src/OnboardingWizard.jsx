import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const OnboardingWizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    companyName: '',
    industry: '',
    size: '',
    theme: 'light',
    layout: 'grid',
  });
  const [errors, setErrors] = useState({});

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('onboardingData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  // Validate form inputs based on the current step
  const validateStep = () => {
    let tempErrors = {};
    if (step === 1) {
      if (!formData.name.trim()) tempErrors.name = 'Name is required';
      if (!formData.email.trim()) tempErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = 'Email is invalid';
    } else if (step === 2) {
      if (!formData.companyName.trim()) tempErrors.companyName = 'Company name is required';
      if (!formData.industry) tempErrors.industry = 'Industry is required';
      if (!formData.size) tempErrors.size = 'Company size is required';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  // Navigate to the next step
  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
      // Save to localStorage on each step
      localStorage.setItem('onboardingData', JSON.stringify(formData));
    }
  };

  // Navigate to the previous step
  const handleBack = () => {
    setStep(step - 1);
    localStorage.setItem('onboardingData', JSON.stringify(formData));
  };

  // Submit form and navigate to Dashboard
  const handleSubmit = () => {
    if (validateStep()) {
      localStorage.setItem('onboardingData', JSON.stringify(formData));
      navigate('/dashboard', { state: formData });
    }
  };

  // Animation variants for sliding steps
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg lg:max-w-xl"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {['Personal Info', 'Business Info', 'Preferences'].map((label, index) => (
              <div
                key={index}
                className={`text-xs sm:text-sm ${
                  step > index + 1 ? 'text-green-500' : step === index + 1 ? 'text-blue-500' : 'text-gray-400'
                }`}
              >
                {label}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            ></motion.div>
          </div>
        </div>

        {/* Form Steps with Animation */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            custom={step}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-4">Personal Info</h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  />
                  {errors.name && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.name}</p>}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  />
                  {errors.email && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email}</p>}
                </div>
              </div>
            )}

            {/* Step 2: Business Info */}
            {step === 2 && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-4">Business Info</h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  />
                  {errors.companyName && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.companyName}</p>}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Industry</label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  >
                    <option value="">Select Industry</option>
                    <option value="Tech">Tech</option>
                    <option value="Finance">Finance</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Retail">Retail</option>
                  </select>
                  {errors.industry && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.industry}</p>}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Company Size</label>
                  <select
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  >
                    <option value="">Select Size</option>
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-200">51-200</option>
                    <option value="201+">201+</option>
                  </select>
                  {errors.size && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.size}</p>}
                </div>
              </div>
            )}

            {/* Step 3: Preferences */}
            {step === 3 && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-4">Preferences</h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Theme</label>
                  <select
                    name="theme"
                    value={formData.theme}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Default Dashboard Layout</label>
                  <select
                    name="layout"
                    value={formData.layout}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  >
                    <option value="grid">Grid</option>
                    <option value="list">List</option>
                  </select>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <motion.button
              onClick={handleBack}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors text-sm sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back
            </motion.button>
          )}
          {step < 3 ? (
            <motion.button
              onClick={handleNext}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors text-sm sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Next
            </motion.button>
          ) : (
            <motion.button
              onClick={handleSubmit}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors text-sm sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingWizard;