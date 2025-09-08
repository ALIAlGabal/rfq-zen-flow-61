import { RFQRecord, LineItem } from '@/types/rfq';

// Enhanced mock RFQ data
export const mockRFQs: RFQRecord[] = [
  {
    id: 'rfq-001',
    rfqNo: 'RFQ-2024-001',
    client: 'Aerospace Dynamics Inc.',
    publishDate: '2024-12-01T09:00:00Z',
    bidDate: '2024-12-15T17:00:00Z',
    status: 'open',
    lastUpdated: '2024-12-08T14:30:00Z',
    lineItems: [
      {
        id: 'line-001',
        lineNumber: '001',
        itemId: 'AD-BEARING-001',
        manufacturer: 'ACME Manufacturing Corp',
        supplier: 'TechSupply Global',
        email: 'alex.rodriguez@techsupply.com',
        status: 'quote_received',
        qty: 50
      },
      {
        id: 'line-002',
        lineNumber: '002',
        itemId: 'AD-SEAL-002',
        manufacturer: 'Precision Parts Ltd',
        supplier: 'Industrial Parts Express',
        email: 'maria.gonzalez@industrialparts.com',
        status: 'open',
        qty: 100
      },
      {
        id: 'line-003',
        lineNumber: '003',
        itemId: 'AD-HOUSING-003',
        manufacturer: 'ACME Manufacturing Corp',
        supplier: 'MetalSupplies Network',
        email: 'tom.anderson@metalsupplies.net',
        status: 'submitted',
        qty: 25
      }
    ]
  },
  {
    id: 'rfq-002',
    rfqNo: 'RFQ-2024-002',
    client: 'Construction Solutions LLC',
    publishDate: '2024-12-03T10:30:00Z',
    bidDate: '2024-12-20T16:00:00Z',
    status: 'submitted',
    lastUpdated: '2024-12-07T11:15:00Z',
    lineItems: [
      {
        id: 'line-004',
        lineNumber: '001',
        itemId: 'CS-BEAM-001',
        manufacturer: 'SteelWorks Industries',
        supplier: 'Construction Materials Hub',
        email: 'james.wilson@constructionhub.com',
        status: 'submitted',
        qty: 20
      },
      {
        id: 'line-005',
        lineNumber: '002',
        itemId: 'CS-COLUMN-002',
        manufacturer: 'SteelWorks Industries',
        supplier: 'MetalSupplies Network',
        email: 'tom.anderson@metalsupplies.net',
        status: 'quote_received',
        qty: 15
      }
    ]
  },
  {
    id: 'rfq-003',
    rfqNo: 'RFQ-2024-003',
    client: 'Medical Device Corp',
    publishDate: '2024-12-05T08:15:00Z',
    bidDate: '2024-12-18T12:00:00Z',
    status: 'pending',
    lastUpdated: '2024-12-08T09:45:00Z',
    lineItems: [
      {
        id: 'line-006',
        lineNumber: '001',
        itemId: 'MD-COMPONENT-001',
        manufacturer: 'Precision Parts Ltd',
        supplier: 'TechSupply Global',
        email: 'alex.rodriguez@techsupply.com',
        status: 'open',
        qty: 200
      },
      {
        id: 'line-007',
        lineNumber: '002',
        itemId: 'MD-SENSOR-002',
        manufacturer: 'Precision Parts Ltd',
        supplier: 'Industrial Parts Express',
        email: 'maria.gonzalez@industrialparts.com',
        status: 'quote_received',
        qty: 75
      },
      {
        id: 'line-008',
        lineNumber: '003',
        itemId: 'MD-HOUSING-003',
        manufacturer: 'Precision Parts Ltd',
        supplier: 'TechSupply Global',
        email: 'jennifer.lee@techsupply.com',
        status: 'open',
        qty: 150
      }
    ]
  },
  {
    id: 'rfq-004',
    rfqNo: 'RFQ-2024-004',
    client: 'Automotive Systems Ltd',
    publishDate: '2024-12-06T14:20:00Z',
    bidDate: '2024-12-22T15:30:00Z',
    status: 'open',
    lastUpdated: '2024-12-08T16:00:00Z',
    lineItems: [
      {
        id: 'line-009',
        lineNumber: '001',
        itemId: 'AS-ENGINE-001',
        manufacturer: 'AutoTech Solutions',
        supplier: 'Automotive Parts Depot',
        email: 'kevin.brown@autopartsdepot.com',
        status: 'open',
        qty: 10
      },
      {
        id: 'line-010',
        lineNumber: '002',
        itemId: 'AS-BRAKE-002',
        manufacturer: 'AutoTech Solutions',
        supplier: 'Industrial Parts Express',
        email: 'maria.gonzalez@industrialparts.com',
        status: 'quote_received',
        qty: 40
      }
    ]
  },
  {
    id: 'rfq-005',
    rfqNo: 'RFQ-2024-005',
    client: 'Green Energy Projects',
    publishDate: '2024-12-07T11:45:00Z',
    bidDate: '2024-12-25T10:00:00Z',
    status: 'closed',
    lastUpdated: '2024-12-08T13:20:00Z',
    lineItems: [
      {
        id: 'line-011',
        lineNumber: '001',
        itemId: 'GE-PANEL-001',
        manufacturer: 'GreenTech Manufacturing',
        supplier: 'TechSupply Global',
        email: 'alex.rodriguez@techsupply.com',
        status: 'closed',
        qty: 100
      },
      {
        id: 'line-012',
        lineNumber: '002',
        itemId: 'GE-INVERTER-002',
        manufacturer: 'GreenTech Manufacturing',
        supplier: 'Industrial Parts Express',
        email: 'maria.gonzalez@industrialparts.com',
        status: 'closed',
        qty: 50
      }
    ]
  }
];

// Mock RFQ statistics
export const mockRFQStats = {
  totalRFQs: mockRFQs.length,
  openRFQs: mockRFQs.filter(r => r.status === 'open').length,
  submittedRFQs: mockRFQs.filter(r => r.status === 'submitted').length,
  closedRFQs: mockRFQs.filter(r => r.status === 'closed').length,
  pendingRFQs: mockRFQs.filter(r => r.status === 'pending').length,
  totalLineItems: mockRFQs.reduce((sum, rfq) => sum + rfq.lineItems.length, 0),
  averageLineItemsPerRFQ: mockRFQs.reduce((sum, rfq) => sum + rfq.lineItems.length, 0) / mockRFQs.length
};