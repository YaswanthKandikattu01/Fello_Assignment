import React from 'react';
import {
  ArrowLeft, Building2, Globe, MapPin, Users, Calendar, DollarSign,
  Cpu, Shield, User, TrendingUp, Target, Zap, AlertTriangle,
  MessageSquare, ExternalLink, Clock, CheckCircle, Briefcase
} from 'lucide-react';

function IntentGauge({ score, maxScore = 10, stage, priority }) {
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / maxScore) * circumference;

  let color;
  if (score >= 8) color = 'var(--accent-rose)';
  else if (score >= 6) color = 'var(--accent-amber)';
  else if (score >= 4) color = 'var(--accent-cyan)';
  else color = 'var(--accent-emerald)';

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="intent-gauge">
        <svg width="160" height="160" className="intent-gauge-circle">
          <circle className="intent-gauge-bg" cx="80" cy="80" r={radius} />
          <circle
            className="intent-gauge-fill"
            cx="80" cy="80" r={radius}
            style={{
              stroke: color,
              strokeDasharray: circumference,
              strokeDashoffset: circumference - progress,
              filter: `drop-shadow(0 0 6px ${color})`
            }}
          />
        </svg>
        <div className="intent-gauge-value">
          <div className="intent-gauge-score" style={{ color }}>{score}</div>
          <div className="intent-gauge-label">/ {maxScore}</div>
        </div>
      </div>
      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 8 }}>
        <span className={`badge ${priority === 'Hot' ? 'badge-rose' : priority === 'Warm' ? 'badge-amber' : 'badge-emerald'}`}>
          {priority}
        </span>
        <span className="badge badge-indigo">{stage}</span>
      </div>
    </div>
  );
}

function PipelineView({ pipeline }) {
  if (!pipeline?.stages) return null;
  return (
    <div>
      {pipeline.stages.map((stage, i) => (
        <div key={i} className={`pipeline-stage ${stage.status}`}>
          <div className={`pipeline-dot ${stage.status}`} />
          <span className="pipeline-stage-name">{stage.name}</span>
          {stage.duration != null && (
            <span className="pipeline-stage-time">{stage.duration}ms</span>
          )}
          {stage.status === 'complete' && <CheckCircle size={14} style={{ color: 'var(--accent-emerald)' }} />}
        </div>
      ))}
      {pipeline.totalDuration != null && (
        <div style={{ textAlign: 'right', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 8, fontFamily: 'var(--font-mono)' }}>
          Total: {pipeline.totalDuration}ms
        </div>
      )}
    </div>
  );
}

