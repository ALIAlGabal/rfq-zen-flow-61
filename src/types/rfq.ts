export interface LineItem {
  id: string;
  lineNumber: string;
  itemId: string;
  manufacturer: string;
  supplier: string;
  email: string;
  status: "open" | "quote_received" | "submitted" | "closed";
  qty: number;
}

export interface RFQRecord {
  id: string;
  rfqNo: string;
  client: string;
  publishDate: string;
  bidDate: string;
  status: "open" | "submitted" | "closed" | "pending";
  lastUpdated: string;
  lineItems: LineItem[];
  isExpanded?: boolean;
}

export type LineItemStatus = "open" | "quote_received" | "submitted" | "closed";
export type RFQStatus = "open" | "submitted" | "closed" | "pending";