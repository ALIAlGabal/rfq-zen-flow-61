import { Manufacturer, Supplier } from '@/types/suppliers';

export const mockManufacturers: Manufacturer[] = [
  {
    id: 'mfg-001',
    name: 'ACME Manufacturing Corp',
    description: 'Leading manufacturer of precision engineering components',
    industry: 'Aerospace & Defense',
    website: 'https://acme-mfg.com',
    address: {
      street: '1234 Industrial Blvd',
      city: 'Detroit',
      state: 'Michigan',
      country: 'USA',
      postalCode: '48201'
    },
    contacts: [
      {
        id: 'contact-001',
        name: 'John Smith',
        email: 'john.smith@acme-mfg.com',
        phone: '+1-555-0123',
        role: 'Sales Director',
        isPrimary: true
      },
      {
        id: 'contact-002',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@acme-mfg.com',
        phone: '+1-555-0124',
        role: 'Technical Manager',
        isPrimary: false
      }
    ],
    linkedSupplierIds: ['sup-001', 'sup-003'],
    capabilities: ['CNC Machining', 'Sheet Metal Fabrication', 'Assembly'],
    certifications: ['ISO 9001', 'AS9100', 'ITAR'],
    status: 'active',
    createdAt: '2023-01-15T09:00:00Z',
    updatedAt: '2024-12-08T14:30:00Z',
    lastContactDate: '2024-12-05T10:15:00Z',
    notes: 'Preferred supplier for high-precision components'
  },
  {
    id: 'mfg-002',
    name: 'SteelWorks Industries',
    description: 'Heavy steel fabrication and structural components',
    industry: 'Construction & Infrastructure',
    website: 'https://steelworks-ind.com',
    address: {
      street: '5678 Steel Mill Road',
      city: 'Pittsburgh',
      state: 'Pennsylvania',
      country: 'USA',
      postalCode: '15201'
    },
    contacts: [
      {
        id: 'contact-003',
        name: 'Mike Wilson',
        email: 'mike.wilson@steelworks-ind.com',
        phone: '+1-555-0125',
        role: 'Operations Manager',
        isPrimary: true
      }
    ],
    linkedSupplierIds: ['sup-002', 'sup-004'],
    capabilities: ['Steel Fabrication', 'Welding', 'Structural Assembly'],
    certifications: ['ISO 9001', 'AWS D1.1'],
    status: 'active',
    createdAt: '2023-02-20T11:00:00Z',
    updatedAt: '2024-12-07T16:45:00Z',
    lastContactDate: '2024-12-03T14:20:00Z'
  },
  {
    id: 'mfg-003',
    name: 'Precision Parts Ltd',
    description: 'Micro-precision components for medical and electronics',
    industry: 'Medical & Electronics',
    website: 'https://precisionparts.com',
    address: {
      street: '9101 Tech Park Drive',
      city: 'San Jose',
      state: 'California',
      country: 'USA',
      postalCode: '95110'
    },
    contacts: [
      {
        id: 'contact-004',
        name: 'Lisa Chen',
        email: 'lisa.chen@precisionparts.com',
        phone: '+1-555-0126',
        role: 'Quality Manager',
        isPrimary: true
      },
      {
        id: 'contact-005',
        name: 'David Kumar',
        email: 'david.kumar@precisionparts.com',
        phone: '+1-555-0127',
        role: 'Engineering Director',
        isPrimary: false
      }
    ],
    linkedSupplierIds: ['sup-001'],
    capabilities: ['Micro Machining', 'Clean Room Assembly', 'Quality Testing'],
    certifications: ['ISO 13485', 'FDA Registered', 'ISO 14001'],
    status: 'active',
    createdAt: '2023-03-10T08:30:00Z',
    updatedAt: '2024-12-06T12:00:00Z',
    lastContactDate: '2024-12-01T09:30:00Z'
  },
  {
    id: 'mfg-004',
    name: 'AutoTech Solutions',
    description: 'Automotive parts and assembly solutions',
    industry: 'Automotive',
    address: {
      street: '2468 Motor City Ave',
      city: 'Detroit',
      state: 'Michigan',
      country: 'USA',
      postalCode: '48202'
    },
    contacts: [
      {
        id: 'contact-006',
        name: 'Robert Taylor',
        email: 'robert.taylor@autotech.com',
        role: 'Procurement Manager',
        isPrimary: true
      }
    ],
    linkedSupplierIds: ['sup-005'],
    capabilities: ['Injection Molding', 'Metal Stamping', 'Final Assembly'],
    certifications: ['TS 16949', 'ISO 9001'],
    status: 'pending',
    createdAt: '2024-11-15T13:00:00Z',
    updatedAt: '2024-11-15T13:00:00Z'
  },
  {
    id: 'mfg-005',
    name: 'GreenTech Manufacturing',
    description: 'Sustainable manufacturing solutions',
    industry: 'Renewable Energy',
    website: 'https://greentech-mfg.com',
    address: {
      street: '1357 Solar Way',
      city: 'Austin',
      state: 'Texas',
      country: 'USA',
      postalCode: '73301'
    },
    contacts: [
      {
        id: 'contact-007',
        name: 'Emily Green',
        email: 'emily.green@greentech-mfg.com',
        phone: '+1-555-0128',
        role: 'Sustainability Director',
        isPrimary: true
      }
    ],
    linkedSupplierIds: [],
    capabilities: ['Solar Panel Assembly', 'Wind Turbine Components', 'Battery Systems'],
    certifications: ['ISO 14001', 'LEED Certified'],
    status: 'inactive',
    createdAt: '2023-06-01T10:00:00Z',
    updatedAt: '2024-10-15T15:30:00Z',
    notes: 'Currently restructuring operations'
  }
];

