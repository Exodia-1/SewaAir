import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { Plane, Users, FileText, Download, Search, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);

  useEffect(() => {
    loadSubmissions();
  }, []);

  useEffect(() => {
    filterSubmissions();
  }, [searchTerm, submissions]);

  const loadSubmissions = () => {
    const data = JSON.parse(localStorage.getItem('sewaAirSubmissions') || '[]');
    setSubmissions(data);
  };

  const filterSubmissions = () => {
    if (!searchTerm.trim()) {
      setFilteredSubmissions(submissions);
      return;
    }

    const filtered = submissions.filter(sub =>
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.phoneNumber.includes(searchTerm) ||
      sub.passportNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSubmissions(filtered);
  };

  const handleExportCSV = () => {
    if (submissions.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = ['Submission ID', 'Name', 'Phone Number', 'Address', 'Passport Number', 'Date of Birth', 'Submitted At'];
    const csvData = submissions.map(sub => [
      sub.id,
      sub.name,
      sub.phoneNumber,
      sub.address.replace(/,/g, ';'),
      sub.passportNumber,
      sub.dateOfBirth,
      format(new Date(sub.submittedAt), 'dd/MM/yyyy HH:mm:ss')
    ]);

    const csv = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sewaair-submissions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDeleteSubmission = (id) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      const updatedSubmissions = submissions.filter(sub => sub.id !== id);
      localStorage.setItem('sewaAirSubmissions', JSON.stringify(updatedSubmissions));
      setSubmissions(updatedSubmissions);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete ALL submissions? This action cannot be undone.')) {
      localStorage.removeItem('sewaAirSubmissions');
      setSubmissions([]);
    }
  };

  const todayCount = submissions.filter(sub => {
    const subDate = new Date(sub.submittedAt);
    const today = new Date();
    return subDate.toDateString() === today.toDateString();
  }).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF9F6] via-white to-[#FFF8DC]">
      {/* Air India Header with Logo Placeholder */}
      <header className="bg-gradient-to-r from-[#8B0000] via-[#A52A2A] to-[#8B0000] border-b-4 border-[#D4AF37] shadow-lg">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* 
                ========================================
                LOGO PLACEHOLDER - ADD YOUR LOGO HERE
                ========================================
                Instructions:
                1. Save your logo file as 'logo.png' in the /app/frontend/public/ folder
                2. If your logo has a different name, update src="/logo.png" to src="/your-logo-name.png"
                3. Recommended logo size: 200x200 pixels or larger (transparent background works best)
                4. The logo will automatically scale to fit the 64x64px container
                
                Current fallback: Shows "SA" text if logo file not found
              */}
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-lg border-2 border-[#D4AF37]">
                <img 
                  src="/logo.png" 
                  alt="SewaAir Logo" 
                  className="w-14 h-14 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div style={{ display: 'none', color: '#8B0000', fontSize: '24px', fontWeight: 'bold' }} className="items-center justify-center w-full h-full">SA</div>
              </div>
              <div>
                <h1 className="text-4xl tracking-wide" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  <span style={{ fontWeight: 600, color: '#ffffff', letterSpacing: '2px' }}>Sewa</span>
                  <span style={{ fontWeight: 300, color: '#D4AF37', letterSpacing: '3px' }}>Air</span>
                </h1>
                <p className="text-sm text-[#FAF9F6] mt-1" style={{ fontFamily: 'Lato, sans-serif', letterSpacing: '1px' }}>Admin Dashboard</p>
              </div>
            </div>
            <a
              href="/"
              className="flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] hover:from-[#FFD700] hover:to-[#D4AF37] rounded-lg text-[#8B0000] font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-white"
              style={{ fontFamily: 'Lato, sans-serif', letterSpacing: '1px' }}
            >
              <Plane className="h-5 w-5" />
              Back to Form
            </a>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white shadow-lg border-2 border-[#D4AF37] hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-3 border-b-2 border-[#FAF9F6]">
              <CardTitle className="text-sm font-medium text-[#8B0000]" style={{ fontFamily: 'Raleway, sans-serif' }}>Total Submissions</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <span className="text-4xl font-bold text-[#8B0000]" style={{ fontFamily: 'Raleway, sans-serif' }}>{submissions.length}</span>
                <Users className="h-10 w-10 text-[#D4AF37]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-2 border-[#D4AF37] hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-3 border-b-2 border-[#FAF9F6]">
              <CardTitle className="text-sm font-medium text-[#8B0000]" style={{ fontFamily: 'Raleway, sans-serif' }}>Today's Submissions</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <span className="text-4xl font-bold text-[#8B0000]" style={{ fontFamily: 'Raleway, sans-serif' }}>{todayCount}</span>
                <FileText className="h-10 w-10 text-[#D4AF37]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submissions Table */}
        <Card className="shadow-xl border border-gray-200 bg-white">
          <CardHeader className="bg-gradient-to-r from-stone-50 to-amber-50 border-b border-gray-200">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="text-2xl text-stone-800" style={{ fontFamily: 'Raleway, sans-serif' }}>Submission Records</CardTitle>
                <CardDescription className="text-gray-600" style={{ fontFamily: 'Raleway, sans-serif' }}>View and manage all consent form submissions</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleExportCSV}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={submissions.length === 0}
                  style={{ fontFamily: 'Raleway, sans-serif' }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button
                  onClick={handleClearAll}
                  variant="destructive"
                  disabled={submissions.length === 0}
                  style={{ fontFamily: 'Raleway, sans-serif' }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </div>
            <div className="mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, phone, passport number, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300"
                  style={{ fontFamily: 'Raleway, sans-serif' }}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredSubmissions.length === 0 ? (
              <div className="text-center py-16">
                <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2" style={{ fontFamily: 'Raleway, sans-serif' }}>
                  {submissions.length === 0 ? 'No Submissions Yet' : 'No Results Found'}
                </h3>
                <p className="text-gray-500" style={{ fontFamily: 'Raleway, sans-serif' }}>
                  {submissions.length === 0
                    ? 'Consent form submissions will appear here.'
                    : 'Try adjusting your search criteria.'}
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold" style={{ fontFamily: 'Raleway, sans-serif' }}>ID</TableHead>
                      <TableHead className="font-semibold" style={{ fontFamily: 'Raleway, sans-serif' }}>Name</TableHead>
                      <TableHead className="font-semibold" style={{ fontFamily: 'Raleway, sans-serif' }}>Phone</TableHead>
                      <TableHead className="font-semibold" style={{ fontFamily: 'Raleway, sans-serif' }}>Address</TableHead>
                      <TableHead className="font-semibold" style={{ fontFamily: 'Raleway, sans-serif' }}>Passport</TableHead>
                      <TableHead className="font-semibold" style={{ fontFamily: 'Raleway, sans-serif' }}>DOB</TableHead>
                      <TableHead className="font-semibold" style={{ fontFamily: 'Raleway, sans-serif' }}>Submitted</TableHead>
                      <TableHead className="font-semibold" style={{ fontFamily: 'Raleway, sans-serif' }}>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.map((submission) => (
                      <TableRow key={submission.id} className="hover:bg-gray-50">
                        <TableCell>
                          <Badge className="bg-amber-700 text-white">{submission.id}</Badge>
                        </TableCell>
                        <TableCell className="font-medium" style={{ fontFamily: 'Raleway, sans-serif' }}>{submission.name}</TableCell>
                        <TableCell className="font-mono text-sm">{submission.phoneNumber}</TableCell>
                        <TableCell className="max-w-xs truncate" title={submission.address} style={{ fontFamily: 'Raleway, sans-serif' }}>
                          {submission.address}
                        </TableCell>
                        <TableCell className="font-mono">{submission.passportNumber}</TableCell>
                        <TableCell style={{ fontFamily: 'Raleway, sans-serif' }}>{submission.dateOfBirth}</TableCell>
                        <TableCell className="text-sm" style={{ fontFamily: 'Raleway, sans-serif' }}>
                          {format(new Date(submission.submittedAt), 'dd/MM/yy HH:mm')}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSubmission(submission.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;