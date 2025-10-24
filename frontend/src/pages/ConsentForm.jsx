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

      {/* Air India Style Header */}
      <header className="bg-gradient-to-r from-red-800 via-red-700 to-red-800 border-b-2 border-red-900 shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Logo Placeholder - Replace with your logo */}
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-lg">
                <img 
                  src="/logo.png" 
                  alt="SewaAir Logo" 
                  className="w-14 h-14 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div style={{ display: 'none', color: '#991b1b', fontSize: '24px', fontWeight: 'bold' }}>SA</div>
              </div>
              <div>
                <h1 className="text-4xl tracking-wide" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  <span style={{ fontWeight: 600, color: '#ffffff', letterSpacing: '2px' }}>Sewa</span>
                  <span style={{ fontWeight: 300, color: '#ffd700', letterSpacing: '3px' }}>Air</span>
                </h1>
              </div>
            </div>
            <a
              href="/admin"
              className="flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 rounded-lg text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border border-red-900"
              style={{ fontFamily: 'Lato, sans-serif', letterSpacing: '1px' }}
            >
              <Lock className="h-5 w-5" />
              Admin
            </a>
          </div>
        </div>
      </header>

      {/* Air India Style Hero */}
      <div className="relative overflow-hidden py-20">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=80)',
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/85 via-red-800/80 to-red-900/85"></div>
        
        <div className="relative container mx-auto px-6 text-center">
          <h2 className="text-6xl font-bold mb-5 text-white drop-shadow-2xl" style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, letterSpacing: '3px' }}>
            Passenger Consent Form
          </h2>
          <p className="text-xl text-red-50 max-w-2xl mx-auto leading-relaxed font-medium" style={{ fontFamily: 'Lato, sans-serif', letterSpacing: '0.5px' }}>
            Complete the form below to proceed with your travel documentation
          </p>
        </div>
      </div>

      {/* Premium Form */}
      <div className="container mx-auto px-6 py-16 max-w-5xl">
        <Card className="shadow-2xl border-2 border-amber-200 overflow-hidden bg-white relative">
          {/* Gold accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500"></div>
          
          <CardHeader className="bg-gradient-to-r from-amber-50 via-white to-amber-50 border-b-2 border-amber-100 py-10 px-12">
            <div className="flex items-start gap-5">
              <div className="p-4 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl shadow-lg">
                <Plane className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-4xl text-stone-800 font-bold mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  Personal Information
                </CardTitle>
                <CardDescription className="text-lg text-gray-600" style={{ fontFamily: 'Lato, sans-serif' }}>
                  Please provide accurate information as per your travel documents
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-12 bg-gradient-to-br from-white via-stone-50 to-white">
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="space-y-4">
                <Label htmlFor="name" className="text-gray-800 font-bold text-lg flex items-center gap-2" style={{ fontFamily: 'Lato, sans-serif' }}>
                  Full Name *
                  <span className="text-xs text-gray-500 font-normal">(as per passport)</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={cn(
                    "h-16 text-lg px-6 border-2 rounded-xl transition-all duration-300 shadow-md bg-white",
                    errors.name ? "border-red-500 bg-red-50" : "border-amber-300 focus:border-amber-600 hover:border-amber-500 focus:ring-2 focus:ring-amber-200"
                  )}
                  style={{ fontFamily: 'Lato, sans-serif' }}
                />
                {errors.name && <p className="text-sm text-red-600 font-semibold">{errors.name}</p>}
              </div>

              <div className="space-y-4">
                <Label htmlFor="phoneNumber" className="text-gray-800 font-bold text-lg" style={{ fontFamily: 'Lato, sans-serif' }}>
                  Phone Number *
                </Label>
                <Input
                  id="phoneNumber"
                  placeholder="+91 1234567890"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className={cn(
                    "h-16 text-lg px-6 border-2 rounded-xl transition-all duration-300 shadow-md bg-white",
                    errors.phoneNumber ? "border-red-500 bg-red-50" : "border-amber-300 focus:border-amber-600 hover:border-amber-500 focus:ring-2 focus:ring-amber-200"
                  )}
                  style={{ fontFamily: 'Lato, sans-serif' }}
                />
                {errors.phoneNumber && <p className="text-sm text-red-600 font-semibold">{errors.phoneNumber}</p>}
              </div>

              <div className="space-y-4">
                <Label htmlFor="address" className="text-gray-800 font-bold text-lg" style={{ fontFamily: 'Lato, sans-serif' }}>
                  Residential Address *
                </Label>
                <Textarea
                  id="address"
                  placeholder="Enter your complete residential address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={cn(
                    "min-h-36 text-lg px-6 py-4 border-2 rounded-xl transition-all duration-300 shadow-md resize-none bg-white",
                    errors.address ? "border-red-500 bg-red-50" : "border-amber-300 focus:border-amber-600 hover:border-amber-500 focus:ring-2 focus:ring-amber-200"
                  )}
                  style={{ fontFamily: 'Lato, sans-serif' }}
                />
                {errors.address && <p className="text-sm text-red-600 font-semibold">{errors.address}</p>}
              </div>

              <div className="space-y-4">
                <Label htmlFor="passportNumber" className="text-gray-800 font-bold text-lg" style={{ fontFamily: 'Lato, sans-serif' }}>
                  Passport Number *
                </Label>
                <Input
                  id="passportNumber"
                  placeholder="e.g., A1234567"
                  value={formData.passportNumber}
                  onChange={(e) => handleInputChange('passportNumber', e.target.value.toUpperCase())}
                  className={cn(
                    "h-16 text-lg px-6 border-2 rounded-xl transition-all duration-300 shadow-md uppercase font-mono tracking-wider bg-white",
                    errors.passportNumber ? "border-red-500 bg-red-50" : "border-amber-300 focus:border-amber-600 hover:border-amber-500 focus:ring-2 focus:ring-amber-200"
                  )}
                />
                {errors.passportNumber && <p className="text-sm text-red-600 font-semibold">{errors.passportNumber}</p>}
              </div>

              <div className="space-y-4">
                <Label className="text-gray-800 font-bold text-lg" style={{ fontFamily: 'Lato, sans-serif' }}>Date of Birth *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-16 justify-start text-left font-normal text-lg px-6 border-2 rounded-xl transition-all duration-300 shadow-md bg-white",
                        !formData.dateOfBirth && "text-gray-500",
                        errors.dateOfBirth ? "border-red-500 bg-red-50" : "border-amber-300 hover:border-amber-500 focus:ring-2 focus:ring-amber-200"
                      )}
                      style={{ fontFamily: 'Lato, sans-serif' }}
                    >
                      <CalendarIcon className="mr-3 h-6 w-6 text-amber-600" />
                      {formData.dateOfBirth ? (
                        <span className="font-semibold">{format(formData.dateOfBirth, 'dd/MM/yyyy')}</span>
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
                {errors.dateOfBirth && <p className="text-sm text-red-600 font-semibold">{errors.dateOfBirth}</p>}
              </div>

              <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 border-2 border-amber-300 rounded-xl p-8 space-y-5 shadow-lg">
                <h3 className="font-bold text-2xl text-amber-900" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  Consent & Disclaimer
                </h3>
                <div className="flex items-start space-x-4 bg-white rounded-xl p-6 border-2 border-amber-200 shadow-md">
                  <Checkbox
                    id="disclaimer"
                    checked={disclaimerAccepted}
                    onCheckedChange={setDisclaimerAccepted}
                    className="mt-1.5 h-6 w-6 border-2 border-amber-600"
                  />
                  <Label
                    htmlFor="disclaimer"
                    className="text-base leading-relaxed cursor-pointer text-gray-700"
                    style={{ fontFamily: 'Lato, sans-serif' }}
                  >
                    I hereby confirm that all information provided is accurate and complete. I consent to SewaAir processing my personal data for travel-related services and agree to comply with all applicable travel regulations. *
                  </Label>
                </div>
                {errors.disclaimer && <p className="text-sm text-red-600 font-bold">{errors.disclaimer}</p>}
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  className="px-16 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-600 hover:from-amber-700 hover:via-amber-800 hover:to-amber-700 text-white font-bold py-8 text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-xl border-2 border-amber-800"
                  style={{ fontFamily: 'Lato, sans-serif', letterSpacing: '1px' }}
                >
                  Submit Consent Form
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-12 text-gray-600">
          <p className="text-base" style={{ fontFamily: 'Lato, sans-serif' }}>
            Your privacy is important to us. All data is stored securely and processed confidentially.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConsentForm;