import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { Plane, Users, FileText, Download, Search, ArrowLeft, Trash2 } from 'lucide-react';
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
                <h1 className="text-3xl font-bold tracking-wide">SewaAir Admin</h1>
                <p className="text-red-100 text-sm">Consent Form Management</p>
              </div>
            </div>
            <a href="/" className="flex items-center text-red-100 hover:text-white transition-colors duration-200 text-sm font-medium">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Form
            </a>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-lg border-l-4 border-red-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-red-900">{submissions.length}</span>
                <Users className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-l-4 border-amber-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Today's Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-amber-900">
                  {submissions.filter(sub => {
                    const subDate = new Date(sub.submittedAt);
                    const today = new Date();
                    return subDate.toDateString() === today.toDateString();
                  }).length}
                </span>
                <FileText className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-l-4 border-purple-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Data Storage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-purple-900">localStorage</span>
                  <p className="text-xs text-gray-500 mt-1">Browser-based</p>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-300">Active</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submissions Table */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="bg-gradient-to-r from-red-50 to-purple-50 border-b">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="text-2xl text-red-900">Submission Records</CardTitle>
                <CardDescription className="text-gray-600">View and manage all consent form submissions</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleExportCSV}
                  variant="outline"
                  className="border-green-600 text-green-700 hover:bg-green-50"
                  disabled={submissions.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button
                  onClick={handleClearAll}
                  variant="outline"
                  className="border-red-600 text-red-700 hover:bg-red-50"
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
                    ? 'Consent form submissions will appear here once users submit the form.'
                    : 'Try adjusting your search criteria.'}
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">Submission ID</TableHead>
                      <TableHead className="font-semibold">Name</TableHead>
                      <TableHead className="font-semibold">Phone</TableHead>
                      <TableHead className="font-semibold">Address</TableHead>
                      <TableHead className="font-semibold">Passport No.</TableHead>
                      <TableHead className="font-semibold">Date of Birth</TableHead>
                      <TableHead className="font-semibold">Submitted At</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.map((submission) => (
                      <TableRow key={submission.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-medium text-red-700">{submission.id}</TableCell>
                        <TableCell>{submission.name}</TableCell>
                        <TableCell>{submission.phoneNumber}</TableCell>
                        <TableCell className="max-w-xs truncate" title={submission.address}>
                          {submission.address}
                        </TableCell>
                        <TableCell className="font-mono">{submission.passportNumber}</TableCell>
                        <TableCell>{submission.dateOfBirth}</TableCell>
                        <TableCell>
                          {format(new Date(submission.submittedAt), 'dd/MM/yyyy HH:mm')}
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