import { Manufacturer, Supplier } from '@/types/suppliers';

export function formatAddress(address: any): string {
  if (!address) return '';
  
  const parts = [
    address.street,
    address.city,
    address.state,
    address.country,
    address.postalCode
  ].filter(Boolean);
  
  return parts.join(', ');
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'inactive':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'active':
      return 'Active';
    case 'inactive':
      return 'Inactive';
    case 'pending':
      return 'Pending';
    default:
      return 'Unknown';
  }
}

export function getPrimaryContact(contacts: any[]): any | null {
  return contacts.find(contact => contact.isPrimary) || contacts[0] || null;
}

export function formatContactInfo(contacts: any[]): string {
  const primary = getPrimaryContact(contacts);
  if (!primary) return 'No contact';
  
  const parts = [primary.name, primary.email].filter(Boolean);
  return parts.join(' - ');
}

export function getLinkedEntityNames(
  linkedIds: string[],
  entities: (Manufacturer | Supplier)[]
): string[] {
  return linkedIds
    .map(id => entities.find(entity => entity.id === id)?.name)
    .filter((name): name is string => Boolean(name));
}

export function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return 'Invalid date';
  }
}

export function formatRelativeDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  } catch {
    return 'Unknown';
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

export function generateUniqueId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function searchEntities<T extends Manufacturer | Supplier>(
  entities: T[],
  searchTerm: string
): T[] {
  if (!searchTerm.trim()) return entities;
  
  const term = searchTerm.toLowerCase();
  
  return entities.filter(entity => {
    // Search in basic fields
    if (entity.name.toLowerCase().includes(term)) return true;
    if (entity.description?.toLowerCase().includes(term)) return true;
    
    // Search in contacts
    if (entity.contacts.some(contact => 
      contact.name.toLowerCase().includes(term) ||
      contact.email.toLowerCase().includes(term) ||
      contact.role.toLowerCase().includes(term)
    )) return true;
    
    // Search in type-specific fields
    if ('industry' in entity && entity.industry.toLowerCase().includes(term)) return true;
    if ('type' in entity && entity.type.toLowerCase().includes(term)) return true;
    
    // Search in capabilities/specializations
    if ('capabilities' in entity && entity.capabilities.some(cap => 
      cap.toLowerCase().includes(term)
    )) return true;
    if ('specializations' in entity && entity.specializations.some(spec => 
      spec.toLowerCase().includes(term)
    )) return true;
    
    return false;
  });
}

export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  columns: { key: keyof T; label: string }[]
): void {
  const headers = columns.map(col => col.label).join(',');
  const rows = data.map(item => 
    columns.map(col => {
      const value = item[col.key];
      // Handle arrays and objects
      if (Array.isArray(value)) {
        return `"${value.join('; ')}"`;
      }
      if (typeof value === 'object' && value !== null) {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      }
      // Escape commas and quotes in strings
      if (typeof value === 'string') {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value || '';
    }).join(',')
  );
  
  const csvContent = [headers, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export function getEntityTypeColor(entity: Manufacturer | Supplier): string {
  if ('industry' in entity) {
    // Manufacturer
    return 'bg-blue-100 text-blue-800 border-blue-200';
  } else {
    // Supplier
    return 'bg-purple-100 text-purple-800 border-purple-200';
  }
}

export function getEntityTypeLabel(entity: Manufacturer | Supplier): string {
  if ('industry' in entity) {
    return 'Manufacturer';
  } else {
    return 'Supplier';
  }
}