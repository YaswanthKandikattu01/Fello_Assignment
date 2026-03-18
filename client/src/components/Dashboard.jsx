import React from 'react';
import {
  Radar, Building2, Layers, TrendingUp, Clock, Zap, ArrowRight, Globe, Users, Target
} from 'lucide-react';

const SAMPLE_VISITORS = [
  {
    id: '001',
    ip: '34.201.100.50',
    pages: ['/pricing', '/ai-sales-agent', '/case-studies'],
    time: '3m 42s',
    visits: 3,
    company: 'Summit Realty Group'
  },
  {
    id: '002',
    ip: '34.202.55.20',
    pages: ['/features', '/integrations', '/pricing'],
    time: '5m 10s',
    visits: 5,
    company: 'Rocket Mortgage'
  },
  {
    id: '003',
    ip: '34.203.80.15',
    pages: ['/blog', '/about'],
    time: '1m 20s',
    visits: 1,
    company: 'Redfin'
  }
];

export default function Dashboard({ history, onViewReport, onNavigate }) {
  return (
    <>
      <div className="page-header">
        <h2>Intelligence Dashboard</h2>
        <p>AI-powered account intelligence at a glance</p>
      </div>

      <div className="page-body">
        <div className="grid-4 mb-20">
          <div className="stat-card">
            <div style={{ color: 'var(--accent-indigo)' }}>
              <Building2 size={20} />
            </div>
            <div className="stat-value" style={{ color: 'var(--accent-indigo)', marginTop: 8 }}>
              {history.length}
            </div>
            <div className="stat-label">Accounts Analyzed</div>
          </div>
          <div className="stat-card">
            <div style={{ color: 'var(--accent-cyan)' }}>
              <Radar size={20} />
            </div>
            <div className="stat-value" style={{ color: 'var(--accent-cyan)', marginTop: 8 }}>
              {history.filter(h => h.intent?.intentScore >= 7).length}
            </div>
            <div className="stat-label">High Intent</div>
          </div>
          <div className="stat-card">
            <div style={{ color: 'var(--accent-emerald)' }}>
              <Target size={20} />
            </div>
            <div className="stat-value" style={{ color: 'var(--accent-emerald)', marginTop: 8 }}>
              {history.filter(h => h.intent?.priority === 'Hot').length}
            </div>
            <div className="stat-label">Hot Leads</div>
          </div>
          <div className="stat-card">
            <div style={{ color: 'var(--accent-violet)' }}>
              <Layers size={20} />
            </div>
            <div className="stat-value" style={{ color: 'var(--accent-violet)', marginTop: 8 }}>
              {history.reduce((sum, h) => sum + (h.techStack?.totalFound || 0), 0)}
            </div>
            <div className="stat-label">Technologies Found</div>
          </div>
        </div>

        <div className="grid-2">
          <div className="card">
            <div className="card-header">
              <div className="card-header-icon indigo"><Radar size={18} /></div>
              <div>
                <div className="card-title">Quick Actions</div>
                <div className="card-subtitle">Start an analysis</div>
              </div>
            </div>

            <div
              className="action-item"
              style={{ cursor: 'pointer' }}
              onClick={() => onNavigate('visitor')}
            >
              <div className="action-priority high" />
              <div style={{ flex: 1 }}>
                <div className="action-text">Analyze Visitor Signals</div>
                <div className="action-reasoning">Input IP, pages visited, and behavior to identify accounts</div>
              </div>
              <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
            </div>

            <div
              className="action-item"
              style={{ cursor: 'pointer' }}
              onClick={() => onNavigate('company')}
            >
              <div className="action-priority medium" style={{ background: 'var(--accent-cyan)' }} />
              <div style={{ flex: 1 }}>
                <div className="action-text">Company Lookup</div>
                <div className="action-reasoning">Research and enrich any company with AI</div>
              </div>
              <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
            </div>

            <div
              className="action-item"
              style={{ cursor: 'pointer' }}
              onClick={() => onNavigate('batch')}
            >
              <div className="action-priority low" style={{ background: 'var(--accent-violet)' }} />
              <div style={{ flex: 1 }}>
                <div className="action-text">Batch Processing</div>
                <div className="action-reasoning">Upload a list of companies for bulk enrichment</div>
              </div>
              <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-header-icon cyan"><Globe size={18} /></div>
              <div>
                <div className="card-title">Simulated Visitor Feed</div>
                <div className="card-subtitle">Live anonymous visitor signals</div>
              </div>
            </div>

            {SAMPLE_VISITORS.map(v => (
              <div key={v.id} className="signal-item" style={{ marginBottom: 10, cursor: 'pointer' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'var(--gradient-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.72rem', fontWeight: 700, flexShrink: 0
                }}>
                  {v.id}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{v.company}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {v.ip} · {v.pages.length} pages · {v.time}
                  </div>
                </div>
                <div className="badge badge-indigo">{v.visits} visits</div>
              </div>
            ))}
          </div>
        </div>

        {history.length > 0 && (
          <div className="card mt-24">
            <div className="card-header">
              <div className="card-header-icon emerald"><Clock size={18} /></div>
              <div>
                <div className="card-title">Recent Analysis History</div>
                <div className="card-subtitle">{history.length} analyses performed</div>
              </div>
            </div>

            {history.slice(0, 5).map((item, i) => (
              <div
                key={i}
                className="action-item"
                style={{ cursor: 'pointer' }}
                onClick={() => onViewReport(item)}
              >
                <div
                  className="action-priority"
                  style={{
                    background: item.intent?.priority === 'Hot' ? 'var(--accent-rose)' :
                      item.intent?.priority === 'Warm' ? 'var(--accent-amber)' : 'var(--accent-emerald)'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div className="action-text">
                    {item.company?.name || 'Unknown Company'}
                  </div>
                  <div className="action-reasoning">
                    {item.company?.industry || 'Unknown Industry'} ·{' '}
                    {item.intent?.stage || 'Unknown'} Stage
                    {item.intent?.intentScore != null && ` · Score: ${item.intent.intentScore}/10`}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {item.intent && (
                    <span className={`badge ${item.intent.priority === 'Hot' ? 'badge-rose' :
                      item.intent.priority === 'Warm' ? 'badge-amber' : 'badge-emerald'}`}>
                      {item.intent.priority}
                    </span>
                  )}
                  <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
