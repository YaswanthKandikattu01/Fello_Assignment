import React, { useState } from 'react';
import { Layers, Play, ArrowRight, CheckCircle, XCircle, Building2 } from 'lucide-react';
import { analyzeBatch } from '../services/api';

const DEFAULT_LIST = `BrightPath Lending
Summit Realty Group
Rocket Mortgage
Redfin
Compass Real Estate`;

export default function BatchProcessor({ onViewReport }) {
  const [input, setInput] = useState(DEFAULT_LIST);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleProcess = async () => {
    const companies = input.split('\n').map(c => c.trim()).filter(c => c);
    if (companies.length === 0) {
      setError('Please enter at least one company name');
      return;
    }
    if (companies.length > 10) {
      setError('Maximum 10 companies per batch');
      return;
    }

    setError('');
    setLoading(true);
    setResults(null);
    let count = 0;
    setLoadingStage(`Processing company 1 of ${companies.length}...`);
    const interval = setInterval(() => {
      count = Math.min(count + 1, companies.length);
      setLoadingStage(`Processing company ${count} of ${companies.length}...`);
    }, 3000);

    try {
      const result = await analyzeBatch(companies);
      clearInterval(interval);
      setResults(result);
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
            <div className="loading-text">Processing batch enrichment...</div>
            <div className="loading-stage">{loadingStage}</div>
          </div>
        </div>
      )}

      <div className="page-header">
        <h2>Batch Processing</h2>
        <p>Enrich multiple companies at once with AI-powered research</p>
      </div>

      <div className="page-body">
        {error && (
          <div className="api-key-banner mb-20" style={{ borderColor: 'rgba(251, 113, 133, 0.3)', background: 'rgba(251, 113, 133, 0.08)' }}>
            <span style={{ color: 'var(--accent-rose)', fontSize: '0.85rem' }}>⚠ {error}</span>
          </div>
        )}

        {!results && (
          <div className="card mb-20">
            <div className="card-header">
              <div className="card-header-icon violet"><Layers size={18} /></div>
              <div>
                <div className="card-title">Company List</div>
                <div className="card-subtitle">Enter one company per line (max 10)</div>
              </div>
            </div>

            <div className="form-group">
              <textarea
                className="form-input"
                rows={8}
                placeholder="Enter company names, one per line..."
                value={input}
                onChange={e => setInput(e.target.value)}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', lineHeight: 1.8 }}
              />
            </div>

            <div className="flex-between">
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {input.split('\n').filter(c => c.trim()).length} companies queued
              </span>
              <button
                className="btn btn-primary btn-lg"
                onClick={handleProcess}
                disabled={loading}
              >
                <Play size={18} />
                {loading ? 'Processing...' : 'Start Batch Enrichment'}
              </button>
            </div>
          </div>
        )}

        {results && (
          <>
            <div className="grid-3 mb-20">
              <div className="stat-card">
                <div className="stat-value" style={{ color: 'var(--accent-indigo)' }}>
                  {results.totalProcessed}
                </div>
                <div className="stat-label">Total Processed</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: 'var(--accent-emerald)' }}>
                  {results.successful}
                </div>
                <div className="stat-label">Successful</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: 'var(--accent-rose)' }}>
                  {results.failed}
                </div>
                <div className="stat-label">Failed</div>
              </div>
            </div>

            <div className="card mb-20">
              <div className="card-header">
                <div className="card-header-icon emerald"><CheckCircle size={18} /></div>
                <div style={{ flex: 1 }}>
                  <div className="card-title">Enrichment Results</div>
                  <div className="card-subtitle">Click a company to view full intelligence report</div>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={() => setResults(null)}>
                  New Batch
                </button>
              </div>

              <div className="batch-results">
                {results.results.map((item, i) => (
                  <div
                    key={i}
                    className="batch-item"
                    onClick={() => item.status === 'success' && onViewReport(item)}
                  >
                    <div className="batch-item-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: 'var(--radius-md)',
                          background: item.status === 'success' ? 'var(--gradient-primary)' : 'rgba(251, 113, 133, 0.2)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: '0.85rem', flexShrink: 0
                        }}>
                          {item.status === 'success' ? (
                            <Building2 size={16} />
                          ) : (
                            <XCircle size={16} style={{ color: 'var(--accent-rose)' }} />
                          )}
                        </div>
                        <div>
                          <div className="batch-item-company">{item.company?.name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {item.company?.domain || 'Domain unknown'} · {item.company?.industry || 'Industry unknown'}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {item.status === 'success' && (
                          <>
                            <span className="badge badge-cyan">{item.company?.size || 'Size unknown'}</span>
                            <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
                          </>
                        )}
                        {item.status === 'error' && (
                          <span className="badge badge-rose">Error</span>
                        )}
                      </div>
                    </div>

                    {item.status === 'success' && item.intelligence?.aiSummary && (
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                        {item.intelligence.aiSummary.substring(0, 150)}...
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
