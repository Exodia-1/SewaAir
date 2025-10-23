import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { useToast } from '../hooks/use-toast';
import { Plane, CalendarIcon, Shield, CheckCircle2, Award, Lock, Globe, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

const ConsentForm = () => {
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    address: '',
    passportNumber: '',
    dateOfBirth: null,
  });
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[+]?[0-9]{10,15}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.passportNumber.trim()) {
      newErrors.passportNumber = 'Passport number is required';
    } else if (!/^[A-Z0-9]{6,9}$/.test(formData.passportNumber.toUpperCase())) {
      newErrors.passportNumber = 'Please enter a valid passport number';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    if (!disclaimerAccepted) {
      newErrors.disclaimer = 'You must accept the disclaimer to proceed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please fill all required fields correctly.',
      });
      return;
    }

    const submissionId = `SEWA-${Date.now()}`;
    const submission = {
      id: submissionId,
      ...formData,
      dateOfBirth: formData.dateOfBirth ? format(formData.dateOfBirth, 'dd/MM/yyyy') : '',
      submittedAt: new Date().toISOString(),
    };

    const existingSubmissions = JSON.parse(localStorage.getItem('sewaAirSubmissions') || '[]');
    existingSubmissions.push(submission);
    localStorage.setItem('sewaAirSubmissions', JSON.stringify(existingSubmissions));

    toast({
      title: 'Success!',
      description: `Your consent form has been submitted successfully. ID: ${submissionId}`,
    });

    setFormData({
      name: '',
      phoneNumber: '',
      address: '',
      passportNumber: '',
      dateOfBirth: null,
    });
    setDisclaimerAccepted(false);
    setErrors({});
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-amber-50">
      {/* Animated Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-red-900 via-red-800 to-red-900 text-white shadow-2xl backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-400 rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-3 rounded-lg shadow-xl transform group-hover:scale-110 transition-transform duration-300">
                  <Plane className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white to-amber-200">
                  SewaAir
                </h1>
                <p className="text-red-100 text-sm font-light">Your Journey, Our Commitment</p>
              </div>
            </div>
            <a
              href="/admin"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-red-100 hover:text-white transition-all duration-300 text-sm font-medium border border-white/20 hover:border-white/40 transform hover:scale-105"
            >
              Admin Access
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section with Background */}
      <div className="relative overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/95 via-purple-900/90 to-red-900/95 z-10"></div>
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
        
        <div className="relative z-20 container mx-auto px-4 py-20 text-center">
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-block mb-6 p-4 bg-white/10 backdrop-blur-md rounded-full">
              <Shield className="h-16 w-16 text-amber-400 animate-pulse" />
            </div>
            <h2 className="text-5xl font-bold mb-6 text-white drop-shadow-lg">
              Passenger Consent Form
            </h2>
            <p className="text-xl text-red-100 max-w-2xl mx-auto leading-relaxed">
              Secure your travel journey with our comprehensive consent process
            </p>
            
            {/* Trust Badges */}
            <div className="flex justify-center gap-8 mt-12 flex-wrap">
              <div className="flex items-center gap-2 text-white/90">
                <Lock className="h-5 w-5 text-amber-400" />
                <span className="text-sm font-medium">Secure & Encrypted</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Globe className="h-5 w-5 text-amber-400" />
                <span className="text-sm font-medium">Global Standards</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Clock className="h-5 w-5 text-amber-400" />
                <span className="text-sm font-medium">Instant Processing</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group text-center p-8 rounded-2xl hover:bg-gradient-to-br hover:from-red-50 hover:to-amber-50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl">
              <div className="inline-block p-4 bg-gradient-to-br from-red-100 to-red-200 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <Award className="h-8 w-8 text-red-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Trusted Service</h3>
              <p className="text-gray-600">Industry-leading compliance and security standards</p>
            </div>
            
            <div className="group text-center p-8 rounded-2xl hover:bg-gradient-to-br hover:from-red-50 hover:to-amber-50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl">
              <div className="inline-block p-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-8 w-8 text-amber-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Data Protection</h3>
              <p className="text-gray-600">Your information is secured with enterprise-grade encryption</p>
            </div>
            
            <div className="group text-center p-8 rounded-2xl hover:bg-gradient-to-br hover:from-red-50 hover:to-amber-50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl">
              <div className="inline-block p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle2 className="h-8 w-8 text-purple-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Quick Process</h3>
              <p className="text-gray-600">Complete your consent form in under 5 minutes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Card className="shadow-2xl border-0 overflow-hidden backdrop-blur-sm bg-white/95">
          <CardHeader className="bg-gradient-to-r from-red-50 via-white to-amber-50 border-b-2 border-red-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-red-600 to-red-700 rounded-lg">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl text-red-900">Personal Information</CardTitle>
                <CardDescription className="text-gray-600">
                  All fields are mandatory. Please ensure the information provided is accurate.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-8 pb-8 px-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2 group">
                <Label htmlFor="name" className="text-gray-700 font-semibold text-sm uppercase tracking-wide">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name as per passport"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={cn(
                    "transition-all duration-300 focus:ring-2 focus:ring-red-500 focus:scale-[1.02] border-2",
                    errors.name ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-red-300"
                  )}
                />
                {errors.name && <p className="text-sm text-red-600 animate-pulse">{errors.name}</p>}
              </div>

              {/* Phone Number Field */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-gray-700 font-semibold text-sm uppercase tracking-wide">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  placeholder="+91 1234567890"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className={cn(
                    "transition-all duration-300 focus:ring-2 focus:ring-red-500 focus:scale-[1.02] border-2",
                    errors.phoneNumber ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-red-300"
                  )}
                />
                {errors.phoneNumber && <p className="text-sm text-red-600 animate-pulse">{errors.phoneNumber}</p>}
              </div>

              {/* Address Field */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-gray-700 font-semibold text-sm uppercase tracking-wide">Residential Address *</Label>
                <Textarea
                  id="address"
                  placeholder="Enter your complete address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={cn(
                    "min-h-24 transition-all duration-300 focus:ring-2 focus:ring-red-500 focus:scale-[1.02] border-2 resize-none",
                    errors.address ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-red-300"
                  )}
                />
                {errors.address && <p className="text-sm text-red-600 animate-pulse">{errors.address}</p>}
              </div>

              {/* Passport Number Field */}
              <div className="space-y-2">
                <Label htmlFor="passportNumber" className="text-gray-700 font-semibold text-sm uppercase tracking-wide">Passport Number *</Label>
                <Input
                  id="passportNumber"
                  placeholder="e.g., A1234567"
                  value={formData.passportNumber}
                  onChange={(e) => handleInputChange('passportNumber', e.target.value.toUpperCase())}
                  className={cn(
                    "uppercase transition-all duration-300 focus:ring-2 focus:ring-red-500 focus:scale-[1.02] border-2 font-mono",
                    errors.passportNumber ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-red-300"
                  )}
                />
                {errors.passportNumber && <p className="text-sm text-red-600 animate-pulse">{errors.passportNumber}</p>}
              </div>

              {/* Date of Birth Field */}
              <div className="space-y-2">
                <Label className="text-gray-700 font-semibold text-sm uppercase tracking-wide">Date of Birth *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal transition-all duration-300 hover:scale-[1.02] border-2",
                        !formData.dateOfBirth && "text-muted-foreground",
                        errors.dateOfBirth ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-red-300"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-red-600" />
                      {formData.dateOfBirth ? format(formData.dateOfBirth, 'dd/MM/yyyy') : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.dateOfBirth}
                      onSelect={(date) => handleInputChange('dateOfBirth', date)}
                      disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.dateOfBirth && <p className="text-sm text-red-600 animate-pulse">{errors.dateOfBirth}</p>}
              </div>

              {/* Disclaimer Section */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6 space-y-4 shadow-inner">
                <h3 className="font-bold text-lg text-amber-900 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Consent & Disclaimer
                </h3>
                <div className="text-sm text-gray-700 space-y-3 leading-relaxed">
                  <p className="font-medium">
                    By submitting this form, I hereby acknowledge and agree to the following:
                  </p>
                  <ul className="list-none space-y-2 ml-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>All information provided is accurate and complete to the best of my knowledge</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>I consent to SewaAir processing my personal data for travel-related services</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>I understand that false information may result in denial of services</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>I agree to comply with all applicable travel regulations and airline policies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>I authorize SewaAir to contact me using the provided contact information</span>
                    </li>
                  </ul>
                </div>
                <div className="flex items-start space-x-3 pt-3 bg-white/50 rounded-lg p-4 border border-amber-200">
                  <Checkbox
                    id="disclaimer"
                    checked={disclaimerAccepted}
                    onCheckedChange={setDisclaimerAccepted}
                    className="mt-1"
                  />
                  <Label
                    htmlFor="disclaimer"
                    className="text-sm font-semibold leading-relaxed cursor-pointer text-gray-800"
                  >
                    I have read and agree to the above terms and conditions *
                  </Label>
                </div>
                {errors.disclaimer && <p className="text-sm text-red-600 font-semibold animate-pulse">{errors.disclaimer}</p>}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-red-700 via-red-800 to-red-900 hover:from-red-800 hover:via-red-900 hover:to-red-950 text-white font-bold py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] border-2 border-red-900 hover:border-amber-500"
              >
                <CheckCircle2 className="mr-3 h-6 w-6 animate-pulse" />
                Submit Consent Form
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="text-center mt-12 space-y-4">
          <div className="flex justify-center gap-6 text-gray-600 text-sm">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-red-600" />
              <span>SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-red-600" />
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-red-600" />
              <span>ISO Certified</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Your privacy is important to us. All data is stored securely and used only for authorized purposes.
            We comply with international data protection regulations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConsentForm;