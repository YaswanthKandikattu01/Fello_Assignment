import React, { useState } from 'react';
import { Radar, Plus, Trash2, Zap, Globe, Clock, MousePointer, Link } from 'lucide-react';
import { analyzeVisitor } from '../services/api';

const PRESETS = [
  {
    label: 'High-Intent Mortgage Lead',
    data: {
      visitorId: '001',
      ip: '34.201.100.50',
      pagesVisited: ['/pricing', '/ai-sales-agent', '/case-studies'],
      timeOnSite: '3m 42s',
      visitsThisWeek: 3,
      referralSource: 'Google Search'
    }
  },
  {
    label: 'Enterprise Evaluator',
    data: {
      visitorId: '002',
      ip: '34.202.55.20',
      pagesVisited: ['/enterprise', '/pricing', '/integrations', '/security', '/case-studies'],
      timeOnSite: '8m 15s',
      visitsThisWeek: 5,
      referralSource: 'LinkedIn'
    }
  },
  {
    label: 'Early-Stage Researcher',
    data: {
      visitorId: '003',
      ip: '34.203.80.15',
      pagesVisited: ['/blog', '/about', '/resources'],
      timeOnSite: '1m 20s',
      visitsThisWeek: 1,
      referralSource: 'Twitter'
    }
  }
];

export default function VisitorAnalysis({ onResult }) {
  const [formData, setFormData] = useState({
    visitorId: '',
    ip: '',
    pagesVisited: [''],
    timeOnSite: '',
    visitsThisWeek: 1,
    referralSource: '',
    companyName: '',
    domain: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [error, setError] = useState('');

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addPage = () => {
    setFormData(prev => ({ ...prev, pagesVisited: [...prev.pagesVisited, ''] }));
  };

  const removePage = (index) => {
    setFormData(prev => ({
      ...prev,
      pagesVisited: prev.pagesVisited.filter((_, i) => i !== index)
    }));
  };

  const updatePage = (index, value) => {
    setFormData(prev => {
      const pages = [...prev.pagesVisited];
      pages[index] = value;
      return { ...prev, pagesVisited: pages };
    });
  };

  const loadPreset = (preset) => {
    setFormData({
      ...preset.data,
      companyName: '',
      domain: ''
    });
  };

  const handleSubmit = async () => {
    setError('');
    const cleanPages = formData.pagesVisited.filter(p => p.trim());
    if (!formData.ip && !formData.companyName) {
      setError('Please provide either an IP address or company name');
      return;
    }

    setLoading(true);
    const stages = ['Identifying company...', 'Inferring persona...', 'Scoring intent...', 'Detecting tech stack...', 'Generating AI intelligence...'];
    let stageIndex = 0;
    setLoadingStage(stages[0]);
    const interval = setInterval(() => {
      stageIndex = Math.min(stageIndex + 1, stages.length - 1);
      setLoadingStage(stages[stageIndex]);
    }, 2000);

    try {
      const result = await analyzeVisitor({
        ...formData,
        pagesVisited: cleanPages,
        visitsThisWeek: parseInt(formData.visitsThisWeek) || 1
      });
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
            <div className="loading-text">Analyzing visitor signals...</div>
            <div className="loading-stage">{loadingStage}</div>
          </div>
        </div>
      )}

      <div className="page-header">
        <h2>Visitor Signal Analysis</h2>
        <p>Convert anonymous visitor activity into actionable account intelligence</p>
      </div>

      <div className="page-body">
        <div className="card mb-20">
          <div className="card-header">
            <div className="card-header-icon violet"><Zap size={18} /></div>
            <div>
              <div className="card-title">Quick Presets</div>
              <div className="card-subtitle">Load sample visitor data to test the system</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {PRESETS.map((preset, i) => (
              <button
                key={i}
                className="btn btn-outline btn-sm"
                onClick={() => loadPreset(preset)}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="api-key-banner mb-20" style={{ borderColor: 'rgba(251, 113, 133, 0.3)', background: 'rgba(251, 113, 133, 0.08)' }}>
            <span style={{ color: 'var(--accent-rose)', fontSize: '0.85rem' }}>⚠ {error}</span>
          </div>
        )}

        <div className="grid-2">
          <div>
            <div className="card mb-20">
              <div className="card-header">
                <div className="card-header-icon indigo"><Globe size={18} /></div>
                <div>
                  <div className="card-title">Visitor Identification</div>
                  <div className="card-subtitle">IP address or company name</div>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Visitor ID</label>
                  <input
                    className="form-input form-input-mono"
                    placeholder="e.g. 001"
                    value={formData.visitorId}
                    onChange={e => updateField('visitorId', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">IP Address</label>
                  <input
                    className="form-input form-input-mono"
                    placeholder="e.g. 34.201.xxx.xxx"
                    value={formData.ip}
                    onChange={e => updateField('ip', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Company Name (optional)</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Acme Mortgage"
                    value={formData.companyName}
                    onChange={e => updateField('companyName', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Domain (optional)</label>
                  <input
                    className="form-input form-input-mono"
                    placeholder="e.g. acmemortgage.com"
                    value={formData.domain}
                    onChange={e => updateField('domain', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-header-icon cyan"><MousePointer size={18} /></div>
                <div>
                  <div className="card-title">Behavior Signals</div>
                  <div className="card-subtitle">Session and engagement data</div>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Time on Site</label>
                  <input
                    className="form-input form-input-mono"
                    placeholder="e.g. 3m 42s"
                    value={formData.timeOnSite}
                    onChange={e => updateField('timeOnSite', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Visits This Week</label>
                  <input
                    className="form-input form-input-mono"
                    type="number"
                    min="1"
                    value={formData.visitsThisWeek}
                    onChange={e => updateField('visitsThisWeek', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Referral Source</label>
                <input
                  className="form-input"
                  placeholder="e.g. Google Search, LinkedIn, Direct"
                  value={formData.referralSource}
                  onChange={e => updateField('referralSource', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div className="card-header">
                <div className="card-header-icon emerald"><Link size={18} /></div>
                <div style={{ flex: 1 }}>
                  <div className="card-title">Pages Visited</div>
                  <div className="card-subtitle">URL paths the visitor browsed</div>
                </div>
                <button className="btn btn-outline btn-sm" onClick={addPage}>
                  <Plus size={14} /> Add Page
                </button>
              </div>

              <div style={{ flex: 1 }}>
                {formData.pagesVisited.map((page, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <input
                      className="form-input form-input-mono"
                      placeholder="/pricing"
                      value={page}
                      onChange={e => updatePage(i, e.target.value)}
                      style={{ flex: 1 }}
                    />
                    {formData.pagesVisited.length > 1 && (
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => removePage(i)}
                        style={{ padding: '8px' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                className="btn btn-primary btn-lg mt-16"
                onClick={handleSubmit}
                disabled={loading}
                style={{ width: '100%' }}
              >
                <Radar size={18} />
                {loading ? 'Analyzing...' : 'Analyze Visitor'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
