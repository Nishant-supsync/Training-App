export type InspectionCertificate = {
  id: string;
  type: string;
  date: string;
  status: 'pass' | 'fail' | 'pending';
  documentUrl?: string;
};

export type ServiceProvider = {
  id: string;
  name: string;
  logo: string;
  rating: number;
  description: string;
  primaryService: string;
  contactInfo: string;
  location: string;
};

export type TabType = 'upload' | 'providers';
export type SubTabType = 'upload' | 'history'; 