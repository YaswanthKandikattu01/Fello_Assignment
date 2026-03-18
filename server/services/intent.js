export function scoreIntent(visitorData) {
  const {
    pagesVisited = [],
    timeOnSite = 0,
    visitsThisWeek = 1,
    referralSource = '',
    totalPageViews = 0
  } = visitorData;

  let score = 0;
  let signals = [];
  let maxScore = 0;

  const HIGH_INTENT_PAGES = ['pricing', 'demo', 'contact', 'sign-up', 'signup', 'enterprise', 'roi', 'comparison', 'case-studies', 'case-study'];
  const MEDIUM_INTENT_PAGES = ['features', 'solutions', 'integrations', 'ai-sales-agent', 'product', 'testimonials', 'webinar'];
  const LOW_INTENT_PAGES = ['blog', 'about', 'resources', 'docs', 'documentation'];

  maxScore += 30;
  let pageScore = 0;
  for (const page of pagesVisited) {
    const cleanPage = page.toLowerCase().replace(/^\//, '').replace(/\/$/, '');
    if (HIGH_INTENT_PAGES.some(p => cleanPage.includes(p))) {
      pageScore += 10;
      signals.push({ signal: `High-intent page: ${page}`, weight: 'High', points: 10 });
    } else if (MEDIUM_INTENT_PAGES.some(p => cleanPage.includes(p))) {
      pageScore += 5;
      signals.push({ signal: `Medium-intent page: ${page}`, weight: 'Medium', points: 5 });
    } else if (LOW_INTENT_PAGES.some(p => cleanPage.includes(p))) {
      pageScore += 2;
      signals.push({ signal: `Research page: ${page}`, weight: 'Low', points: 2 });
    }
  }
  score += Math.min(30, pageScore);

  maxScore += 15;
  const timeMinutes = typeof timeOnSite === 'string'
    ? parseTimeString(timeOnSite)
    : timeOnSite / 60;

  if (timeMinutes > 5) {
    score += 15;
    signals.push({ signal: `Extended session: ${timeMinutes.toFixed(1)}m (>5m threshold)`, weight: 'High', points: 15 });
  } else if (timeMinutes > 3) {
    score += 10;
    signals.push({ signal: `Good engagement: ${timeMinutes.toFixed(1)}m session`, weight: 'Medium', points: 10 });
  } else if (timeMinutes > 1) {
    score += 5;
    signals.push({ signal: `Moderate session: ${timeMinutes.toFixed(1)}m`, weight: 'Low', points: 5 });
  }

  maxScore += 20;
  if (visitsThisWeek >= 5) {
    score += 20;
    signals.push({ signal: `Very high frequency: ${visitsThisWeek} visits this week`, weight: 'High', points: 20 });
  } else if (visitsThisWeek >= 3) {
    score += 15;
    signals.push({ signal: `High frequency: ${visitsThisWeek} visits this week`, weight: 'High', points: 15 });
  } else if (visitsThisWeek >= 2) {
    score += 8;
    signals.push({ signal: `Return visitor: ${visitsThisWeek} visits this week`, weight: 'Medium', points: 8 });
  }

  maxScore += 15;
  const pageCount = totalPageViews || pagesVisited.length;
  if (pageCount >= 5) {
    score += 15;
    signals.push({ signal: `Deep exploration: ${pageCount} pages viewed`, weight: 'High', points: 15 });
  } else if (pageCount >= 3) {
    score += 10;
    signals.push({ signal: `Multiple pages: ${pageCount} pages viewed`, weight: 'Medium', points: 10 });
  } else if (pageCount >= 2) {
    score += 5;
    signals.push({ signal: `${pageCount} pages viewed`, weight: 'Low', points: 5 });
  }

  maxScore += 10;
  const ref = referralSource.toLowerCase();
  if (ref.includes('google') || ref.includes('bing') || ref.includes('search')) {
    score += 8;
    signals.push({ signal: `Search engine referral: ${referralSource}`, weight: 'Medium', points: 8 });
  } else if (ref.includes('linkedin') || ref.includes('g2') || ref.includes('capterra')) {
    score += 10;
    signals.push({ signal: `High-intent referral: ${referralSource}`, weight: 'High', points: 10 });
  } else if (ref.includes('email') || ref.includes('newsletter')) {
    score += 7;
    signals.push({ signal: `Email/newsletter referral: ${referralSource}`, weight: 'Medium', points: 7 });
  } else if (ref) {
    score += 3;
    signals.push({ signal: `Referral source: ${referralSource}`, weight: 'Low', points: 3 });
  }

  maxScore += 10;
  const hasPricing = pagesVisited.some(p => p.toLowerCase().includes('pricing'));
  const hasDemo = pagesVisited.some(p => p.toLowerCase().includes('demo'));
  const hasCaseStudy = pagesVisited.some(p => p.toLowerCase().includes('case-stud'));
  const hasFeatures = pagesVisited.some(p => p.toLowerCase().includes('features') || p.toLowerCase().includes('solutions'));

  if (hasPricing && (hasDemo || hasCaseStudy)) {
    score += 10;
    signals.push({ signal: 'Strong buying pattern: Pricing + Case Studies/Demo', weight: 'High', points: 10 });
  } else if (hasPricing && hasFeatures) {
    score += 7;
    signals.push({ signal: 'Evaluation pattern: Pricing + Features', weight: 'Medium', points: 7 });
  } else if (hasCaseStudy && hasFeatures) {
    score += 5;
    signals.push({ signal: 'Research pattern: Case Studies + Features', weight: 'Medium', points: 5 });
  }

  const normalizedScore = Math.min(10, (score / maxScore) * 10);
  const roundedScore = Math.round(normalizedScore * 10) / 10;

  let stage;
  if (roundedScore >= 8) stage = 'Decision';
  else if (roundedScore >= 6) stage = 'Evaluation';
  else if (roundedScore >= 4) stage = 'Consideration';
  else if (roundedScore >= 2) stage = 'Research';
  else stage = 'Awareness';

  let priority;
  if (roundedScore >= 8) priority = 'Hot';
  else if (roundedScore >= 6) priority = 'Warm';
  else if (roundedScore >= 3) priority = 'Nurture';
  else priority = 'Cold';

  return {
    intentScore: roundedScore,
    maxScore: 10,
    stage,
    priority,
    signals: signals.sort((a, b) => b.points - a.points),
    rawScore: score,
    rawMaxScore: maxScore,
    breakdown: {
      pageIntent: Math.min(30, pageScore),
      sessionDepth: Math.min(15, timeMinutes > 5 ? 15 : timeMinutes > 3 ? 10 : timeMinutes > 1 ? 5 : 0),
      visitFrequency: visitsThisWeek >= 5 ? 20 : visitsThisWeek >= 3 ? 15 : visitsThisWeek >= 2 ? 8 : 0,
      pageDepth: pageCount >= 5 ? 15 : pageCount >= 3 ? 10 : pageCount >= 2 ? 5 : 0,
      referralQuality: score - Math.min(30, pageScore) - (timeMinutes > 5 ? 15 : timeMinutes > 3 ? 10 : timeMinutes > 1 ? 5 : 0) - (visitsThisWeek >= 5 ? 20 : visitsThisWeek >= 3 ? 15 : visitsThisWeek >= 2 ? 8 : 0) - (pageCount >= 5 ? 15 : pageCount >= 3 ? 10 : pageCount >= 2 ? 5 : 0)
    }
  };
}

function parseTimeString(timeStr) {
  const match = timeStr.match(/(\d+)m\s*(\d+)?s?/);
  if (match) {
    const minutes = parseInt(match[1]) || 0;
    const seconds = parseInt(match[2]) || 0;
    return minutes + seconds / 60;
  }
  const secMatch = timeStr.match(/(\d+)s/);
  if (secMatch) {
    return parseInt(secMatch[1]) / 60;
  }
  return parseFloat(timeStr) || 0;
}
