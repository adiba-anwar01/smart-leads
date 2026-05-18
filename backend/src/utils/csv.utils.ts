export interface LeadCsvRow {
  name: string;
  email: string;
  status: string;
  source: string;
  createdAt: Date;
}

function escapeField(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function generateCSV(leads: LeadCsvRow[]): string {
  const headers = ['Name', 'Email', 'Status', 'Source', 'Created At'];

  const rows = leads.map((lead) => {
    const createdAt = lead.createdAt.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    return [lead.name, lead.email, lead.status, lead.source, createdAt].map(escapeField).join(',');
  });

  return [headers.join(','), ...rows].join('\r\n');
}
