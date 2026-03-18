import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI = null;
let model = null;

export function initializeAI(apiKey) {
  if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    return true;
  }
  return false;
}

export async function generateCompanyIntelligence(companyData) {
  const {
    companyName,
    domain,
    industry,
    size,
    location,
    visitorBehavior,
    techStack,
    intentScore,
    persona
  } = companyData;

  const prompt = `You are an expert B2B sales intelligence analyst. Analyze the following company data and provide structured intelligence.

COMPANY DATA:
- Company Name: ${companyName}
- Domain: ${domain || 'Unknown'}
- Industry: ${industry || 'Unknown'}
- Company Size: ${size || 'Unknown'}
- Location: ${location || 'Unknown'}
${visitorBehavior ? `
VISITOR BEHAVIOR:
- Pages Visited: ${visitorBehavior.pagesVisited?.join(', ') || 'N/A'}
- Time on Site: ${visitorBehavior.timeOnSite || 'N/A'}
- Visits This Week: ${visitorBehavior.visitsThisWeek || 'N/A'}
- Referral Source: ${visitorBehavior.referralSource || 'Direct'}
` : ''}
${techStack ? `
DETECTED TECH STACK:
${techStack.map(t => `- ${t.name} (${t.category})`).join('\n')}
` : ''}
${intentScore ? `
INTENT ANALYSIS:
- Score: ${intentScore.intentScore}/10
- Stage: ${intentScore.stage}
- Priority: ${intentScore.priority}
` : ''}
${persona ? `
PERSONA INFERENCE:
- Likely Persona: ${persona.likelyPersona}
- Likely Title: ${persona.likelyTitle}
- Department: ${persona.department}
- Confidence: ${persona.confidence}%
` : ''}

Provide your response STRICTLY as valid JSON with the following structure (no markdown, no code fences, just pure JSON):
{
  "companyProfile": {
    "description": "2-3 sentence business description",
    "founded": "estimated founding year or 'Unknown'",
    "revenue": "estimated revenue range or 'Unknown'",
    "businessModel": "B2B/B2C/Both",
    "keyProducts": ["product1", "product2"],
    "competitors": ["competitor1", "competitor2", "competitor3"]
  },
  "leadership": [
    {"name": "Full Name", "title": "Job Title", "relevance": "Why this person matters for sales"},
    {"name": "Full Name", "title": "Job Title", "relevance": "Why this person matters for sales"},
    {"name": "Full Name", "title": "Job Title", "relevance": "Why this person matters for sales"}
  ],
  "businessSignals": [
    {"signal": "Signal description", "type": "growth|risk|opportunity|news", "impact": "high|medium|low"},
    {"signal": "Signal description", "type": "growth|risk|opportunity|news", "impact": "high|medium|low"}
  ],
  "aiSummary": "3-5 sentence intelligence summary combining all data points into actionable narrative",
  "salesActions": [
    {"action": "Specific action step", "priority": "high|medium|low", "reasoning": "Why this action"},
    {"action": "Specific action step", "priority": "high|medium|low", "reasoning": "Why this action"},
    {"action": "Specific action step", "priority": "high|medium|low", "reasoning": "Why this action"}
  ],
  "talkingPoints": ["Key point for outreach", "Pain point to address", "Value proposition to highlight"],
  "riskFactors": ["Potential risk or objection 1", "Potential risk or objection 2"]
}`;

  if (model) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonStr = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error('Gemini API error:', error.message);
      return generateFallbackIntelligence(companyData);
    }
  }

  return generateFallbackIntelligence(companyData);
}

export async function enrichCompanyFromName(companyName) {
  const prompt = `You are an expert business researcher. Research the company "${companyName}" and provide comprehensive, factual information.

Provide your response STRICTLY as valid JSON (no markdown, no code fences, just pure JSON):
{
  "companyName": "${companyName}",
  "domain": "company website domain",
  "industry": "primary industry",
  "subIndustry": "specific sub-industry",
  "size": "estimated employee count with range",
  "location": "headquarters city, state/country",
  "founded": "founding year",
  "description": "2-3 sentence company description",
  "revenue": "estimated revenue range",
  "businessModel": "B2B/B2C/Both",
  "keyProducts": ["product1", "product2"],
  "competitors": ["competitor1", "competitor2"],
  "recentNews": "any notable recent developments",
  "socialPresence": {
    "linkedin": "linkedin URL or 'Unknown'",
    "twitter": "twitter handle or 'Unknown'"
  }
}

If the company is not well-known, provide your best estimates based on the company name and likely industry. Always return valid JSON.`;

  if (model) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonStr = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error('Gemini API error for company enrichment:', error.message);
      return generateFallbackCompanyData(companyName);
    }
  }

  return generateFallbackCompanyData(companyName);
}

