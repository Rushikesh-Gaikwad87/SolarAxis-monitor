// ── CENTRAL MOCK DATA ────────────────────────────────────────────────────────

// ── VENDORS (Admin-level view) ────────────────────────────────────────────────
export const VENDORS = [
  {
    id: 'v1', name: 'SunTech Solutions', owner: 'Arjun Mehta',
    email: 'arjun@suntech.in', phone: '+91 98765 11111',
    city: 'Pune', state: 'MH', joinDate: '2021-06-01',
    status: 'active', plan: 'Enterprise',
    customers: 3, plants: 3, capacity: 67.5,
    monthlyRevenue: 52800, totalRevenue: 612000,
    color: '#3b82f6', initials: 'ST',
  },
  {
    id: 'v2', name: 'GreenGrid Energy', owner: 'Priya Nair',
    email: 'priya@greengrid.co', phone: '+91 80000 22222',
    city: 'Bangalore', state: 'KA', joinDate: '2022-01-15',
    status: 'active', plan: 'Premium',
    customers: 2, plants: 2, capacity: 105,
    monthlyRevenue: 89000, totalRevenue: 980000,
    color: '#10b981', initials: 'GG',
  },
  {
    id: 'v3', name: 'VoltEdge Power', owner: 'Sameer Khan',
    email: 'sameer@voltedge.in', phone: '+91 94560 33333',
    city: 'Mumbai', state: 'MH', joinDate: '2022-11-20',
    status: 'trial', plan: 'Standard',
    customers: 1, plants: 1, capacity: 5,
    monthlyRevenue: 3800, totalRevenue: 22800,
    color: '#f59e0b', initials: 'VE',
  },
  {
    id: 'v4', name: 'BrightWave Solar', owner: 'Divya Rao',
    email: 'divya@brightwave.io', phone: '+91 44000 44444',
    city: 'Chennai', state: 'TN', joinDate: '2023-03-10',
    status: 'active', plan: 'Premium',
    customers: 1, plants: 1, capacity: 25,
    monthlyRevenue: 24000, totalRevenue: 168000,
    color: '#8b5cf6', initials: 'BW',
  },
];

export const PLANTS = [
  { id: 1, vendorId: 'v1', name: 'Rajesh Patel – Residence', location: 'Pune, MH', capacity: 10, brand: 'Sungrow', status: 'online', todayGen: 42.8, monthGen: 980, totalGen: 12840, performance: 94, lastSync: '2 min ago', lat: 18.52, lng: 73.85, customer: 'Rajesh Patel', installDate: '2023-01-15', savings: 8400, co2: 10.2 },
  { id: 2, vendorId: 'v2', name: 'Global Tech Park', location: 'Bangalore, KA', capacity: 50, brand: 'Huawei', status: 'online', todayGen: 195.2, monthGen: 4200, totalGen: 58000, performance: 91, lastSync: '5 min ago', lat: 12.97, lng: 77.59, customer: 'GlobalTech Corp', installDate: '2022-08-10', savings: 38000, co2: 47.2 },
  { id: 3, vendorId: 'v1', name: 'Sharma Farm – Rooftop', location: 'Jaipur, RJ', capacity: 7.5, brand: 'Goodwe', status: 'fault', todayGen: 0, monthGen: 620, totalGen: 8200, performance: 0, lastSync: '1 hr ago', lat: 26.91, lng: 75.78, customer: 'Ramesh Sharma', installDate: '2023-06-20', savings: 6200, co2: 6.7 },
  { id: 4, vendorId: 'v2', name: 'City Mall – Phase 2', location: 'Mumbai, MH', capacity: 100, brand: 'SMA', status: 'online', todayGen: 380.5, monthGen: 8100, totalGen: 98400, performance: 89, lastSync: '1 min ago', lat: 19.07, lng: 72.87, customer: 'City Mall Pvt Ltd', installDate: '2022-03-05', savings: 72000, co2: 80.3 },
  { id: 5, vendorId: 'v3', name: 'Verma Apartment', location: 'Delhi, DL', capacity: 5, brand: 'UTL', status: 'offline', todayGen: 0, monthGen: 210, totalGen: 4200, performance: 0, lastSync: '3 hr ago', lat: 28.70, lng: 77.10, customer: 'Sunil Verma', installDate: '2023-09-12', savings: 3800, co2: 3.4 },
  { id: 6, vendorId: 'v4', name: 'Sunrise School', location: 'Chennai, TN', capacity: 25, brand: 'Sungrow', status: 'online', todayGen: 98.4, monthGen: 2100, totalGen: 29600, performance: 96, lastSync: '3 min ago', lat: 13.08, lng: 80.27, customer: 'Sunrise Edu Trust', installDate: '2022-11-01', savings: 24000, co2: 24.1 },
  { id: 7, vendorId: 'v1', name: 'Patel Commercial Plaza', location: 'Pune, MH', capacity: 50, brand: 'Growatt', status: 'online', todayGen: 188.4, monthGen: 4100, totalGen: 35200, performance: 92, lastSync: '4 min ago', lat: 18.55, lng: 73.87, customer: 'Rajesh Patel', installDate: '2023-08-01', savings: 38500, co2: 28.8 },
];

