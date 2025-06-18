'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent, Card, Button, Avatar, Badge, Input, Modal, Select, Toast } from '@ui';
import { Search, Plus, Mail, Phone, Building, Calendar, Users } from 'lucide-react';

interface Member {
    id: string;
    name: string;
    role: string;
    email: string;
    avatar_url?: string | null;
    status: 'active' | 'inactive' | 'pending';
    department: string;
    joined_date: string;
    last_active: string;
}

interface Employee {
    id: string;
    name: string;
    position: string;
    department: string;
    email: string;
    phone: string;
    hire_date: string;
    status: 'active' | 'inactive';
}

interface Company {
    id: string;
    name: string;
    industry: string;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
    relationship: string;
    since: string;
}

interface DirectoryTabsProps {
    members: Member[];
    employees: Employee[];
    companies: Company[];
}

export function DirectoryTabs({ members, employees, companies }: DirectoryTabsProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddMember, setShowAddMember] = useState(false);
    const [showAddEmployee, setShowAddEmployee] = useState(false);
    const [showAddCompany, setShowAddCompany] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    
    const [newMember, setNewMember] = useState({
        name: '',
        email: '',
        role: 'member',
        department: ''
    });
    const [newEmployee, setNewEmployee] = useState({
        name: '',
        position: '',
        department: '',
        email: '',
        phone: ''
    });
    const [newCompany, setNewCompany] = useState({
        name: '',
        industry: '',
        contact_name: '',
        contact_email: '',
        contact_phone: '',
        relationship: 'client'
    });

    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleAddMember = () => {
        console.log('Adding member:', newMember);
        showNotification(`${newMember.name} has been added as a ${newMember.role}!`);
        setShowAddMember(false);
        setNewMember({ name: '', email: '', role: 'member', department: '' });
        // In a real app, this would make an API call to add the member
    };

    const handleAddEmployee = () => {
        console.log('Adding employee:', newEmployee);
        showNotification(`${newEmployee.name} has been added as ${newEmployee.position}!`);
        setShowAddEmployee(false);
        setNewEmployee({ name: '', position: '', department: '', email: '', phone: '' });
        // In a real app, this would make an API call to add the employee
    };

    const handleAddCompany = () => {
        console.log('Adding company:', newCompany);
        showNotification(`${newCompany.name} has been added as a ${newCompany.relationship}!`);
        setShowAddCompany(false);
        setNewCompany({ name: '', industry: '', contact_name: '', contact_email: '', contact_phone: '', relationship: 'client' });
        // In a real app, this would make an API call to add the company
    };

    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.department.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredEmployees = employees.filter(employee =>
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredCompanies = companies.filter(company =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.contact_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'success';
            case 'inactive': return 'danger';
            case 'pending': return 'warning';
            default: return 'default';
        }
    };

    const tabs = [
        {
            id: 'members',
            label: 'Members',
            count: members.length,
            content: (
                <div className="space-y-6">
                    {/* Search and Add */}
                    <div className="flex items-center justify-between">
                        <div className="relative max-w-md flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search members..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button onClick={() => setShowAddMember(true)} variant="primary" className="ml-4">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Member
                        </Button>
                    </div>

                    {/* Members Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredMembers.map((member) => (
                            <Card key={member.id} className="p-6">
                                <div className="flex items-center space-x-4">
                                    <Avatar
                                        src={member.avatar_url}
                                        initials={member.name.split(' ').map(n => n[0]).join('')}
                                        size="lg"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 truncate">{member.name}</h3>
                                        <p className="text-sm text-gray-600">{member.role}</p>
                                        <Badge variant={getStatusColor(member.status) as 'default' | 'success' | 'warning' | 'danger'} size="sm" className="mt-1">
                                            {member.status}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-2">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Mail className="h-4 w-4 mr-2" />
                                        {member.email}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Building className="h-4 w-4 mr-2" />
                                        {member.department}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Joined {new Date(member.joined_date).toLocaleDateString()}
                                    </div>
                                </div>

                                <div className="mt-4 flex space-x-2">
                                    <Button variant="ghost" size="sm" className="flex-1">
                                        Message
                                    </Button>
                                    <Button variant="ghost" size="sm" className="flex-1">
                                        Edit
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )
        },
        {
            id: 'employees',
            label: 'Employees',
            count: employees.length,
            content: (
                <div className="space-y-6">
                    {/* Search and Add */}
                    <div className="flex items-center justify-between">
                        <div className="relative max-w-md flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search employees..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button onClick={() => setShowAddEmployee(true)} variant="primary" className="ml-4">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Employee
                        </Button>
                    </div>

                    {/* Employees Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEmployees.map((employee) => (
                            <Card key={employee.id} className="p-6">
                                <div className="flex items-center space-x-4">
                                    <Avatar
                                        initials={employee.name.split(' ').map(n => n[0]).join('')}
                                        size="lg"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 truncate">{employee.name}</h3>
                                        <p className="text-sm text-gray-600">{employee.position}</p>
                                        <Badge variant={getStatusColor(employee.status) as 'default' | 'success' | 'warning' | 'danger'} size="sm" className="mt-1">
                                            {employee.status}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-2">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Mail className="h-4 w-4 mr-2" />
                                        {employee.email}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Phone className="h-4 w-4 mr-2" />
                                        {employee.phone}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Building className="h-4 w-4 mr-2" />
                                        {employee.department}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Hired {new Date(employee.hire_date).toLocaleDateString()}
                                    </div>
                                </div>

                                <div className="mt-4 flex space-x-2">
                                    <Button variant="ghost" size="sm" className="flex-1">
                                        Contact
                                    </Button>
                                    <Button variant="ghost" size="sm" className="flex-1">
                                        Edit
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )
        },
        {
            id: 'companies',
            label: 'Companies',
            count: companies.length,
            content: (
                <div className="space-y-6">
                    {/* Search and Add */}
                    <div className="flex items-center justify-between">
                        <div className="relative max-w-md flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search companies..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button onClick={() => setShowAddCompany(true)} variant="primary" className="ml-4">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Company
                        </Button>
                    </div>

                    {/* Companies Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCompanies.map((company) => (
                            <Card key={company.id} className="p-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <Building className="h-6 w-6 text-gray-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 truncate">{company.name}</h3>
                                        <p className="text-sm text-gray-600">{company.industry}</p>
                                        <Badge variant="default" size="sm" className="mt-1">
                                            {company.relationship}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-2">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Users className="h-4 w-4 mr-2" />
                                        {company.contact_name}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Mail className="h-4 w-4 mr-2" />
                                        {company.contact_email}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Phone className="h-4 w-4 mr-2" />
                                        {company.contact_phone}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Since {new Date(company.since).toLocaleDateString()}
                                    </div>
                                </div>

                                <div className="mt-4 flex space-x-2">
                                    <Button variant="ghost" size="sm" className="flex-1">
                                        Contact
                                    </Button>
                                    <Button variant="ghost" size="sm" className="flex-1">
                                        Edit
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )
        }
    ];

    return (
        <div>
            <Tabs defaultValue="members" className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="members">Members ({members.length})</TabsTrigger>
                    <TabsTrigger value="employees">Employees ({employees.length})</TabsTrigger>
                    <TabsTrigger value="companies">Companies ({companies.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="members">
                    {tabs[0].content}
                </TabsContent>

                <TabsContent value="employees">
                    {tabs[1].content}
                </TabsContent>

                <TabsContent value="companies">
                    {tabs[2].content}
                </TabsContent>
            </Tabs>

            {/* Add Member Modal */}
            <Modal
                isOpen={showAddMember}
                onClose={() => setShowAddMember(false)}
                title="Add Team Member"
                size="md"
            >
                <div className="space-y-4">
                    <Input
                        label="Full Name"
                        placeholder="John Doe"
                        value={newMember.name}
                        onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                        required
                    />
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="john@example.com"
                        value={newMember.email}
                        onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                        required
                    />
                    <Select
                        label="Role"
                        options={[
                            { value: 'member', label: 'Member' },
                            { value: 'admin', label: 'Admin' },
                            { value: 'owner', label: 'Owner' },
                            { value: 'guest', label: 'Guest' }
                        ]}
                        value={newMember.role}
                        onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                    />
                    <Input
                        label="Department"
                        placeholder="Engineering, Design, Marketing..."
                        value={newMember.department}
                        onChange={(e) => setNewMember({ ...newMember, department: e.target.value })}
                    />
                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        <Button variant="secondary" onClick={() => setShowAddMember(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleAddMember}
                            disabled={!newMember.name.trim() || !newMember.email.trim()}
                        >
                            Add Member
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Add Employee Modal */}
            <Modal
                isOpen={showAddEmployee}
                onClose={() => setShowAddEmployee(false)}
                title="Add Employee"
                size="md"
            >
                <div className="space-y-4">
                    <Input
                        label="Full Name"
                        placeholder="Jane Smith"
                        value={newEmployee.name}
                        onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                        required
                    />
                    <Input
                        label="Position"
                        placeholder="Senior Developer"
                        value={newEmployee.position}
                        onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                        required
                    />
                    <Input
                        label="Department"
                        placeholder="Engineering"
                        value={newEmployee.department}
                        onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                        required
                    />
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="jane@company.com"
                        value={newEmployee.email}
                        onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                        required
                    />
                    <Input
                        label="Phone Number"
                        placeholder="+1 (555) 123-4567"
                        value={newEmployee.phone}
                        onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                    />
                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        <Button variant="secondary" onClick={() => setShowAddEmployee(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleAddEmployee}
                            disabled={!newEmployee.name.trim() || !newEmployee.position.trim()}
                        >
                            Add Employee
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Add Company Modal */}
            <Modal
                isOpen={showAddCompany}
                onClose={() => setShowAddCompany(false)}
                title="Add Company"
                size="md"
            >
                <div className="space-y-4">
                    <Input
                        label="Company Name"
                        placeholder="Acme Corp"
                        value={newCompany.name}
                        onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                        required
                    />
                    <Input
                        label="Industry"
                        placeholder="Technology"
                        value={newCompany.industry}
                        onChange={(e) => setNewCompany({ ...newCompany, industry: e.target.value })}
                    />
                    <Select
                        label="Relationship"
                        options={[
                            { value: 'client', label: 'Client' },
                            { value: 'partner', label: 'Partner' },
                            { value: 'vendor', label: 'Vendor' },
                            { value: 'supplier', label: 'Supplier' }
                        ]}
                        value={newCompany.relationship}
                        onChange={(e) => setNewCompany({ ...newCompany, relationship: e.target.value })}
                    />
                    <Input
                        label="Contact Name"
                        placeholder="John Smith"
                        value={newCompany.contact_name}
                        onChange={(e) => setNewCompany({ ...newCompany, contact_name: e.target.value })}
                        required
                    />
                    <Input
                        label="Contact Email"
                        type="email"
                        placeholder="john@acme.com"
                        value={newCompany.contact_email}
                        onChange={(e) => setNewCompany({ ...newCompany, contact_email: e.target.value })}
                        required
                    />
                    <Input
                        label="Contact Phone"
                        placeholder="+1 (555) 111-2222"
                        value={newCompany.contact_phone}
                        onChange={(e) => setNewCompany({ ...newCompany, contact_phone: e.target.value })}
                    />
                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        <Button variant="secondary" onClick={() => setShowAddCompany(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleAddCompany}
                            disabled={!newCompany.name.trim() || !newCompany.contact_name.trim()}
                        >
                            Add Company
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Toast Notification */}
            {showToast && (
                <Toast
                    id="directory-toast"
                    message={toastMessage}
                    type={toastType}
                    onClose={() => setShowToast(false)}
                />
            )}
        </div>
    );
} 