function generateFallbackIntelligence(companyData) {
  const { companyName, industry, size, intentScore, persona } = companyData;

  const industryDescriptions = {
    'Mortgage Lending': `${companyName} is a mortgage lending company operating in the competitive financial services sector. They likely deal with high volumes of loan applications and are looking for ways to streamline their sales operations and improve conversion rates.`,
    'Real Estate': `${companyName} is a real estate company focused on property transactions and management. They are likely seeking technology solutions to enhance their agent productivity and client relationship management.`,
    'Real Estate Technology': `${companyName} is a real estate technology company that leverages digital solutions to transform the property market. They are focused on innovation and scalability in the proptech space.`,
    'Technology': `${companyName} is a technology company focused on delivering innovative solutions. They are likely evaluating tools to enhance their go-to-market strategy and sales efficiency.`
  };

  const summary = industryDescriptions[industry] || `${companyName} is a ${size || 'mid-sized'} company in the ${industry || 'technology'} sector. They are currently exploring solutions to improve their sales and marketing operations.`;

  let actionSummary = '';
  if (intentScore?.intentScore >= 7) {
    actionSummary = `High-intent visitor detected from ${companyName}. `;
  } else if (intentScore?.intentScore >= 4) {
    actionSummary = `${companyName} is showing moderate buying interest. `;
  }

  if (persona?.likelyTitle) {
    actionSummary += `The visitor profile suggests a ${persona.likelyTitle} is evaluating solutions.`;
  }

  return {
    companyProfile: {
      description: summary,
      founded: 'Unknown',
      revenue: size?.includes('200') ? '$10M-$50M' : size?.includes('1000') ? '$100M-$500M' : '$1M-$10M',
      businessModel: 'B2B',
      keyProducts: [`${industry || 'Technology'} Solutions`, 'Enterprise Services'],
      competitors: ['Industry Competitor A', 'Industry Competitor B', 'Industry Competitor C']
    },
    leadership: [
      { name: 'CEO / Founder', title: 'Chief Executive Officer', relevance: 'Final decision maker for strategic purchases' },
      { name: 'VP Sales', title: 'Vice President of Sales', relevance: 'Primary champion for sales technology purchases' },
      { name: 'Head of Operations', title: 'Director of Operations', relevance: 'Key influencer for operational tool decisions' }
    ],
    businessSignals: [
      { signal: `Active evaluation of ${industry || 'technology'} solutions`, type: 'opportunity', impact: 'high' },
      { signal: 'Website engagement indicates tool evaluation phase', type: 'opportunity', impact: 'medium' },
      { signal: `${industry || 'Industry'} market growth driving modernization needs`, type: 'growth', impact: 'medium' }
    ],
    aiSummary: `${summary} ${actionSummary} Recent browsing behavior indicates active evaluation of new tools and platforms. This represents a strong opportunity for targeted outreach.`,
    salesActions: [
      { action: `Research key decision makers at ${companyName} on LinkedIn`, priority: 'high', reasoning: 'Personalized outreach to the right stakeholder increases response rates' },
      { action: `Add ${companyName} to high-priority outbound campaign`, priority: 'high', reasoning: 'Active engagement signals suggest readiness for sales conversation' },
      { action: `Prepare ${industry || 'industry'}-specific case study for outreach`, priority: 'medium', reasoning: 'Relevant social proof accelerates the evaluation process' }
    ],
    talkingPoints: [
      `Address specific ${industry || 'industry'} challenges and pain points`,
      'Highlight ROI and time-to-value metrics',
      'Reference similar customer success stories'
    ],
    riskFactors: [
      'May already be evaluating competing solutions',
      'Budget cycle timing could delay decision'
    ]
  };
}

function generateFallbackCompanyData(companyName) {
  const nameLower = companyName.toLowerCase();
  let industry = 'Technology';
  let subIndustry = 'Software';

  if (nameLower.includes('mortgage') || nameLower.includes('lending') || nameLower.includes('loan')) {
    industry = 'Financial Services';
    subIndustry = 'Mortgage Lending';
  } else if (nameLower.includes('realty') || nameLower.includes('real estate') || nameLower.includes('compass') || nameLower.includes('redfin')) {
    industry = 'Real Estate';
    subIndustry = 'Real Estate Technology';
  } else if (nameLower.includes('health') || nameLower.includes('med')) {
    industry = 'Healthcare';
    subIndustry = 'Health Technology';
  }

  const domainName = companyName.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';

  return {
    companyName,
    domain: domainName,
    industry,
    subIndustry,
    size: '50-500 employees',
    location: 'United States',
    founded: 'Unknown',
    description: `${companyName} is a company operating in the ${industry} sector, specializing in ${subIndustry}. They provide solutions to clients across their market segment.`,
    revenue: '$5M-$50M (estimated)',
    businessModel: 'B2B',
    keyProducts: [`${subIndustry} Solutions`],
    competitors: ['Industry peers'],
    recentNews: 'No recent news available',
    socialPresence: {
      linkedin: 'Unknown',
      twitter: 'Unknown'
    }
  };
}
