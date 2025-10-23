import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { useToast } from '../hooks/use-toast';
import { Plane, CalendarIcon, Shield, CheckCircle2, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

const ConsentForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    address: '',
    passportNumber: '',
    dateOfBirth: null,
  });
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submissionId, setSubmissionId] = useState('');

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

    const id = `SEWA-${Date.now()}`;
    const submission = {
      id: id,
      ...formData,
      dateOfBirth: formData.dateOfBirth ? format(formData.dateOfBirth, 'dd/MM/yyyy') : '',
      submittedAt: new Date().toISOString(),
    };

    const existingSubmissions = JSON.parse(localStorage.getItem('sewaAirSubmissions') || '[]');
    existingSubmissions.push(submission);
    localStorage.setItem('sewaAirSubmissions', JSON.stringify(existingSubmissions));

    setSubmissionId(id);
    setShowSuccessModal(true);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-stone-50">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-8 text-center">
              <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Raleway, sans-serif' }}>Form Submitted</h3>
              <p className="text-amber-50 text-lg" style={{ fontFamily: 'Raleway, sans-serif' }}>
                Your consent form has been successfully received
              </p>
            </div>
            <div className="p-8">
              <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
                <p className="text-sm text-gray-600 mb-2 font-medium" style={{ fontFamily: 'Raleway, sans-serif' }}>Reference ID</p>
                <p className="text-3xl font-bold text-gray-900 font-mono tracking-tight">{submissionId}</p>
              </div>
              <p className="text-gray-600 text-center mb-6" style={{ fontFamily: 'Raleway, sans-serif' }}>
                Please save this reference ID for your records
              </p>
              <Button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-6 text-lg rounded-xl"
                style={{ fontFamily: 'Raleway, sans-serif' }}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Elegant Header with Refined Logo */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <h1 className="text-4xl tracking-wide" style={{ fontFamily: 'Raleway, sans-serif' }}>
                  <span style={{ fontWeight: 600, color: '#292524', letterSpacing: '1px' }}>Sewa</span>
                  <span style={{ fontWeight: 300, color: '#78716c', letterSpacing: '2px' }}>Air</span>
                </h1>
                {/* Elegant Swoosh */}
                <svg className="h-12 w-16 ml-1" viewBox="0 0 80 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 45C15 40 25 33 35 25C45 17 55 9 75 2C70 6 60 13 50 20C40 27 30 35 20 42C15 45 10 47 5 45Z" 
                        fill="#d97706" 
                        opacity="0.8"/>
                  <path d="M8 42C18 37 28 30 38 22C48 14 58 6 78 0C73 4 63 11 53 18C43 25 33 33 23 40C18 43 13 45 8 42Z" 
                        fill="#b45309" 
                        opacity="0.6"/>
                </svg>
              </div>
            </div>
            <a
              href="/admin"
              className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 rounded-lg text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
              style={{ fontFamily: 'Raleway, sans-serif', letterSpacing: '0.5px' }}
            >
              <Lock className="h-4 w-4" />
              Admin
            </a>
          </div>
        </div>
      </header>

      {/* Elegant Hero */}
      <div className="relative overflow-hidden py-20">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=80)',
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900/70 via-amber-900/60 to-stone-800/70"></div>
        
        <div className="relative container mx-auto px-6 text-center">
          <h2 className="text-6xl font-light mb-5 text-white drop-shadow-lg" style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 300, letterSpacing: '2px' }}>
            Passenger Consent Form
          </h2>
          <p className="text-xl text-stone-100 max-w-2xl mx-auto leading-relaxed font-light" style={{ fontFamily: 'Raleway, sans-serif' }}>
            Complete the form below to proceed with your travel documentation
          </p>
        </div>
      </div>

      {/* Premium Form */}
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <Card className="shadow-xl border border-gray-200 overflow-hidden bg-white">
          <CardHeader className="bg-gradient-to-r from-stone-50 to-amber-50 border-b border-gray-200 py-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-600 rounded-lg">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl text-stone-800 font-bold" style={{ fontFamily: 'Raleway, sans-serif' }}>Personal Information</CardTitle>
                <CardDescription className="text-base text-gray-600 mt-1" style={{ fontFamily: 'Raleway, sans-serif' }}>
                  Please provide accurate information as per your travel documents
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-gray-700 font-semibold text-base" style={{ fontFamily: 'Raleway, sans-serif' }}>
                  Full Name *
                </Label>
                <Input
                  id="name"
                  placeholder="Enter your full name as per passport"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={cn(
                    "h-14 text-lg px-5 border-2 rounded-lg transition-all duration-300 shadow-sm",
                    errors.name ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-amber-500 hover:border-amber-400"
                  )}
                  style={{ fontFamily: 'Raleway, sans-serif' }}
                />
                {errors.name && <p className="text-sm text-red-600 font-medium">{errors.name}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="phoneNumber" className="text-gray-700 font-semibold text-base" style={{ fontFamily: 'Raleway, sans-serif' }}>
                  Phone Number *
                </Label>
                <Input
                  id="phoneNumber"
                  placeholder="+91 1234567890"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className={cn(
                    "h-14 text-lg px-5 border-2 rounded-lg transition-all duration-300 shadow-sm",
                    errors.phoneNumber ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-amber-500 hover:border-amber-400"
                  )}
                  style={{ fontFamily: 'Raleway, sans-serif' }}
                />
                {errors.phoneNumber && <p className="text-sm text-red-600 font-medium">{errors.phoneNumber}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="address" className="text-gray-700 font-semibold text-base" style={{ fontFamily: 'Raleway, sans-serif' }}>
                  Residential Address *
                </Label>
                <Textarea
                  id="address"
                  placeholder="Enter your complete residential address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={cn(
                    "min-h-32 text-lg px-5 py-4 border-2 rounded-lg transition-all duration-300 shadow-sm resize-none",
                    errors.address ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-amber-500 hover:border-amber-400"
                  )}
                  style={{ fontFamily: 'Raleway, sans-serif' }}
                />
                {errors.address && <p className="text-sm text-red-600 font-medium">{errors.address}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="passportNumber" className="text-gray-700 font-semibold text-base" style={{ fontFamily: 'Raleway, sans-serif' }}>
                  Passport Number *
                </Label>
                <Input
                  id="passportNumber"
                  placeholder="e.g., A1234567"
                  value={formData.passportNumber}
                  onChange={(e) => handleInputChange('passportNumber', e.target.value.toUpperCase())}
                  className={cn(
                    "h-14 text-lg px-5 border-2 rounded-lg transition-all duration-300 shadow-sm uppercase font-mono tracking-wider",
                    errors.passportNumber ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-amber-500 hover:border-amber-400"
                  )}
                />
                {errors.passportNumber && <p className="text-sm text-red-600 font-medium">{errors.passportNumber}</p>}
              </div>

              <div className="space-y-3">
                <Label className="text-gray-700 font-semibold text-base" style={{ fontFamily: 'Raleway, sans-serif' }}>Date of Birth *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-14 justify-start text-left font-normal text-lg px-5 border-2 rounded-lg transition-all duration-300 shadow-sm",
                        !formData.dateOfBirth && "text-gray-500",
                        errors.dateOfBirth ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-amber-400"
                      )}
                      style={{ fontFamily: 'Raleway, sans-serif' }}
                    >
                      <CalendarIcon className="mr-3 h-5 w-5 text-amber-600" />
                      {formData.dateOfBirth ? (
                        <span className="font-medium">{format(formData.dateOfBirth, 'dd/MM/yyyy')}</span>
                      ) : (
                        <span>Select your date of birth</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 shadow-2xl" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.dateOfBirth}
                      onSelect={(date) => handleInputChange('dateOfBirth', date)}
                      disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                      initialFocus
                      className="rounded-xl"
                    />
                  </PopoverContent>
                </Popover>
                {errors.dateOfBirth && <p className="text-sm text-red-600 font-medium">{errors.dateOfBirth}</p>}
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-stone-50 border-2 border-amber-200 rounded-xl p-6 space-y-4">
                <h3 className="font-bold text-lg text-stone-800 flex items-center gap-2" style={{ fontFamily: 'Raleway, sans-serif' }}>
                  <Shield className="h-5 w-5 text-amber-600" />
                  Consent & Disclaimer
                </h3>
                <div className="flex items-start space-x-3 bg-white rounded-lg p-4 border border-amber-200">
                  <Checkbox
                    id="disclaimer"
                    checked={disclaimerAccepted}
                    onCheckedChange={setDisclaimerAccepted}
                    className="mt-1 h-5 w-5"
                  />
                  <Label
                    htmlFor="disclaimer"
                    className="text-sm leading-relaxed cursor-pointer text-gray-700"
                    style={{ fontFamily: 'Raleway, sans-serif' }}
                  >
                    I hereby confirm that all information provided is accurate and complete. I consent to SewaAir processing my personal data for travel-related services and agree to comply with all applicable travel regulations. *
                  </Label>
                </div>
                {errors.disclaimer && <p className="text-sm text-red-600 font-bold">{errors.disclaimer}</p>}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold py-7 text-xl shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl"
                style={{ fontFamily: 'Raleway, sans-serif' }}
              >
                <CheckCircle2 className="mr-3 h-6 w-6" />
                Submit Consent Form
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-10 text-gray-600">
          <p className="text-base" style={{ fontFamily: 'Raleway, sans-serif' }}>
            Your privacy is important to us. All data is stored securely and processed confidentially.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConsentForm;