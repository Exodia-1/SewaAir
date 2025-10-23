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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-stone-50">
      {/* Elegant Header with Refined Logo */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
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
              href="/"
              className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 rounded-lg text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
              style={{ fontFamily: 'Raleway, sans-serif', letterSpacing: '0.5px' }}
            >
              <Plane className="h-4 w-4" />
              Back to Form
            </a>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle className="text-sm font-medium text-gray-600" style={{ fontFamily: 'Raleway, sans-serif' }}>Total Submissions</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <span className="text-4xl font-bold text-stone-800" style={{ fontFamily: 'Raleway, sans-serif' }}>{submissions.length}</span>
                <Users className="h-10 w-10 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle className="text-sm font-medium text-gray-600" style={{ fontFamily: 'Raleway, sans-serif' }}>Today's Submissions</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <span className="text-4xl font-bold text-stone-800" style={{ fontFamily: 'Raleway, sans-serif' }}>{todayCount}</span>
                <FileText className="h-10 w-10 text-amber-600" />
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