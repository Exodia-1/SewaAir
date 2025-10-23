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
import { Plane, CalendarIcon, Shield, CheckCircle2 } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-purple-50 to-rose-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-800 via-red-700 to-red-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-3 rounded-lg shadow-md">
                <Plane className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-wide">SewaAir</h1>
                <p className="text-red-100 text-sm">Your Journey, Our Commitment</p>
              </div>
            </div>
            <a href="/admin" className="text-red-100 hover:text-white transition-colors duration-200 text-sm font-medium">
              Admin Access
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-800 via-purple-900 to-red-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Shield className="h-16 w-16 mx-auto mb-4 text-amber-400" />
          <h2 className="text-4xl font-bold mb-4">Passenger Consent Form</h2>
          <p className="text-xl text-red-100 max-w-2xl mx-auto">
            Please complete this form to provide your consent for travel services and data processing
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="shadow-2xl border-0">
          <CardHeader className="bg-gradient-to-r from-red-50 to-purple-50 border-b">
            <CardTitle className="text-2xl text-red-900">Personal Information</CardTitle>
            <CardDescription className="text-gray-600">
              All fields are mandatory. Please ensure the information provided is accurate.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-medium">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name as per passport"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={cn(
                    "transition-all duration-200 focus:ring-2 focus:ring-red-500",
                    errors.name && "border-red-500"
                  )}
                />
                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Phone Number Field */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-gray-700 font-medium">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  placeholder="+91 1234567890"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className={cn(
                    "transition-all duration-200 focus:ring-2 focus:ring-red-500",
                    errors.phoneNumber && "border-red-500"
                  )}
                />
                {errors.phoneNumber && <p className="text-sm text-red-600">{errors.phoneNumber}</p>}
              </div>

              {/* Address Field */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-gray-700 font-medium">Residential Address *</Label>
                <Textarea
                  id="address"
                  placeholder="Enter your complete address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={cn(
                    "min-h-24 transition-all duration-200 focus:ring-2 focus:ring-red-500",
                    errors.address && "border-red-500"
                  )}
                />
                {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
              </div>

              {/* Passport Number Field */}
              <div className="space-y-2">
                <Label htmlFor="passportNumber" className="text-gray-700 font-medium">Passport Number *</Label>
                <Input
                  id="passportNumber"
                  placeholder="e.g., A1234567"
                  value={formData.passportNumber}
                  onChange={(e) => handleInputChange('passportNumber', e.target.value.toUpperCase())}
                  className={cn(
                    "uppercase transition-all duration-200 focus:ring-2 focus:ring-red-500",
                    errors.passportNumber && "border-red-500"
                  )}
                />
                {errors.passportNumber && <p className="text-sm text-red-600">{errors.passportNumber}</p>}
              </div>

              {/* Date of Birth Field */}
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Date of Birth *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal transition-all duration-200",
                        !formData.dateOfBirth && "text-muted-foreground",
                        errors.dateOfBirth && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
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
                {errors.dateOfBirth && <p className="text-sm text-red-600">{errors.dateOfBirth}</p>}
              </div>

              {/* Disclaimer Section */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-lg text-amber-900 flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Consent & Disclaimer
                </h3>
                <div className="text-sm text-gray-700 space-y-2">
                  <p>
                    By submitting this form, I hereby acknowledge and agree to the following:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>All information provided is accurate and complete to the best of my knowledge</li>
                    <li>I consent to SewaAir processing my personal data for travel-related services</li>
                    <li>I understand that false information may result in denial of services</li>
                    <li>I agree to comply with all applicable travel regulations and airline policies</li>
                    <li>I authorize SewaAir to contact me using the provided contact information</li>
                  </ul>
                </div>
                <div className="flex items-start space-x-3 pt-2">
                  <Checkbox
                    id="disclaimer"
                    checked={disclaimerAccepted}
                    onCheckedChange={setDisclaimerAccepted}
                    className="mt-1"
                  />
                  <Label
                    htmlFor="disclaimer"
                    className="text-sm font-medium leading-relaxed cursor-pointer"
                  >
                    I have read and agree to the above terms and conditions *
                  </Label>
                </div>
                {errors.disclaimer && <p className="text-sm text-red-600">{errors.disclaimer}</p>}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Submit Consent Form
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">
            Your privacy is important to us. All data is stored securely and used only for authorized purposes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConsentForm;