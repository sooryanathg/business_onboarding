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
  const [direction, setDirection] = useState(0); // For animation direction

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('onboardingData');
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (error) {
        console.error("Error parsing saved onboarding data:", error);
        localStorage.removeItem('onboardingData'); // Clear corrupted data
      }
    }
  }, []);

  // Validate form inputs based on the current step
  const validateStep = () => {
    let tempErrors = {};
    if (step === 1) {
      if (!formData.name.trim()) tempErrors.name = 'Name is required.';
      if (!formData.email.trim()) {
        tempErrors.email = 'Email is required.';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        tempErrors.email = 'Please enter a valid email address.';
      }
    } else if (step === 2) {
      if (!formData.companyName.trim()) tempErrors.companyName = 'Company name is required.';
      if (!formData.industry) tempErrors.industry = 'Please select an industry.';
      if (!formData.size) tempErrors.size = 'Please select your company size.';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for the specific field as user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Navigate to the next step
  const handleNext = () => {
    if (validateStep()) {
      setDirection(1); // Set direction for forward animation
      setStep(prevStep => prevStep + 1);
      localStorage.setItem('onboardingData', JSON.stringify(formData));
    }
  };

  // Navigate to the previous step
  const handleBack = () => {
    setDirection(-1); // Set direction for backward animation
    setStep(prevStep => prevStep - 1);
    localStorage.setItem('onboardingData', JSON.stringify(formData));
  };

  // Submit form and navigate to Dashboard
  const handleSubmit = () => {
    if (validateStep()) {
      localStorage.setItem('onboardingData', JSON.stringify(formData));
      // In a real application, you'd typically send this data to a server
      console.log('Onboarding data submitted:', formData);
      navigate('/dashboard', { state: formData });
    }
  };

  // Animation variants for sliding steps
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300, // Increased displacement for more noticeable slide
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300, // Adjust exit direction based on current direction
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    }),
  };

  const progressPercentage = ((step / 3) * 100);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 font-sans">
      <motion.div
        className="bg-white p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Welcome Aboard!</h1>
        <p className="text-gray-600 text-center mb-8">Let's get you set up for success.</p>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            {['Personal Info', 'Business Info', 'Preferences'].map((label, index) => (
              <div
                key={index}
                className={`text-xs sm:text-sm font-semibold transition-colors duration-300 ${
                  step > index + 1
                    ? 'text-green-600'
                    : step === index + 1
                    ? 'text-blue-600'
                    : 'text-gray-400'
                }`}
              >
                {label}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <motion.div
              className="bg-blue-500 h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            ></motion.div>
          </div>
        </div>

        {/* Form Steps with Animation */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="overflow-hidden" // Prevents content overflow during animation
          >
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Personal Details</h2>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base transition-colors duration-200`}
                    placeholder="John Doe"
                    aria-invalid={errors.name ? "true" : "false"}
                    aria-describedby="name-error"
                  />
                  {errors.name && <p id="name-error" className="text-red-600 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base transition-colors duration-200`}
                    placeholder="john.doe@example.com"
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby="email-error"
                  />
                  {errors.email && <p id="email-error" className="text-red-600 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>
            )}

            {/* Step 2: Business Info */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Tell Us About Your Business</h2>
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-4 py-2 border ${errors.companyName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base transition-colors duration-200`}
                    placeholder="Acme Corporation"
                    aria-invalid={errors.companyName ? "true" : "false"}
                    aria-describedby="companyName-error"
                  />
                  {errors.companyName && <p id="companyName-error" className="text-red-600 text-xs mt-1">{errors.companyName}</p>}
                </div>
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <select
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-4 py-2 border ${errors.industry ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base bg-white transition-colors duration-200`}
                    aria-invalid={errors.industry ? "true" : "false"}
                    aria-describedby="industry-error"
                  >
                    <option value="">Select your industry</option>
                    <option value="Tech">Technology</option>
                    <option value="Finance">Finance & Banking</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Retail">Retail & E-commerce</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Education">Education</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.industry && <p id="industry-error" className="text-red-600 text-xs mt-1">{errors.industry}</p>}
                </div>
                <div>
                  <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
                  <select
                    id="size"
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-4 py-2 border ${errors.size ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base bg-white transition-colors duration-200`}
                    aria-invalid={errors.size ? "true" : "false"}
                    aria-describedby="size-error"
                  >
                    <option value="">Select company size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501+">501+ employees</option>
                  </select>
                  {errors.size && <p id="size-error" className="text-red-600 text-xs mt-1">{errors.size}</p>}
                </div>
              </div>
            )}

            {/* Step 3: Preferences */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Set Your Preferences</h2>
                <div>
                  <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                  <select
                    id="theme"
                    name="theme"
                    value={formData.theme}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base bg-white transition-colors duration-200"
                  >
                    <option value="light">Light Mode</option>
                    <option value="dark">Dark Mode</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="layout" className="block text-sm font-medium text-gray-700 mb-1">Default Dashboard Layout</label>
                  <select
                    id="layout"
                    name="layout"
                    value={formData.layout}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-base bg-white transition-colors duration-200"
                  >
                    <option value="grid">Grid View</option>
                    <option value="list">List View</option>
                  </select>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className={`flex ${step > 1 ? 'justify-between' : 'justify-end'} mt-8`}>
          {step > 1 && (
            <motion.button
              onClick={handleBack}
              className="btn-secondary" // Now correctly uses the custom component class
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Back
            </motion.button>
          )}
          {step < 3 ? (
            <motion.button
              onClick={handleNext}
              className="btn-primary" // Now correctly uses the custom component class
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Next
            </motion.button>
          ) : (
            <motion.button
              onClick={handleSubmit}
              className="btn-accent" // Now correctly uses the custom component class
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
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