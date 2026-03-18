import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Radar, Building2, Layers, Settings, Zap,
  ChevronRight, Key
} from 'lucide-react';
import { checkHealth, setApiKey, getConfig } from './services/api';
import Dashboard from './components/Dashboard';
import VisitorAnalysis from './components/VisitorAnalysis';
import CompanyLookup from './components/CompanyLookup';
import BatchProcessor from './components/BatchProcessor';
import IntelligenceReport from './components/IntelligenceReport';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'visitor', label: 'Visitor Analysis', icon: Radar },
  { id: 'company', label: 'Company Lookup', icon: Building2 },
  { id: 'batch', label: 'Batch Processing', icon: Layers },
];

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [aiEnabled, setAiEnabled] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showApiKeyForm, setShowApiKeyForm] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);

  useEffect(() => {
    getConfig()
      .then(cfg => setAiEnabled(cfg.aiEnabled))
      .catch(() => {});
  }, []);

  const handleSetApiKey = async () => {
    if (!apiKeyInput.trim()) return;
    const result = await setApiKey(apiKeyInput.trim());
    if (result.success) {
      setAiEnabled(true);
      setShowApiKeyForm(false);
      setApiKeyInput('');
    }
  };

  const handleViewReport = (data) => {
    setReportData(data);
    setActiveView('report');
    setAnalysisHistory(prev => {
      const newHistory = [{ ...data, viewedAt: new Date().toISOString() }, ...prev];
      return newHistory.slice(0, 20);
    });
  };

  const handleBackFromReport = () => {
    setReportData(null);
    setActiveView('dashboard');
  };

  const renderPage = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard history={analysisHistory} onViewReport={handleViewReport} onNavigate={setActiveView} />;
      case 'visitor':
        return <VisitorAnalysis onResult={handleViewReport} />;
      case 'company':
        return <CompanyLookup onResult={handleViewReport} />;
      case 'batch':
        return <BatchProcessor onViewReport={handleViewReport} />;
      case 'report':
        return <IntelligenceReport data={reportData} onBack={handleBackFromReport} />;
      default:
        return <Dashboard history={analysisHistory} onViewReport={handleViewReport} onNavigate={setActiveView} />;
    }
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>AccountIQ</h1>
          <p>AI Account Intelligence</p>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Analysis</div>
          {NAV_ITEMS.map(item => (
            <div
              key={item.id}
              className={`nav-item ${activeView === item.id ? 'active' : ''}`}
              onClick={() => setActiveView(item.id)}
            >
              <item.icon />
              <span>{item.label}</span>
            </div>
          ))}

          <div className="nav-section-label" style={{ marginTop: 'auto' }}>Settings</div>
          <div
            className={`nav-item ${showApiKeyForm ? 'active' : ''}`}
            onClick={() => setShowApiKeyForm(!showApiKeyForm)}
          >
            <Key />
            <span>API Configuration</span>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="ai-status">
            <div className={`ai-status-dot ${aiEnabled ? 'online' : 'offline'}`} />
            <span style={{ color: aiEnabled ? 'var(--accent-emerald)' : 'var(--accent-amber)', fontWeight: 500 }}>
              {aiEnabled ? 'Gemini AI Active' : 'Fallback Mode'}
            </span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        {showApiKeyForm && (
          <div className="api-key-banner">
            <Key size={16} style={{ color: 'var(--accent-amber)', flexShrink: 0 }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', flexShrink: 0 }}>
              {aiEnabled ? 'AI Connected' : 'Set Gemini API Key:'}
            </span>
            {!aiEnabled && (
              <>
                <input
                  className="form-input"
                  type="password"
                  placeholder="Enter your Gemini API key..."
                  value={apiKeyInput}
                  onChange={e => setApiKeyInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSetApiKey()}
                  style={{ flex: 1 }}
                />
                <button className="btn btn-primary btn-sm" onClick={handleSetApiKey}>
                  <Zap size={14} /> Connect
                </button>
              </>
            )}
            {aiEnabled && (
              <span style={{ fontSize: '0.82rem', color: 'var(--accent-emerald)' }}>
                ✓ Gemini AI is connected and ready
              </span>
            )}
          </div>
        )}
        {renderPage()}
      </main>
    </div>
  );
}
