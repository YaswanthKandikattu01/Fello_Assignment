import { lookupIP } from './ip-lookup.js';
import { inferPersona } from './persona.js';
import { scoreIntent } from './intent.js';
import { detectTechStack } from './tech-detect.js';
import { generateCompanyIntelligence, enrichCompanyFromName } from './ai-agent.js';

export async function enrichFromVisitorSignals(visitorData) {
  const pipeline = {
    stages: [],
    startTime: Date.now()
  };

  pipeline.stages.push({ name: 'Company Identification', status: 'running', startTime: Date.now() });

  let companyInfo = null;
  if (visitorData.ip) {
    companyInfo = lookupIP(visitorData.ip);
  }

  if (!companyInfo?.found && visitorData.companyName) {
    const enriched = await enrichCompanyFromName(visitorData.companyName);
    companyInfo = {
      found: true,
      company: enriched.companyName,
      domain: enriched.domain,
      industry: enriched.industry,
      size: enriched.size,
      location: enriched.location,
      method: 'company_name_lookup',
      confidence: 0.95,
      enrichedData: enriched
    };
  }

  pipeline.stages[0].status = 'complete';
  pipeline.stages[0].duration = Date.now() - pipeline.stages[0].startTime;
  pipeline.stages[0].result = companyInfo;

  pipeline.stages.push({ name: 'Persona Inference', status: 'running', startTime: Date.now() });
  const persona = inferPersona(visitorData.pagesVisited || []);
  pipeline.stages[1].status = 'complete';
  pipeline.stages[1].duration = Date.now() - pipeline.stages[1].startTime;

  pipeline.stages.push({ name: 'Intent Scoring', status: 'running', startTime: Date.now() });
  const intent = scoreIntent(visitorData);
  pipeline.stages[2].status = 'complete';
  pipeline.stages[2].duration = Date.now() - pipeline.stages[2].startTime;

  pipeline.stages.push({ name: 'Technology Detection', status: 'running', startTime: Date.now() });
  let techStack = { detected: [], totalFound: 0 };
  const domainToScan = companyInfo?.domain || visitorData.domain;
  if (domainToScan && domainToScan !== 'unknown.com') {
    try {
      techStack = await detectTechStack(domainToScan);
    } catch (e) {
      techStack = { detected: [], error: e.message, totalFound: 0 };
    }
  }
  pipeline.stages[3].status = 'complete';
  pipeline.stages[3].duration = Date.now() - pipeline.stages[3].startTime;

  pipeline.stages.push({ name: 'AI Intelligence Generation', status: 'running', startTime: Date.now() });
  const intelligence = await generateCompanyIntelligence({
    companyName: companyInfo?.company || visitorData.companyName || 'Unknown Company',
    domain: companyInfo?.domain || visitorData.domain || '',
    industry: companyInfo?.industry || '',
    size: companyInfo?.size || '',
    location: companyInfo?.location || '',
    visitorBehavior: visitorData,
    techStack: techStack.detected,
    intentScore: intent,
    persona
  });
  pipeline.stages[4].status = 'complete';
  pipeline.stages[4].duration = Date.now() - pipeline.stages[4].startTime;

  pipeline.totalDuration = Date.now() - pipeline.startTime;

  return {
    company: {
      name: companyInfo?.company || visitorData.companyName || 'Unknown Company',
      domain: companyInfo?.domain || visitorData.domain || 'Unknown',
      industry: companyInfo?.industry || companyInfo?.enrichedData?.industry || 'Unknown',
      size: companyInfo?.size || companyInfo?.enrichedData?.size || 'Unknown',
      location: companyInfo?.location || companyInfo?.enrichedData?.location || 'Unknown',
      identificationMethod: companyInfo?.method || 'manual',
      identificationConfidence: companyInfo?.confidence || 0
    },
    persona,
    intent,
    techStack,
    intelligence,
    pipeline,
    timestamp: new Date().toISOString(),
    visitorId: visitorData.visitorId || null
  };
}

export async function enrichFromCompanyName(companyName) {
  const pipeline = {
    stages: [],
    startTime: Date.now()
  };

  pipeline.stages.push({ name: 'Company Research', status: 'running', startTime: Date.now() });
  const companyData = await enrichCompanyFromName(companyName);
  pipeline.stages[0].status = 'complete';
  pipeline.stages[0].duration = Date.now() - pipeline.stages[0].startTime;

  pipeline.stages.push({ name: 'Technology Detection', status: 'running', startTime: Date.now() });
  let techStack = { detected: [], totalFound: 0 };
  if (companyData.domain && companyData.domain !== 'Unknown') {
    try {
      techStack = await detectTechStack(companyData.domain);
    } catch (e) {
      techStack = { detected: [], error: e.message, totalFound: 0 };
    }
  }
  pipeline.stages[1].status = 'complete';
  pipeline.stages[1].duration = Date.now() - pipeline.stages[1].startTime;

  pipeline.stages.push({ name: 'AI Intelligence Generation', status: 'running', startTime: Date.now() });
  const intelligence = await generateCompanyIntelligence({
    companyName: companyData.companyName,
    domain: companyData.domain,
    industry: companyData.industry,
    size: companyData.size,
    location: companyData.location,
    techStack: techStack.detected
  });
  pipeline.stages[2].status = 'complete';
  pipeline.stages[2].duration = Date.now() - pipeline.stages[2].startTime;

  pipeline.totalDuration = Date.now() - pipeline.startTime;

  return {
    company: {
      name: companyData.companyName,
      domain: companyData.domain,
      industry: companyData.industry,
      subIndustry: companyData.subIndustry,
      size: companyData.size,
      location: companyData.location,
      founded: companyData.founded,
      description: companyData.description,
      revenue: companyData.revenue,
      businessModel: companyData.businessModel,
      keyProducts: companyData.keyProducts,
      competitors: companyData.competitors,
      recentNews: companyData.recentNews,
      socialPresence: companyData.socialPresence
    },
    techStack,
    intelligence,
    pipeline,
    timestamp: new Date().toISOString()
  };
}

export async function batchEnrich(companies) {
  const results = [];

  for (const company of companies) {
    try {
      const result = await enrichFromCompanyName(company);
      results.push({ status: 'success', ...result });
    } catch (error) {
      results.push({
        status: 'error',
        company: { name: company },
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  return {
    totalProcessed: companies.length,
    successful: results.filter(r => r.status === 'success').length,
    failed: results.filter(r => r.status === 'error').length,
    results,
    timestamp: new Date().toISOString()
  };
}
