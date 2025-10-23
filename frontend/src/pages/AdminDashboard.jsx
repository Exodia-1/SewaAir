import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { Plane, Users, FileText, Download, Search, ArrowLeft, Trash2, TrendingUp, Database } from 'lucide-react';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
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
                <h1 className="text-3xl font-bold tracking-wide">SewaAir Admin</h1>
                <p className="text-red-100 text-sm font-light">Consent Form Management</p>
              </div>
            </div>
            <a
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-red-100 hover:text-white transition-all duration-300 text-sm font-medium border border-white/20 hover:border-white/40 transform hover:scale-105"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Form
            </a>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-8">
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <Card className="bg-gradient-to-br from-red-500 to-red-700 text-white shadow-xl border-0 overflow-hidden relative group hover:scale-105 transition-transform duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-red-100">Total Submissions</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-4xl font-bold">{submissions.length}</span>
                <Users className="h-10 w-10 text-red-200" />
              </div>
              <div className="flex items-center gap-1 mt-2 text-red-100 text-xs">
                <TrendingUp className="h-3 w-3" />
                <span>All time records</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-xl border-0 overflow-hidden relative group hover:scale-105 transition-transform duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-amber-100">Today's Submissions</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-4xl font-bold">
                  {submissions.filter(sub => {
                    const subDate = new Date(sub.submittedAt);
                    const today = new Date();
                    return subDate.toDateString() === today.toDateString();
                  }).length}
                </span>
                <FileText className="h-10 w-10 text-amber-200" />
              </div>
              <div className="flex items-center gap-1 mt-2 text-amber-100 text-xs">
                <TrendingUp className="h-3 w-3" />
                <span>Last 24 hours</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-xl border-0 overflow-hidden relative group hover:scale-105 transition-transform duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-purple-100">Data Storage</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold">localStorage</span>
                  <p className="text-xs text-purple-100 mt-1">Browser-based</p>
                </div>
                <Database className="h-10 w-10 text-purple-200" />
              </div>
              <Badge className="mt-2 bg-green-500 text-white border-0">Active</Badge>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-xl border-0 overflow-hidden relative group hover:scale-105 transition-transform duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-emerald-100">Storage Size</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold">
                    {(JSON.stringify(submissions).length / 1024).toFixed(1)} KB
                  </span>
                  <p className="text-xs text-emerald-100 mt-1">of data stored</p>
                </div>
                <FileText className="h-10 w-10 text-emerald-200" />
              </div>
              <div className="flex items-center gap-1 mt-2 text-emerald-100 text-xs">
                <Database className="h-3 w-3" />
                <span>Optimized</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submissions Table */}
        <Card className="shadow-2xl border-0 overflow-hidden backdrop-blur-sm bg-white/95">
          <CardHeader className="bg-gradient-to-r from-red-50 via-white to-amber-50 border-b-2 border-red-100">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="text-2xl text-red-900 flex items-center gap-2">
                  <FileText className="h-6 w-6" />
                  Submission Records
                </CardTitle>
                <CardDescription className="text-gray-600">View and manage all consent form submissions</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleExportCSV}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  disabled={submissions.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button
                  onClick={handleClearAll}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  disabled={submissions.length === 0}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </div>
            <div className="mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search by name, phone, passport number, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11 py-6 border-2 border-gray-200 focus:border-red-400 transition-all duration-300"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredSubmissions.length === 0 ? (
              <div className="text-center py-20">
                <FileText className="h-20 w-20 mx-auto text-gray-300 mb-4" />
                <h3 className="text-2xl font-semibold text-gray-600 mb-2">
                  {submissions.length === 0 ? 'No Submissions Yet' : 'No Results Found'}
                </h3>
                <p className="text-gray-500">
                  {submissions.length === 0
                    ? 'Consent form submissions will appear here once users submit the form.'
                    : 'Try adjusting your search criteria.'}
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-gray-50 to-red-50 hover:bg-gray-50">
                      <TableHead className="font-bold text-gray-700">Submission ID</TableHead>
                      <TableHead className="font-bold text-gray-700">Name</TableHead>
                      <TableHead className="font-bold text-gray-700">Phone</TableHead>
                      <TableHead className="font-bold text-gray-700">Address</TableHead>
                      <TableHead className="font-bold text-gray-700">Passport No.</TableHead>
                      <TableHead className="font-bold text-gray-700">Date of Birth</TableHead>
                      <TableHead className="font-bold text-gray-700">Submitted At</TableHead>
                      <TableHead className="font-bold text-gray-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.map((submission, index) => (
                      <TableRow key={submission.id} className="hover:bg-gradient-to-r hover:from-red-50 hover:to-amber-50 transition-all duration-200 group">
                        <TableCell className="font-semibold text-red-700">
                          <Badge className="bg-gradient-to-r from-red-600 to-red-700 text-white border-0">
                            {submission.id}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{submission.name}</TableCell>
                        <TableCell className="font-mono text-sm">{submission.phoneNumber}</TableCell>
                        <TableCell className="max-w-xs truncate" title={submission.address}>
                          {submission.address}
                        </TableCell>
                        <TableCell className="font-mono font-semibold text-purple-700">{submission.passportNumber}</TableCell>
                        <TableCell className="font-medium">{submission.dateOfBirth}</TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {format(new Date(submission.submittedAt), 'dd/MM/yyyy HH:mm')}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSubmission(submission.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 transform hover:scale-110"
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