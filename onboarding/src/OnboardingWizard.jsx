import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Building2, Palette, Check, ArrowRight, ArrowLeft, Sparkles, Zap, Shield, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OnboardingWizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    companyName: '',
    industry: '',
    size: '',
    theme: 'dark', 
    layout: 'grid',
  });
  const [errors, setErrors] = useState({});
  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  

  
  useEffect(() => {
    const savedData = localStorage.getItem('onboardingData');
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (error) {
        console.error("Error parsing saved onboarding data from localStorage:", error);
        localStorage.removeItem('onboardingData');
      }
    }
  }, []);

  useEffect(() => {
    if (formData.name !== '' || formData.email !== '' || formData.companyName !== '') {
      localStorage.setItem('onboardingData', JSON.stringify(formData));
    }
  }, [formData]);


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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setDirection(1);
      setStep(prevStep => prevStep + 1);
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setStep(prevStep => prevStep - 1);
  };

  const handleSubmit = async () => {
    if (validateStep()) {
      setIsSubmitting(true);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Onboarding data submitted:', formData);
      localStorage.removeItem('onboardingData');
      navigate('/dashboard', { state: formData });
      setIsSubmitting(false);
    }
  };

  const stepVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      rotateY: direction > 0 ? 90 : -90,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      rotateY: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        opacity: { duration: 0.3 }
      }
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      rotateY: direction < 0 ? 90 : -90,
      scale: 0.8,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        opacity: { duration: 0.3 }
      }
    }),
  };

  const progressPercentage = ((step / 3) * 100);

  const steps = [
    { icon: User, title: 'Personal Info', subtitle: 'Tell us about yourself' },
    { icon: Building2, title: 'Business Info', subtitle: 'Your company details' },
    { icon: Palette, title: 'Preferences', subtitle: 'Customize your experience' }
  ];

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gray-50"> 
      
      <div className="absolute inset-0 opacity-10"
           style={{ background: 'url(/path-to-subtle-pattern.svg) repeat' }}>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100 w-full max-w-lg relative overflow-hidden"
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          
          <div className="relative z-10 text-center mb-10">
            
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Welcome</h1>
            <p className="text-gray-600 text-lg font-medium">Let's get you set up</p> 
          </div>

          
          <div className="mb-10">
            <div className="flex justify-between items-center mb-6">
              {steps.map((stepInfo, index) => {
                const StepIcon = stepInfo.icon;
                const isActive = step === index + 1;
                const isCompleted = step > index + 1;

                return (
                  <motion.div
                    key={index}
                    className="flex flex-col items-center relative"
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div
                      className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 ${ 
                        isCompleted
                          ? 'bg-emerald-500 shadow-md shadow-emerald-200' 
                          : isActive
                          ? 'bg-blue-600 shadow-md shadow-blue-200' 
                          : 'bg-gray-200 border border-gray-300' 
                      }`}
                      animate={isActive ? { scale: [1, 1.1, 1] } : {}} 
                      transition={{ duration: 0.5 }}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : (
                        <StepIcon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                      )}
                    </motion.div>
                    <div className="text-center">
                      <p className={`text-sm font-semibold ${
                        isCompleted || isActive ? 'text-gray-800' : 'text-gray-500'
                      }`}>
                        {stepInfo.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{stepInfo.subtitle}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-2"> 
                <motion.div
                  className="bg-blue-600 h-2 rounded-full" 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>

          
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="min-h-[300px]"
            >
              
              {step === 1 && (
                <div className="space-y-6">
                  <motion.h2
                    className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <User className="w-6 h-6 text-blue-500" /> 
                    Personal Details
                  </motion.h2>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white border ${ 
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200`} 
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <motion.p
                        className="text-red-500 text-sm mt-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {errors.name}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white border ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200`}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <motion.p
                        className="text-red-500 text-sm mt-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </motion.div>
                </div>
              )}

              
              {step === 2 && (
                <div className="space-y-6">
                  <motion.h2
                    className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Building2 className="w-6 h-6 text-blue-500" />
                    Business Information
                  </motion.h2>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white border ${
                        errors.companyName ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200`}
                      placeholder="Your company name"
                    />
                    {errors.companyName && (
                      <motion.p className="text-red-500 text-sm mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        {errors.companyName}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Industry</label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white border ${
                        errors.industry ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200`}
                    >
                      <option value="" className="text-gray-400">Select your industry</option>
                      <option value="Tech" className="bg-white text-gray-900">Technology</option>
                      <option value="Finance" className="bg-white text-gray-900">Finance & Banking</option>
                      <option value="Healthcare" className="bg-white text-gray-900">Healthcare</option>
                      <option value="Retail" className="bg-white text-gray-900">Retail & E-commerce</option>
                      <option value="Manufacturing" className="bg-white text-gray-900">Manufacturing</option>
                      <option value="Education" className="bg-white text-gray-900">Education</option>
                      <option value="Other" className="bg-white text-gray-900">Other</option>
                    </select>
                    {errors.industry && (
                      <motion.p className="text-red-500 text-sm mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        {errors.industry}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Company Size</label>
                    <select
                      name="size"
                      value={formData.size}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white border ${
                        errors.size ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200`}
                    >
                      <option value="" className="text-gray-400">Select company size</option>
                      <option value="1-10" className="bg-white text-gray-900">1-10 employees</option>
                      <option value="11-50" className="bg-white text-gray-900">11-50 employees</option>
                      <option value="51-200" className="bg-white text-gray-900">51-200 employees</option>
                      <option value="201-500" className="bg-white text-gray-900">201-500 employees</option>
                      <option value="501+" className="bg-white text-gray-900">501+ employees</option>
                    </select>
                    {errors.size && (
                      <motion.p className="text-red-500 text-sm mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        {errors.size}
                      </motion.p>
                    )}
                  </motion.div>
                </div>
              )}

              
              {step === 3 && (
                <div className="space-y-6">
                  <motion.h2
                    className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Palette className="w-6 h-6 text-blue-500" />
                    Your Preferences
                  </motion.h2>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-4">Choose Theme</label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { value: 'light', label: 'Light Mode', icon: '☀️' },
                        { value: 'dark', label: 'Dark Mode', icon: '🌙' }
                      ].map((theme) => (
                        <motion.label
                          key={theme.value}
                          className={`relative flex items-center justify-center p-4 rounded-lg cursor-pointer border-2 transition-all duration-200 ${ 
                            formData.theme === theme.value
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-300 bg-white hover:border-gray-400'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <input
                            type="radio"
                            name="theme"
                            value={theme.value}
                            checked={formData.theme === theme.value}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <div className="text-center">
                            <div className="text-2xl mb-2">{theme.icon}</div>
                            <div className="text-gray-800 font-medium">{theme.label}</div>
                          </div>
                          {formData.theme === theme.value && (
                            <motion.div
                              className="absolute top-2 right-2"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                            >
                              <Check className="w-5 h-5 text-blue-600" /> 
                            </motion.div>
                          )}
                        </motion.label>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-4">Dashboard Layout</label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { value: 'grid', label: 'Grid View', icon: '⚏' },
                        { value: 'list', label: 'List View', icon: '☰' }
                      ].map((layout) => (
                        <motion.label
                          key={layout.value}
                          className={`relative flex items-center justify-center p-4 rounded-lg cursor-pointer border-2 transition-all duration-200 ${
                            formData.layout === layout.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 bg-white hover:border-gray-400'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <input
                            type="radio"
                            name="layout"
                            value={layout.value}
                            checked={formData.layout === layout.value}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <div className="text-center">
                            <div className="text-2xl mb-2">{layout.icon}</div>
                            <div className="text-gray-800 font-medium">{layout.label}</div>
                          </div>
                          {formData.layout === layout.value && (
                            <motion.div
                              className="absolute top-2 right-2"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                            >
                              <Check className="w-5 h-5 text-blue-600" />
                            </motion.div>
                          )}
                        </motion.label>
                      ))}
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          
          <motion.div
            className={`flex ${step > 1 ? 'justify-between' : 'justify-end'} mt-10 gap-4`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {step > 1 && (
              <motion.button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 bg-transparent border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition-all duration-200" 
                whileHover={{ scale: 1.02, x: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </motion.button>
            )}

            {step < 3 ? (
              <motion.button
                onClick={handleNext}
                className="flex items-center gap-2 px-8 py-3 bg-blue-600 rounded-lg text-white font-bold shadow-md shadow-blue-200 hover:bg-blue-700 transition-all duration-200" 
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 bg-emerald-500 rounded-lg text-white font-bold shadow-md shadow-emerald-200 hover:bg-emerald-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Submit
                  </>
                )}
              </motion.button>
            )}
          </motion.div>

          
          <motion.div
            className="flex items-center justify-center gap-6 mt-8 text-gray-500 text-sm" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4 text-gray-400" /> 
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-gray-400" />
              <span>Premium</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-gray-400" />
              <span>Fast Setup</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingWizard;