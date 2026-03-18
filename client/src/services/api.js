const API_BASE = '/api';

export async function analyzeVisitor(visitorData) {
  const res = await fetch(`${API_BASE}/analyze/visitor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(visitorData)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to analyze visitor');
  }
  return res.json();
}

export async function analyzeCompany(companyName) {
  const res = await fetch(`${API_BASE}/analyze/company`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ companyName })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to analyze company');
  }
  return res.json();
}

export async function analyzeBatch(companies) {
  const res = await fetch(`${API_BASE}/analyze/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ companies })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to process batch');
  }
  return res.json();
}

export async function checkHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function getConfig() {
  const res = await fetch(`${API_BASE}/config`);
  return res.json();
}

export async function setApiKey(apiKey) {
  const res = await fetch(`${API_BASE}/config/apikey`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey })
  });
  return res.json();
}
