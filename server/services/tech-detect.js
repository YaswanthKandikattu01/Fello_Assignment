import axios from 'axios';
import * as cheerio from 'cheerio';

const TECH_SIGNATURES = {
  'Salesforce': ['salesforce', 'sfdc', 'pardot', 'force.com'],
  'HubSpot': ['hubspot', 'hs-scripts', 'hbspt', 'hs-analytics'],
  'Marketo': ['marketo', 'munchkin', 'mkto'],
  'WordPress': ['wp-content', 'wp-includes', 'wordpress'],
  'Shopify': ['shopify', 'cdn.shopify'],
  'React': ['react', 'reactDOM', '__NEXT_DATA__', '_next'],
  'Next.js': ['__NEXT_DATA__', '_next/static', 'next/dist'],
  'Vue.js': ['vue', '__vue__', 'vuejs'],
  'Angular': ['ng-', 'angular', 'ng-version'],
  'Google Analytics': ['google-analytics', 'gtag', 'ga.js', 'analytics.js', 'googletagmanager'],
  'Google Tag Manager': ['googletagmanager', 'gtm.js'],
  'Segment': ['segment', 'analytics.min.js', 'cdn.segment'],
  'Mixpanel': ['mixpanel'],
  'Hotjar': ['hotjar', 'static.hotjar'],
  'Intercom': ['intercom', 'widget.intercom'],
  'Drift': ['drift', 'driftt'],
  'Zendesk': ['zendesk', 'zdassets', 'zopim'],
  'Stripe': ['stripe', 'js.stripe'],
  'Cloudflare': ['cloudflare', 'cdnjs.cloudflare'],
  'AWS': ['amazonaws', 'aws-sdk'],
  'Twilio': ['twilio'],
  'SendGrid': ['sendgrid'],
  'Mailchimp': ['mailchimp', 'chimpstatic'],
  'Optimizely': ['optimizely'],
  'LaunchDarkly': ['launchdarkly'],
  'Datadog': ['datadoghq', 'datadog'],
  'Sentry': ['sentry', 'sentry.io'],
  'Amplitude': ['amplitude'],
  'FullStory': ['fullstory'],
  'Heap': ['heap', 'heapanalytics'],
  'Clearbit': ['clearbit'],
  'LinkedIn Insight': ['snap.licdn', 'linkedin'],
  'Facebook Pixel': ['facebook', 'fbevents', 'connect.facebook'],
  'Bootstrap': ['bootstrap'],
  'Tailwind CSS': ['tailwind'],
  'jQuery': ['jquery']
};

const TECH_CATEGORIES = {
  'Salesforce': 'CRM',
  'HubSpot': 'Marketing Automation / CRM',
  'Marketo': 'Marketing Automation',
  'WordPress': 'CMS',
  'Shopify': 'E-Commerce Platform',
  'React': 'Frontend Framework',
  'Next.js': 'Full-Stack Framework',
  'Vue.js': 'Frontend Framework',
  'Angular': 'Frontend Framework',
  'Google Analytics': 'Analytics',
  'Google Tag Manager': 'Tag Management',
  'Segment': 'Customer Data Platform',
  'Mixpanel': 'Product Analytics',
  'Hotjar': 'Behavior Analytics',
  'Intercom': 'Customer Messaging',
  'Drift': 'Conversational Marketing',
  'Zendesk': 'Customer Support',
  'Stripe': 'Payment Processing',
  'Cloudflare': 'CDN / Security',
  'AWS': 'Cloud Infrastructure',
  'Twilio': 'Communications API',
  'SendGrid': 'Email Delivery',
  'Mailchimp': 'Email Marketing',
  'Optimizely': 'A/B Testing',
  'LaunchDarkly': 'Feature Flags',
  'Datadog': 'Monitoring',
  'Sentry': 'Error Tracking',
  'Amplitude': 'Product Analytics',
  'FullStory': 'Session Replay',
  'Heap': 'Product Analytics',
  'Clearbit': 'Data Enrichment',
  'LinkedIn Insight': 'Ad Analytics',
  'Facebook Pixel': 'Ad Analytics',
  'Bootstrap': 'CSS Framework',
  'Tailwind CSS': 'CSS Framework',
  'jQuery': 'JavaScript Library'
};

export async function detectTechStack(domain) {
  if (!domain) return { detected: [], error: 'No domain provided' };

  const url = domain.startsWith('http') ? domain : `https://${domain}`;

  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      maxRedirects: 5,
      validateStatus: (status) => status < 500
    });

    const html = response.data;
    const $ = cheerio.load(html);
    const detected = [];

    const fullText = html.toLowerCase();
    const scripts = [];
    $('script[src]').each((_, el) => {
      scripts.push($(el).attr('src')?.toLowerCase() || '');
    });
    const links = [];
    $('link[href]').each((_, el) => {
      links.push($(el).attr('href')?.toLowerCase() || '');
    });
    const metas = [];
    $('meta').each((_, el) => {
      metas.push(($(el).attr('content') || '').toLowerCase());
      metas.push(($(el).attr('name') || '').toLowerCase());
    });

    const allText = [fullText, ...scripts, ...links, ...metas].join(' ');

    for (const [tech, signatures] of Object.entries(TECH_SIGNATURES)) {
      const found = signatures.some(sig => allText.includes(sig.toLowerCase()));
      if (found) {
        detected.push({
          name: tech,
          category: TECH_CATEGORIES[tech] || 'Other',
          confidence: 'High'
        });
      }
    }

    const headers = response.headers;
    if (headers['x-powered-by']) {
      const powered = headers['x-powered-by'];
      if (powered.toLowerCase().includes('express')) detected.push({ name: 'Express.js', category: 'Backend Framework', confidence: 'High' });
      if (powered.toLowerCase().includes('php')) detected.push({ name: 'PHP', category: 'Backend Language', confidence: 'High' });
      if (powered.toLowerCase().includes('asp.net')) detected.push({ name: 'ASP.NET', category: 'Backend Framework', confidence: 'High' });
    }
    if (headers.server) {
      const server = headers.server.toLowerCase();
      if (server.includes('nginx')) detected.push({ name: 'Nginx', category: 'Web Server', confidence: 'High' });
      if (server.includes('apache')) detected.push({ name: 'Apache', category: 'Web Server', confidence: 'High' });
      if (server.includes('cloudflare')) {
        if (!detected.find(d => d.name === 'Cloudflare')) {
          detected.push({ name: 'Cloudflare', category: 'CDN / Security', confidence: 'High' });
        }
      }
    }

    const uniqueDetected = detected.filter((item, index, self) =>
      index === self.findIndex(t => t.name === item.name)
    );

    return {
      detected: uniqueDetected,
      scannedUrl: url,
      totalFound: uniqueDetected.length
    };
  } catch (error) {
    return {
      detected: [],
      scannedUrl: url,
      error: `Could not scan website: ${error.message}`,
      totalFound: 0
    };
  }
}
