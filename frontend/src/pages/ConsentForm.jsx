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
      description: `Your consent form has been submitted successfully. Reference ID: ${submissionId}`,
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
      {/* Premium Header with Logo */}
      <header className="bg-gradient-to-r from-red-900 via-red-800 to-red-900 text-white shadow-2xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Premium Logo */}
              <div className="relative group">
                <div className="absolute inset-0 bg-amber-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-4 rounded-2xl shadow-2xl border-2 border-amber-300">
                  <svg className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>SewaAir</h1>
                <p className="text-red-100 text-base font-light">Passenger Consent Form</p>
              </div>
            </div>
            <a
              href="/admin"
              className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Lock className="h-5 w-5" />
              Admin Panel
            </a>
          </div>
        </div>
      </header>

      {/* Premium Hero with Better Image */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/90 via-purple-900/85 to-red-900/90 z-10"></div>
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1544016768-982d1554f0b9?w=1200&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
        
        <div className="relative z-20 container mx-auto px-6 py-20 text-center">
          <div className="inline-block mb-6 p-5 bg-white/10 backdrop-blur-md rounded-2xl">
            <Shield className="h-20 w-20 text-amber-400" />
          </div>
          <h2 className="text-5xl font-bold mb-4 text-white">Passenger Consent Form</h2>
          <p className="text-2xl text-red-100 max-w-3xl mx-auto">
            Secure and streamlined travel documentation
          </p>
        </div>
      </div>

      {/* Premium Form */}
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <Card className="shadow-2xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-red-50 via-amber-50 to-red-50 border-b-2 border-amber-200 py-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-red-700 to-red-800 rounded-xl">
                <Plane className="h-7 w-7 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl text-red-900 font-bold">Personal Information</CardTitle>
                <CardDescription className="text-base text-gray-600 mt-1">
                  Please provide accurate information as per your travel documents
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Name Field */}
              <div className="space-y-3">
                <Label htmlFor="name" className="text-gray-800 font-semibold text-base">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  placeholder="Enter your full name as per passport"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={cn(
                    "h-14 text-lg px-5 border-2 rounded-xl transition-all duration-300 focus:scale-[1.01] shadow-sm",
                    errors.name ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-red-500 hover:border-red-300"
                  )}
                />
                {errors.name && <p className="text-sm text-red-600 font-medium">{errors.name}</p>}
              </div>

              {/* Phone Number Field */}
              <div className="space-y-3">
                <Label htmlFor="phoneNumber" className="text-gray-800 font-semibold text-base">
                  Phone Number *
                </Label>
                <Input
                  id="phoneNumber"
                  placeholder="+91 1234567890"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className={cn(
                    "h-14 text-lg px-5 border-2 rounded-xl transition-all duration-300 focus:scale-[1.01] shadow-sm",
                    errors.phoneNumber ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-red-500 hover:border-red-300"
                  )}
                />
                {errors.phoneNumber && <p className="text-sm text-red-600 font-medium">{errors.phoneNumber}</p>}
              </div>

              {/* Address Field */}
              <div className="space-y-3">
                <Label htmlFor="address" className="text-gray-800 font-semibold text-base">
                  Residential Address *
                </Label>
                <Textarea
                  id="address"
                  placeholder="Enter your complete residential address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={cn(
                    "min-h-32 text-lg px-5 py-4 border-2 rounded-xl transition-all duration-300 focus:scale-[1.01] shadow-sm resize-none",
                    errors.address ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-red-500 hover:border-red-300"
                  )}
                />
                {errors.address && <p className="text-sm text-red-600 font-medium">{errors.address}</p>}
              </div>

              {/* Passport Number Field */}
              <div className="space-y-3">
                <Label htmlFor="passportNumber" className="text-gray-800 font-semibold text-base">
                  Passport Number *
                </Label>
                <Input
                  id="passportNumber"
                  placeholder="e.g., A1234567"
                  value={formData.passportNumber}
                  onChange={(e) => handleInputChange('passportNumber', e.target.value.toUpperCase())}
                  className={cn(
                    "h-14 text-lg px-5 border-2 rounded-xl transition-all duration-300 focus:scale-[1.01] shadow-sm uppercase font-mono tracking-wider",
                    errors.passportNumber ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-red-500 hover:border-red-300"
                  )}
                />
                {errors.passportNumber && <p className="text-sm text-red-600 font-medium">{errors.passportNumber}</p>}
              </div>

              {/* Date of Birth Field */}
              <div className="space-y-3">
                <Label className="text-gray-800 font-semibold text-base">Date of Birth *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-14 justify-start text-left font-normal text-lg px-5 border-2 rounded-xl hover:scale-[1.01] transition-all duration-300 shadow-sm",
                        !formData.dateOfBirth && "text-gray-500",
                        errors.dateOfBirth ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-red-300"
                      )}
                    >
                      <CalendarIcon className="mr-3 h-5 w-5 text-red-600" />
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

              {/* Compact Disclaimer */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-6 space-y-4 shadow-md">
                <h3 className="font-bold text-lg text-amber-900 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
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
                  >
                    I hereby confirm that all information provided is accurate and complete. I consent to SewaAir processing my personal data for travel-related services and agree to comply with all applicable travel regulations. *
                  </Label>
                </div>
                {errors.disclaimer && <p className="text-sm text-red-600 font-bold">{errors.disclaimer}</p>}
              </div>

              {/* Premium Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-red-700 via-red-800 to-red-900 hover:from-red-800 hover:via-red-900 hover:to-red-950 text-white font-bold py-7 text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.02] rounded-xl"
              >
                <CheckCircle2 className="mr-3 h-6 w-6" />
                Submit Consent Form
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-10 text-gray-600">
          <p className="text-base">
            Your privacy is important to us. All data is stored securely and processed confidentially.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConsentForm;