import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const africa = [
  'DZ','AO','BJ','BW','BF','BI','CM','CV','CF','TD','KM','CG','CD','DJ',
  'EG','GQ','ER','SZ','ET','GA','GM','GH','GN','GW','CI','KE','LS','LR',
  'LY','MG','MW','ML','MR','MU','MA','MZ','NA','NE','NG','RW','ST','SN',
  'SC','SL','SO','ZA','SS','SD','TZ','TG','TN','UG','ZM','ZW'
];

const southAsia = [
  'AF','BD','BT','IN','IR','MV','NP','PK','LK'
];

export function middleware(req: NextRequest) {
  const country = req.headers.get('x-vercel-ip-country') || 'unknown';

  if (africa.includes(country) || southAsia.includes(country)) {
    return new NextResponse('Access denied', { status: 403 });
  }

  return NextResponse.next();
}

