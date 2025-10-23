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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-amber-50">
      {/* Header with Premium Logo */}
      <header className="bg-gradient-to-r from-red-900 via-red-800 to-red-900 text-white shadow-2xl">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center space-x-4">
            {/* Premium Airline Logo */}
            <div className="relative group">
              <div className="absolute inset-0 bg-amber-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 p-4 rounded-2xl shadow-2xl border-2 border-amber-300">
                <svg className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>SewaAir Admin</h1>
              <p className="text-red-100 text-base font-light tracking-wide">Consent Form Management</p>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Section - Only 2 Cards */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white shadow-xl border-l-4 border-red-600 hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-4xl font-bold text-red-900">{submissions.length}</span>
                <Users className="h-10 w-10 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-xl border-l-4 border-amber-500 hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Today's Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-4xl font-bold text-amber-900">{todayCount}</span>
                <FileText className="h-10 w-10 text-amber-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submissions Table */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="bg-gradient-to-r from-red-50 to-amber-50 border-b">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="text-2xl text-red-900">Submission Records</CardTitle>
                <CardDescription className="text-gray-600">View and manage all consent form submissions</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleExportCSV}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={submissions.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button
                  onClick={handleClearAll}
                  variant="destructive"
                  disabled={submissions.length === 0}
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
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredSubmissions.length === 0 ? (
              <div className="text-center py-16">
                <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {submissions.length === 0 ? 'No Submissions Yet' : 'No Results Found'}
                </h3>
                <p className="text-gray-500">
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
                      <TableHead className="font-semibold">ID</TableHead>
                      <TableHead className="font-semibold">Name</TableHead>
                      <TableHead className="font-semibold">Phone</TableHead>
                      <TableHead className="font-semibold">Address</TableHead>
                      <TableHead className="font-semibold">Passport</TableHead>
                      <TableHead className="font-semibold">DOB</TableHead>
                      <TableHead className="font-semibold">Submitted</TableHead>
                      <TableHead className="font-semibold">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.map((submission) => (
                      <TableRow key={submission.id} className="hover:bg-gray-50">
                        <TableCell>
                          <Badge className="bg-red-700 text-white">{submission.id}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{submission.name}</TableCell>
                        <TableCell className="font-mono text-sm">{submission.phoneNumber}</TableCell>
                        <TableCell className="max-w-xs truncate" title={submission.address}>
                          {submission.address}
                        </TableCell>
                        <TableCell className="font-mono">{submission.passportNumber}</TableCell>
                        <TableCell>{submission.dateOfBirth}</TableCell>
                        <TableCell className="text-sm">
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