export default function IntelligenceReport({ data, onBack }) {
  if (!data) return null;

  const { company, persona, intent, techStack, intelligence, pipeline } = data;

  return (
    <>
      <div className="page-header">
        <button className="btn btn-secondary btn-sm mb-12" onClick={onBack}>
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
        <div className="company-header" style={{ border: 'none', padding: 0, margin: 0 }}>
          <div className="company-logo-placeholder">
            {(company?.name || 'U').charAt(0)}
          </div>
          <div>
            <h2 className="company-name">{company?.name || 'Unknown Company'}</h2>
            {company?.domain && (
              <div className="company-domain">
                {company.domain}
                <a
                  href={`https://${company.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginLeft: 8, color: 'var(--text-muted)' }}
                >
                  <ExternalLink size={12} />
                </a>
              </div>
            )}
            <div className="company-meta">
              {company?.industry && (
                <span className="company-meta-item"><Briefcase size={14} />{company.industry}</span>
              )}
              {company?.size && (
                <span className="company-meta-item"><Users size={14} />{company.size}</span>
              )}
              {company?.location && (
                <span className="company-meta-item"><MapPin size={14} />{company.location}</span>
              )}
              {company?.founded && company.founded !== 'Unknown' && (
                <span className="company-meta-item"><Calendar size={14} />Founded {company.founded}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        {intelligence?.aiSummary && (
          <div className="report-section">
            <div className="card">
              <div className="card-header">
                <div className="card-header-icon indigo"><Zap size={18} /></div>
                <div>
                  <div className="card-title">AI Intelligence Summary</div>
                  <div className="card-subtitle">AI-generated account analysis</div>
                </div>
              </div>
              <div className="summary-box">{intelligence.aiSummary}</div>
            </div>
          </div>
        )}

        <div className="report-section">
          <div className="grid-2">
            {intent && (
              <div className="card">
                <div className="card-header">
                  <div className="card-header-icon rose"><Target size={18} /></div>
                  <div>
                    <div className="card-title">Intent Score</div>
                    <div className="card-subtitle">Buying signal analysis</div>
                  </div>
                </div>
                <IntentGauge
                  score={intent.intentScore}
                  maxScore={intent.maxScore}
                  stage={intent.stage}
                  priority={intent.priority}
                />
                {intent.signals && intent.signals.length > 0 && (
                  <div style={{ marginTop: 20 }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Signals Detected
                    </div>
                    {intent.signals.slice(0, 5).map((s, i) => (
                      <div key={i} className="signal-item">
                        <span className={`signal-weight ${s.weight}`}>{s.weight}</span>
                        <span style={{ flex: 1 }}>{s.signal}</span>
                        <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>+{s.points}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {persona && (
              <div className="card">
                <div className="card-header">
                  <div className="card-header-icon violet"><User size={18} /></div>
                  <div>
                    <div className="card-title">Persona Inference</div>
                    <div className="card-subtitle">Visitor profile analysis</div>
                  </div>
                </div>
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: '50%',
                    background: 'var(--gradient-accent)', margin: '0 auto 12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <User size={28} />
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{persona.likelyTitle || persona.likelyPersona}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4 }}>{persona.department} Department</div>
                  <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 8 }}>
                    <span className="badge badge-violet">{persona.confidence}% confidence</span>
                  </div>
                </div>
                {persona.reasoning && (
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 12, padding: '12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                    {persona.reasoning}
                  </div>
                )}
                {persona.allPersonas && persona.allPersonas.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Persona Distribution
                    </div>
                    {persona.allPersonas.map((p, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <span style={{ fontSize: '0.82rem', flex: 1, color: 'var(--text-secondary)' }}>{p.persona}</span>
                        <div style={{ width: 100, height: 6, background: 'var(--bg-tertiary)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{
                            width: `${p.score}%`, height: '100%',
                            background: i === 0 ? 'var(--accent-violet)' : i === 1 ? 'var(--accent-indigo)' : 'var(--accent-cyan)',
                            borderRadius: 3,
                            transition: 'width 1s ease'
                          }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', width: 30, textAlign: 'right' }}>{p.score}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="report-section">
          <div className="grid-2">
            <div className="card">
              <div className="card-header">
                <div className="card-header-icon cyan"><Building2 size={18} /></div>
                <div>
                  <div className="card-title">Company Profile</div>
                  <div className="card-subtitle">Enriched company data</div>
                </div>
              </div>
              <div className="detail-grid">
                <div className="detail-item">
                  <div className="detail-label">Industry</div>
                  <div className="detail-value">{company?.industry || company?.subIndustry || 'Unknown'}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Company Size</div>
                  <div className="detail-value">{company?.size || 'Unknown'}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Location</div>
                  <div className="detail-value">{company?.location || 'Unknown'}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Revenue</div>
                  <div className="detail-value">{company?.revenue || intelligence?.companyProfile?.revenue || 'Unknown'}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Business Model</div>
                  <div className="detail-value">{company?.businessModel || intelligence?.companyProfile?.businessModel || 'Unknown'}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Founded</div>
                  <div className="detail-value">{company?.founded || intelligence?.companyProfile?.founded || 'Unknown'}</div>
                </div>
              </div>

              {(intelligence?.companyProfile?.description || company?.description) && (
                <div style={{ marginTop: 16, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {intelligence?.companyProfile?.description || company?.description}
                </div>
              )}

              {intelligence?.companyProfile?.competitors && intelligence.companyProfile.competitors.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Competitors
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {intelligence.companyProfile.competitors.map((c, i) => (
                      <span key={i} className="badge badge-indigo">{c}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-header-icon emerald"><Cpu size={18} /></div>
                <div>
                  <div className="card-title">Technology Stack</div>
                  <div className="card-subtitle">{techStack?.totalFound || 0} technologies detected</div>
                </div>
              </div>
              {techStack?.detected && techStack.detected.length > 0 ? (
                <div className="tech-grid">
                  {techStack.detected.map((tech, i) => (
                    <div key={i} className="tech-tag">
                      <Cpu size={12} style={{ color: 'var(--accent-cyan)' }} />
                      <span>{tech.name}</span>
                      <span className="tech-tag-category">{tech.category}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state" style={{ padding: '30px 20px' }}>
                  <Shield size={32} style={{ opacity: 0.2 }} />
                  <p style={{ marginTop: 8 }}>
                    {techStack?.error || 'No technologies detected. Website may be unreachable.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {intelligence?.leadership && intelligence.leadership.length > 0 && (
          <div className="report-section">
            <div className="card">
              <div className="card-header">
                <div className="card-header-icon amber"><Users size={18} /></div>
                <div>
                  <div className="card-title">Leadership & Decision Makers</div>
                  <div className="card-subtitle">Key contacts for outreach</div>
                </div>
              </div>
              <div className="grid-3">
                {intelligence.leadership.map((leader, i) => (
                  <div key={i} className="leadership-card">
                    <div className="leadership-avatar" style={{
                      background: i === 0 ? 'var(--gradient-primary)' :
                        i === 1 ? 'var(--gradient-accent)' : 'var(--gradient-success)'
                    }}>
                      {(leader.name || 'U').charAt(0)}
                    </div>
                    <div>
                      <div className="leadership-name">{leader.name}</div>
                      <div className="leadership-title">{leader.title}</div>
                      <div className="leadership-relevance">{leader.relevance}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="report-section">
          <div className="grid-2">
            {intelligence?.salesActions && intelligence.salesActions.length > 0 && (
              <div className="card">
                <div className="card-header">
                  <div className="card-header-icon rose"><Target size={18} /></div>
                  <div>
                    <div className="card-title">Recommended Sales Actions</div>
                    <div className="card-subtitle">AI-suggested next steps</div>
                  </div>
                </div>
                {intelligence.salesActions.map((action, i) => (
                  <div key={i} className="action-item">
                    <div className={`action-priority ${action.priority}`} />
                    <div>
                      <div className="action-text">{action.action}</div>
                      <div className="action-reasoning">{action.reasoning}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {intelligence?.businessSignals && intelligence.businessSignals.length > 0 && (
              <div className="card">
                <div className="card-header">
                  <div className="card-header-icon blue"><TrendingUp size={18} /></div>
                  <div>
                    <div className="card-title">Business Signals</div>
                    <div className="card-subtitle">Growth indicators & opportunities</div>
                  </div>
                </div>
                {intelligence.businessSignals.map((signal, i) => (
                  <div key={i} className={`business-signal ${signal.type}`}>
                    <div style={{ flex: 1 }}>
                      <div className="business-signal-text">{signal.signal}</div>
                    </div>
                    <div className="business-signal-impact" style={{
                      color: signal.impact === 'high' ? 'var(--accent-rose)' :
                        signal.impact === 'medium' ? 'var(--accent-amber)' : 'var(--accent-emerald)'
                    }}>
                      {signal.impact}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {(intelligence?.talkingPoints || intelligence?.riskFactors) && (
          <div className="report-section">
            <div className="grid-2">
              {intelligence.talkingPoints && intelligence.talkingPoints.length > 0 && (
                <div className="card">
                  <div className="card-header">
                    <div className="card-header-icon indigo"><MessageSquare size={18} /></div>
                    <div>
                      <div className="card-title">Talking Points</div>
                      <div className="card-subtitle">Key points for outreach</div>
                    </div>
                  </div>
                  <ul className="talking-points">
                    {intelligence.talkingPoints.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}

              {intelligence.riskFactors && intelligence.riskFactors.length > 0 && (
                <div className="card">
                  <div className="card-header">
                    <div className="card-header-icon amber"><AlertTriangle size={18} /></div>
                    <div>
                      <div className="card-title">Risk Factors</div>
                      <div className="card-subtitle">Potential objections to prepare for</div>
                    </div>
                  </div>
                  {intelligence.riskFactors.map((risk, i) => (
                    <div key={i} className="risk-item">{risk}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="report-section">
          <div className="card">
            <div className="card-header">
              <div className="card-header-icon emerald"><Clock size={18} /></div>
              <div>
                <div className="card-title">Enrichment Pipeline</div>
                <div className="card-subtitle">Processing stages and timing</div>
              </div>
            </div>
            <PipelineView pipeline={pipeline} />
          </div>
        </div>
      </div>
    </>
  );
}