export const mockSuppliers: Supplier[] = [
  {
    id: 'sup-001',
    name: 'TechSupply Global',
    description: 'Leading distributor of technical components and materials',
    type: 'distributor',
    website: 'https://techsupply-global.com',
    address: {
      street: '1111 Distribution Center Dr',
      city: 'Dallas',
      state: 'Texas',
      country: 'USA',
      postalCode: '75201'
    },
    contacts: [
      {
        id: 'contact-008',
        name: 'Alex Rodriguez',
        email: 'alex.rodriguez@techsupply.com',
        phone: '+1-555-0129',
        role: 'Account Manager',
        isPrimary: true
      },
      {
        id: 'contact-009',
        name: 'Jennifer Lee',
        email: 'jennifer.lee@techsupply.com',
        phone: '+1-555-0130',
        role: 'Logistics Coordinator',
        isPrimary: false
      }
    ],
    linkedManufacturerIds: ['mfg-001', 'mfg-003'],
    specializations: ['Electronic Components', 'Precision Tools', 'Testing Equipment'],
    paymentTerms: 'Net 30',
    deliveryTime: '3-5 business days',
    status: 'active',
    createdAt: '2023-01-20T10:00:00Z',
    updatedAt: '2024-12-08T11:15:00Z',
    lastContactDate: '2024-12-06T15:30:00Z'
  },
  {
    id: 'sup-002',
    name: 'MetalSupplies Network',
    description: 'Comprehensive metal and raw material supplier',
    type: 'wholesaler',
    website: 'https://metalsupplies.net',
    address: {
      street: '3333 Warehouse Blvd',
      city: 'Chicago',
      state: 'Illinois',
      country: 'USA',
      postalCode: '60601'
    },
    contacts: [
      {
        id: 'contact-010',
        name: 'Tom Anderson',
        email: 'tom.anderson@metalsupplies.net',
        phone: '+1-555-0131',
        role: 'Sales Representative',
        isPrimary: true
      }
    ],
    linkedManufacturerIds: ['mfg-001', 'mfg-002'],
    specializations: ['Steel Alloys', 'Aluminum Products', 'Copper Materials'],
    paymentTerms: 'Net 45',
    deliveryTime: '1-2 weeks',
    status: 'active',
    createdAt: '2023-02-05T14:00:00Z',
    updatedAt: '2024-12-07T09:45:00Z',
    lastContactDate: '2024-12-04T13:15:00Z'
  },
  {
    id: 'sup-003',
    name: 'Industrial Parts Express',
    description: 'Fast delivery of industrial components',
    type: 'reseller',
    address: {
      street: '4444 Express Lane',
      city: 'Phoenix',
      state: 'Arizona',
      country: 'USA',
      postalCode: '85001'
    },
    contacts: [
      {
        id: 'contact-011',
        name: 'Maria Gonzalez',
        email: 'maria.gonzalez@industrialparts.com',
        role: 'Customer Service Manager',
        isPrimary: true
      }
    ],
    linkedManufacturerIds: ['mfg-001'],
    specializations: ['Bearings', 'Fasteners', 'Hydraulic Components'],
    paymentTerms: 'Net 30',
    deliveryTime: '24-48 hours',
    status: 'active',
    createdAt: '2023-03-15T12:30:00Z',
    updatedAt: '2024-12-05T14:20:00Z'
  },
  {
    id: 'sup-004',
    name: 'Construction Materials Hub',
    description: 'One-stop shop for construction and building materials',
    type: 'distributor',
    website: 'https://constructionhub.com',
    address: {
      street: '5555 Builder Ave',
      city: 'Atlanta',
      state: 'Georgia',
      country: 'USA',
      postalCode: '30301'
    },
    contacts: [
      {
        id: 'contact-012',
        name: 'James Wilson',
        email: 'james.wilson@constructionhub.com',
        phone: '+1-555-0132',
        role: 'Territory Manager',
        isPrimary: true
      }
    ],
    linkedManufacturerIds: ['mfg-002'],
    specializations: ['Structural Steel', 'Concrete Products', 'Insulation Materials'],
    paymentTerms: 'Net 60',
    deliveryTime: '1-3 weeks',
    status: 'active',
    createdAt: '2023-04-01T09:00:00Z',
    updatedAt: '2024-12-03T16:30:00Z'
  },
  {
    id: 'sup-005',
    name: 'Automotive Parts Depot',
    description: 'Specialized automotive components supplier',
    type: 'broker',
    address: {
      street: '6666 Auto Parts Way',
      city: 'Detroit',
      state: 'Michigan',
      country: 'USA',
      postalCode: '48203'
    },
    contacts: [
      {
        id: 'contact-013',
        name: 'Kevin Brown',
        email: 'kevin.brown@autopartsdepot.com',
        role: 'Parts Specialist',
        isPrimary: true
      }
    ],
    linkedManufacturerIds: ['mfg-004'],
    specializations: ['Engine Components', 'Brake Systems', 'Electronics'],
    paymentTerms: 'Net 15',
    deliveryTime: '2-4 days',
    status: 'pending',
    createdAt: '2024-11-20T11:00:00Z',
    updatedAt: '2024-11-20T11:00:00Z'
  }
];

export const mockStats = {
  totalManufacturers: mockManufacturers.length,
  totalSuppliers: mockSuppliers.length,
  activeManufacturers: mockManufacturers.filter(m => m.status === 'active').length,
  activeSuppliers: mockSuppliers.filter(s => s.status === 'active').length,
  recentlyAdded: [...mockManufacturers, ...mockSuppliers].filter(
    item => new Date(item.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  ).length,
  pendingApproval: [...mockManufacturers, ...mockSuppliers].filter(
    item => item.status === 'pending'
  ).length
};