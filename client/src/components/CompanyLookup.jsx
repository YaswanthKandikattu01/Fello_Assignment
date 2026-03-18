import React, { useState } from 'react';
import { Building2, Search, Zap } from 'lucide-react';
import { analyzeCompany } from '../services/api';

const SAMPLE_COMPANIES = [
  'BrightPath Lending',
  'Summit Realty Group',
  'Rocket Mortgage',
  'Redfin',
  'Compass Real Estate'
];

export default function CompanyLookup({ onResult }) {
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (name) => {
    const targetName = name || companyName;
    if (!targetName.trim()) {
      setError('Please enter a company name');
      return;
    }

    setError('');
    setLoading(true);
    const stages = ['Researching company...', 'Detecting tech stack...', 'Generating AI intelligence...'];
    let stageIndex = 0;
    setLoadingStage(stages[0]);
    const interval = setInterval(() => {
      stageIndex = Math.min(stageIndex + 1, stages.length - 1);
      setLoadingStage(stages[stageIndex]);
    }, 2500);

    try {
      const result = await analyzeCompany(targetName.trim());
      clearInterval(interval);
      onResult(result);
    } catch (err) {
      clearInterval(interval);
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingStage('');
    }
  };

  return (
    <>
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner" />
            <div className="loading-text">Enriching company profile...</div>
            <div className="loading-stage">{loadingStage}</div>
          </div>
        </div>
      )}

      <div className="page-header">
        <h2>Company Lookup</h2>
        <p>Research and enrich any company with AI-powered intelligence</p>
      </div>

      <div className="page-body">
        {error && (
          <div className="api-key-banner mb-20" style={{ borderColor: 'rgba(251, 113, 133, 0.3)', background: 'rgba(251, 113, 133, 0.08)' }}>
            <span style={{ color: 'var(--accent-rose)', fontSize: '0.85rem' }}>⚠ {error}</span>
          </div>
        )}

        <div className="card mb-20">
          <div className="card-header">
            <div className="card-header-icon cyan"><Search size={18} /></div>
            <div>
              <div className="card-title">Company Search</div>
              <div className="card-subtitle">Enter a company name to generate intelligence</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <input
              className="form-input"
              placeholder="Enter company name... (e.g. Rocket Mortgage)"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={{ flex: 1, fontSize: '1rem', padding: '14px 18px' }}
            />
            <button
              className="btn btn-primary btn-lg"
              onClick={() => handleSubmit()}
              disabled={loading}
            >
              <Building2 size={18} />
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-header-icon violet"><Zap size={18} /></div>
            <div>
              <div className="card-title">Sample Companies</div>
              <div className="card-subtitle">Click any company to quickly test the system</div>
            </div>
          </div>

          <div className="grid-3" style={{ gap: 10 }}>
            {SAMPLE_COMPANIES.map((name, i) => (
              <div
                key={i}
                className="action-item"
                style={{ cursor: 'pointer', marginBottom: 0 }}
                onClick={() => {
                  setCompanyName(name);
                  handleSubmit(name);
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 'var(--radius-md)',
                  background: `hsl(${(i * 60) + 220}, 70%, 55%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '0.85rem', flexShrink: 0,
                  opacity: 0.8
                }}>
                  {name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="action-text">{name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