export const CUSTOMERS = [
  { id: 1, vendorId: 'v1', name: 'Rajesh Patel',     email: 'rajesh@gmail.com',          phone: '+91 98765 43210', city: 'Pune',      plants: 2, status: 'active',  joinDate: '2023-01-10', totalCapacity: 60,   monthlySavings: 46900, tier: 'Standard'   },
  { id: 2, vendorId: 'v2', name: 'GlobalTech Corp',  email: 'ops@globaltech.in',          phone: '+91 80000 12345', city: 'Bangalore', plants: 1, status: 'active',  joinDate: '2022-08-01', totalCapacity: 50,   monthlySavings: 38000, tier: 'Enterprise' },
  { id: 3, vendorId: 'v1', name: 'Ramesh Sharma',    email: 'r.sharma@yahoo.com',         phone: '+91 94560 78901', city: 'Jaipur',    plants: 1, status: 'fault',   joinDate: '2023-06-15', totalCapacity: 7.5,  monthlySavings: 0,     tier: 'Standard'   },
  { id: 4, vendorId: 'v2', name: 'City Mall Pvt Ltd',email: 'facilities@citymall.com',    phone: '+91 22345 67890', city: 'Mumbai',    plants: 1, status: 'active',  joinDate: '2022-03-01', totalCapacity: 100,  monthlySavings: 72000, tier: 'Enterprise' },
  { id: 5, vendorId: 'v3', name: 'Sunil Verma',      email: 'sunil.v@hotmail.com',        phone: '+91 91234 56789', city: 'Delhi',     plants: 1, status: 'offline', joinDate: '2023-09-05', totalCapacity: 5,    monthlySavings: 0,     tier: 'Basic'      },
  { id: 6, vendorId: 'v4', name: 'Sunrise Edu Trust',email: 'admin@sunrise.edu',          phone: '+91 44000 99887', city: 'Chennai',   plants: 1, status: 'active',  joinDate: '2022-10-20', totalCapacity: 25,   monthlySavings: 24000, tier: 'Premium'    },
];

export const ALERTS = [
  { id: 1, type: 'fault',   plant: 'Sharma Farm – Rooftop', message: 'Inverter fault detected – Error Code F029', time: '10:14 AM', severity: 'critical', resolved: false, plantId: 3 },
  { id: 2, type: 'offline', plant: 'Verma Apartment',       message: 'Inverter offline for more than 3 hours',   time: '08:45 AM', severity: 'critical', resolved: false, plantId: 5 },
  { id: 3, type: 'zero_gen',plant: 'Sharma Farm – Rooftop', message: 'Zero generation during peak daylight hours', time: '11:00 AM', severity: 'critical', resolved: false, plantId: 3 },
  { id: 4, type: 'low_gen', plant: 'City Mall – Phase 2',   message: 'Generation 18% below expected output',      time: '02:30 PM', severity: 'warning',  resolved: false, plantId: 4 },
  { id: 5, type: 'amc',     plant: 'Rajesh Patel – Residence', message: 'AMC service due in 7 days',            time: 'Yesterday', severity: 'info',     resolved: false, plantId: 1 },
  { id: 6, type: 'weather', plant: 'Global Tech Park',      message: 'Rain forecast tomorrow – expect 40% drop', time: '09:00 AM', severity: 'info',     resolved: true,  plantId: 2 },
];

export const GEN_CHART_DATA = [
  { time: '06:00', actual: 0,    forecast: 0.5  },
  { time: '07:00', actual: 8,    forecast: 10   },
  { time: '08:00', actual: 24,   forecast: 22   },
  { time: '09:00', actual: 48,   forecast: 45   },
  { time: '10:00', actual: 72,   forecast: 68   },
  { time: '11:00', actual: 95,   forecast: 90   },
  { time: '12:00', actual: 108,  forecast: 105  },
  { time: '13:00', actual: 102,  forecast: 108  },
  { time: '14:00', actual: 88,   forecast: 92   },
  { time: '15:00', actual: 65,   forecast: 70   },
  { time: '16:00', actual: 40,   forecast: 42   },
  { time: '17:00', actual: 18,   forecast: 20   },
  { time: '18:00', actual: 4,    forecast: 5    },
];

export const MONTHLY_DATA = [
  { month: 'Jan', gen: 820,  revenue: 41000 },
  { month: 'Feb', gen: 890,  revenue: 44500 },
  { month: 'Mar', gen: 1050, revenue: 52500 },
  { month: 'Apr', gen: 1200, revenue: 60000 },
  { month: 'May', gen: 1350, revenue: 67500 },
  { month: 'Jun', gen: 980,  revenue: 49000 },
  { month: 'Jul', gen: 760,  revenue: 38000 },
  { month: 'Aug', gen: 820,  revenue: 41000 },
  { month: 'Sep', gen: 1100, revenue: 55000 },
  { month: 'Oct', gen: 1280, revenue: 64000 },
  { month: 'Nov', gen: 950,  revenue: 47500 },
  { month: 'Dec', gen: 780,  revenue: 39000 },
];

export const SYSTEM_CONFIG = {
  companyName: 'SolarAxis Energy Pvt. Ltd.',
  email: 'admin@solaraxis.io',
  phone: '+91 98765 00000',
  address: 'Plot 42, Tech Hub, Pune 411057',
  timezone: 'Asia/Kolkata',
  currency: 'INR',
  tariff: 8.5,
  syncInterval: 30,
  alertEmail: true,
  alertSMS: true,
  alertPush: false,
  language: 'en',
  theme: 'dark',
  apiKey: 'sk-solar-xxxx-xxxx-xxxx',
  autoReport: true,
  reportDay: 1,
};
