import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ipDatabase = JSON.parse(
  readFileSync(join(__dirname, '..', 'data', 'ip-database.json'), 'utf-8')
);

function ipToLong(ip) {
  const parts = ip.split('.').map(Number);
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

function cidrToRange(cidr) {
  const [ip, bits] = cidr.split('/');
  const mask = ~(2 ** (32 - parseInt(bits)) - 1) >>> 0;
  const start = ipToLong(ip) & mask;
  const end = start | ~mask >>> 0;
  return { start, end };
}

export function lookupIP(ip) {
  const cleanIP = ip.replace(/x/g, '0').trim();
  const ipLong = ipToLong(cleanIP);

  for (const entry of ipDatabase) {
    const { start, end } = cidrToRange(entry.range);
    if (ipLong >= start && ipLong <= end) {
      return {
        found: true,
        company: entry.company,
        domain: entry.domain,
        industry: entry.industry,
        size: entry.size,
        location: entry.location,
        method: 'reverse_ip_lookup',
        confidence: 0.85
      };
    }
  }

  const firstOctet = parseInt(cleanIP.split('.')[0]);
  if (firstOctet >= 34 && firstOctet <= 54) {
    return {
      found: true,
      company: 'Unknown Enterprise',
      domain: 'unknown.com',
      industry: 'Technology',
      size: 'Unknown',
      location: 'United States',
      method: 'ip_range_heuristic',
      confidence: 0.35
    };
  }

  return {
    found: false,
    company: null,
    domain: null,
    method: 'reverse_ip_lookup',
    confidence: 0
  };
}
