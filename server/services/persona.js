const PAGE_CATEGORIES = {
  pricing: { persona: 'Decision Maker / Budget Holder', stage: 'Evaluation', intentWeight: 9, department: 'Executive / Finance' },
  demo: { persona: 'Champion / Evaluator', stage: 'Consideration', intentWeight: 8, department: 'Operations' },
  'case-studies': { persona: 'Decision Maker / Champion', stage: 'Evaluation', intentWeight: 8, department: 'Executive' },
  'case-study': { persona: 'Decision Maker / Champion', stage: 'Evaluation', intentWeight: 8, department: 'Executive' },
  integrations: { persona: 'Technical Evaluator', stage: 'Consideration', intentWeight: 6, department: 'Engineering / IT' },
  api: { persona: 'Developer / Technical Lead', stage: 'Evaluation', intentWeight: 7, department: 'Engineering' },
  docs: { persona: 'Technical User', stage: 'Research', intentWeight: 5, department: 'Engineering' },
  documentation: { persona: 'Technical User', stage: 'Research', intentWeight: 5, department: 'Engineering' },
  blog: { persona: 'Researcher / Early Explorer', stage: 'Awareness', intentWeight: 3, department: 'Various' },
  about: { persona: 'General Visitor', stage: 'Awareness', intentWeight: 2, department: 'Various' },
  careers: { persona: 'Job Seeker', stage: 'Not Applicable', intentWeight: 0, department: 'HR' },
  contact: { persona: 'Active Prospect', stage: 'Decision', intentWeight: 9, department: 'Various' },
  'sign-up': { persona: 'Active Buyer', stage: 'Decision', intentWeight: 10, department: 'Various' },
  signup: { persona: 'Active Buyer', stage: 'Decision', intentWeight: 10, department: 'Various' },
  login: { persona: 'Existing User', stage: 'Customer', intentWeight: 1, department: 'Various' },
  features: { persona: 'Evaluator', stage: 'Consideration', intentWeight: 7, department: 'Operations / Product' },
  solutions: { persona: 'Business Stakeholder', stage: 'Consideration', intentWeight: 7, department: 'Executive / Operations' },
  enterprise: { persona: 'Enterprise Buyer', stage: 'Evaluation', intentWeight: 8, department: 'Executive / Procurement' },
  security: { persona: 'IT / Compliance', stage: 'Evaluation', intentWeight: 6, department: 'IT / Security' },
  'ai-sales-agent': { persona: 'Sales Operations Leader', stage: 'Evaluation', intentWeight: 8, department: 'Sales / RevOps' },
  product: { persona: 'Product Evaluator', stage: 'Consideration', intentWeight: 6, department: 'Product / Operations' },
  resources: { persona: 'Researcher', stage: 'Awareness', intentWeight: 4, department: 'Various' },
  webinar: { persona: 'Engaged Prospect', stage: 'Consideration', intentWeight: 5, department: 'Various' },
  roi: { persona: 'Financial Decision Maker', stage: 'Evaluation', intentWeight: 8, department: 'Finance / Executive' },
  comparison: { persona: 'Active Evaluator', stage: 'Evaluation', intentWeight: 9, department: 'Operations' },
  testimonials: { persona: 'Late-Stage Evaluator', stage: 'Decision', intentWeight: 8, department: 'Executive' }
};

function classifyPage(pagePath) {
  const path = pagePath.toLowerCase().replace(/^\//, '').replace(/\/$/, '');

  for (const [key, value] of Object.entries(PAGE_CATEGORIES)) {
    if (path.includes(key)) {
      return { ...value, matchedKeyword: key, originalPath: pagePath };
    }
  }

  return {
    persona: 'General Visitor',
    stage: 'Awareness',
    intentWeight: 2,
    department: 'Unknown',
    matchedKeyword: 'general',
    originalPath: pagePath
  };
}

export function inferPersona(pagesVisited) {
  if (!pagesVisited || pagesVisited.length === 0) {
    return {
      likelyPersona: 'Unknown Visitor',
      confidence: 0,
      department: 'Unknown',
      reasoning: 'No page visit data available'
    };
  }

  const classifications = pagesVisited.map(classifyPage);
  const personaCounts = {};
  const departmentCounts = {};

  for (const c of classifications) {
    personaCounts[c.persona] = (personaCounts[c.persona] || 0) + c.intentWeight;
    departmentCounts[c.department] = (departmentCounts[c.department] || 0) + 1;
  }

  const sortedPersonas = Object.entries(personaCounts).sort((a, b) => b[1] - a[1]);
  const topPersona = sortedPersonas[0];

  const sortedDepartments = Object.entries(departmentCounts).sort((a, b) => b[1] - a[1]);
  const topDepartment = sortedDepartments[0];

  const maxPossibleScore = classifications.length * 10;
  const confidence = Math.min(95, Math.round((topPersona[1] / maxPossibleScore) * 100 + (classifications.length * 5)));

  const PERSONA_TITLE_MAP = {
    'Decision Maker / Budget Holder': 'VP of Sales / Head of Revenue',
    'Decision Maker / Champion': 'Director of Operations',
    'Champion / Evaluator': 'Sales Operations Manager',
    'Technical Evaluator': 'Solutions Architect / IT Manager',
    'Developer / Technical Lead': 'Engineering Lead / CTO',
    'Technical User': 'Developer / Engineer',
    'Researcher / Early Explorer': 'Marketing Analyst',
    'Sales Operations Leader': 'Head of Sales Operations / RevOps Leader',
    'Enterprise Buyer': 'VP of Procurement / CIO',
    'Financial Decision Maker': 'CFO / Finance Director',
    'Active Evaluator': 'Project Lead / Operations Manager',
    'Active Buyer': 'Procurement Manager',
    'Active Prospect': 'Business Development Lead',
    'Business Stakeholder': 'Director of Strategy'
  };

  const likelyTitle = PERSONA_TITLE_MAP[topPersona[0]] || topPersona[0];

  const highIntentPages = classifications.filter(c => c.intentWeight >= 7).map(c => c.originalPath);
  const researchPages = classifications.filter(c => c.intentWeight < 7 && c.intentWeight > 2).map(c => c.originalPath);

  let reasoning = `Visitor browsed ${pagesVisited.length} page(s). `;
  if (highIntentPages.length > 0) {
    reasoning += `High-intent pages visited: ${highIntentPages.join(', ')}. `;
  }
  if (researchPages.length > 0) {
    reasoning += `Research pages: ${researchPages.join(', ')}. `;
  }
  reasoning += `Primary persona pattern: ${topPersona[0]} (${topDepartment[0]} department).`;

  return {
    likelyPersona: topPersona[0],
    likelyTitle,
    confidence,
    department: topDepartment[0],
    reasoning,
    pageClassifications: classifications,
    allPersonas: sortedPersonas.slice(0, 3).map(([persona, score]) => ({
      persona,
      score: Math.round((score / maxPossibleScore) * 100)
    }))
  };
}
