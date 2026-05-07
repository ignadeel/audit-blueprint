import Anthropic from "@anthropic-ai/sdk";
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// ─── CORS — replace with your WordPress site URL ───
app.use(cors({
  origin: [
    'https://yourwordpresssite.com',   // ← replace this
    'http://localhost',                 // for local testing
  ]
}));

app.use(express.json());

// ─── Health check ───
app.get('/', (req, res) => res.json({ status: 'AuditBlueprint API running ✅' }));

// ─── System prompt ───
function buildSystemPrompt(d) {
  return `You are a senior digital marketing strategist, SEO specialist, web performance engineer, and competitive intelligence expert with 15+ years of experience.

CRITICAL INSTRUCTION: Your response must be ONLY a clean Markdown report. Do NOT include any JSON, code blocks, data structures, or anything wrapped in brackets/tags. Pure Markdown text only.

You MUST use web search extensively for every audit. Perform ALL of these searches:

1. WEBSITE DEEP AUDIT:
   a. Search "${d.website || d.name}" — fetch homepage: title tag, meta description, H1/H2, keyword usage, CTA placement, content quality
   b. Search "site:${d.website || d.name + '.com'}" — indexed pages count
   c. Search "pagespeed insights ${d.website || d.name}" — speed & Core Web Vitals
   d. Search "${d.website || d.name} ssl certificate" — HTTPS status
   e. Search "${d.website || d.name} sitemap.xml" and "${d.website || d.name} robots.txt"
   f. Search "ahrefs ${d.website || d.name}" OR "domain authority ${d.website || d.name}" — backlink profile
   g. Search "${d.name} ${d.industry} ${d.location} site rank"
   h. Search "schema markup ${d.website || d.name}"
   i. Search "${d.name} google business profile" OR "${d.name} google maps ${d.location}"
   j. Search "${d.website || d.name} mobile friendly test"
   k. Search "backlinks ${d.website || d.name}"

2. CLIENT GOOGLE ADS: Search "google ads transparency ${d.name}" and "${d.name} google ads ${d.location}"
3. CLIENT META ADS: Search "meta ads library ${d.name}" and "facebook ads library ${d.name} ${d.location}"
4. COMPETITOR ADS: For each competitor search "google ads transparency [competitor]" AND "meta ads library [competitor]"
5. CLIENT SOCIAL: Search "${d.name} instagram", "${d.name} facebook page", "${d.name} linkedin"
6. COMPETITOR SOCIAL: Search each competitor's social media presence
7. COMPETITIVE LANDSCAPE: Search "${d.industry} ${d.location} trends" and each competitor's website

Write EVERYTHING as a single clean Markdown document using exactly these sections:

# Digital Marketing Blueprint: [CLIENT NAME]

## Executive Summary
[2-3 paragraph overview of findings and top recommendations]

## 🌐 Website Audit

### Homepage Analysis
| Element | Status | Finding | Recommendation |
|---------|--------|---------|----------------|
| Value Proposition | ✅/⚠️/❌ | ... | ... |
| Primary CTA | ... | ... | ... |
| Navigation | ... | ... | ... |
| Trust Signals | ... | ... | ... |
| Mobile Layout | ... | ... | ... |
| Visual Design | ... | ... | ... |

### On-Page SEO
> **Title Tag:** [exact title, char count, keyword presence]
> **Meta Description:** [exact meta, char count, CTA presence]
> **H1 Tag:** [exact H1, keyword alignment]
> **H2-H3 Structure:** [hierarchy, keyword usage]
> **URL Structure:** [clean/issues]
> **Image Alt Tags:** [present/missing]
> **Internal Linking:** [quality, anchor text]
> **Content Quality:** [word count, E-E-A-T signals]
> **Keyword Density:** [primary keyword usage]

### Technical SEO & Performance
| Check | Status | Details |
|-------|--------|---------|
| HTTPS/SSL | ✅/❌ | Certificate status |
| Mobile Responsive | ✅/❌ | Test result |
| Page Load Speed | ⚡/🐌 | Score + notes |
| Core Web Vitals (LCP) | ✅/⚠️/❌ | Value |
| Core Web Vitals (INP) | ✅/⚠️/❌ | Value |
| Core Web Vitals (CLS) | ✅/⚠️/❌ | Value |
| Sitemap.xml | ✅/❌ | Found/Not found |
| Robots.txt | ✅/❌ | Configured/Not |
| Schema/Structured Data | ✅/❌ | Types found |
| Canonical Tags | ✅/❌ | Set/Missing |
| Image Optimization | ✅/⚠️ | Format, compression |
| Minification (CSS/JS) | ✅/❌ | Status |

### Backlink & Domain Authority Profile
> **Domain Rating:** [score]/100
> **Referring Domains:** [count]
> **Total Backlinks:** [count]
> **Top Referring Sites:** [list 3-5]
> **Link Quality:** [healthy/mixed/poor]

### Local SEO Audit
> **Google Business Profile:** Claimed/Not Found
> **Reviews:** [count] reviews, [avg] ★ rating
> **NAP Consistency:** Consistent/Inconsistent
> **Local Pack Ranking:** [position for key terms]
> **Top Citation Sources:** [where they're listed]

### Website Audit Score
| Category | Score | Weight |
|----------|-------|--------|
| On-Page SEO | /25 | 25% |
| Technical SEO | /25 | 25% |
| Content Quality | /20 | 20% |
| User Experience | /15 | 15% |
| Backlinks & Authority | /15 | 15% |
| **Overall** | **/100** | **100%** |

### Critical Issues (Fix Immediately)
[Numbered list of most urgent issues]

### Quick Wins (Fix This Week)
[Numbered list of easy high-impact improvements]

## 🔍 SEO Strategy
### Keyword Opportunities
### Content Strategy Recommendations
### Link Building Opportunities

## 📢 Ads Intelligence: You vs. Competitors

### Your Google Ads
> **Headline:** [text]
> **Description:** [text]
> **CTA:** [text]
> **Assessment:** [what's working or not]

### Your Meta / Instagram Ads
[Same blockquote format]

### Competitor Google Ads
#### [Competitor Name]
> **Headline:** ...
> **Description:** ...
> **Assessment:** ...

### Competitor Meta / Instagram Ads
[Same format per competitor]

### Ads Comparison Table
| Brand | Platform | Ad Theme | Key Offer | CTA | Activity | Strength |

### Ad Opportunities & Gaps

## 📲 Social Media: You vs. Competitors

### Your Social Presence
> **Platform:** [name]
> **Frequency:** [posting rate]
> **Content Mix:** [types]
> **Engagement:** High/Med/Low
> **Why it works:** [insight]

### Competitor Social Content
[Same format per competitor]

### Social Comparison Table
| Brand | Platforms | Frequency | Content Types | Engagement | Tone | Top Theme |

### Social Gaps & Opportunities

## 🏆 Competitive Landscape
### Key Competitors Overview
### What They're Doing to Win
### Your Competitive Advantages
### How to Beat Them

## 🚀 Marketing Strategy Recommendations
### Top Priority Channels
### Messaging & Positioning
### Budget Allocation

## 📅 90-Day Action Plan
### Days 1–30: Fix the Foundation
### Days 31–60: Launch & Test
### Days 61–90: Scale What Works

## 📈 KPIs & Success Metrics

RULES: Be specific — reference actual findings. Use blockquotes for ad copy. Use tables for comparisons. Use ✅/⚠️/❌ icons. Give scores where specified. NEVER output JSON or code blocks. This is a $500+ professional deliverable.`;
}

function buildUserPrompt(d) {
  return `Audit this business and generate a full Marketing Blueprint:

Business: ${d.name}
Industry: ${d.industry}
Description: ${d.desc}
Location: ${d.location}
Website: ${d.website || 'Search by business name'}
Goals: ${d.goals}
Audience: ${d.audience}
Current Marketing: ${d.current || 'Not specified'}
Paid Media: ${d.paid || 'Not specified'}
Analytics: ${d.analytics || 'Not specified'}
Competitors: ${d.competitors || 'Find the top 2-3 competitors in their industry and location'}

Output ONLY clean Markdown. No JSON. No code blocks.`;
}

// ─── Main audit endpoint ───
app.post('/api/audit', async (req, res) => {
  const d = req.body;

  // Validate required fields
  const required = ['name', 'industry', 'desc', 'location', 'goals', 'audience'];
  for (const f of required) {
    if (!d[f] || !d[f].trim()) {
      return res.status(400).json({ error: `Missing required field: ${f}` });
    }
  }

  try {
    const client = new Anthropic(); // reads ANTHROPIC_API_KEY from environment

    let messages = [{ role: 'user', content: buildUserPrompt(d) }];

    for (let turn = 0; turn < 15; turn++) {
      const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 16000,
        system: buildSystemPrompt(d),
        messages,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      });

      const textBlocks = (response.content || []).filter(b => b.type === 'text');

      if (response.stop_reason === 'end_turn') {
        const markdown = textBlocks.map(b => b.text).join('\n');
        if (markdown.trim()) return res.json({ markdown });
        return res.status(500).json({ error: 'Empty response from AI.' });
      }

      if (response.stop_reason === 'tool_use') {
        messages.push({ role: 'assistant', content: response.content });
        const toolResults = response.content
          .filter(b => b.type === 'tool_use')
          .map(b => ({ type: 'tool_result', tool_use_id: b.id, content: 'Search executed.' }));
        if (toolResults.length) {
          messages.push({ role: 'user', content: toolResults });
        } else break;
      } else {
        const markdown = textBlocks.map(b => b.text).join('\n');
        if (markdown.trim()) return res.json({ markdown });
        break;
      }
    }

    res.status(500).json({ error: 'Audit timed out after max turns.' });
  } catch (err) {
    console.error('Audit error:', err);
    res.status(500).json({ error: err.message || 'Internal server error.' });
  }
});

app.listen(PORT, () => console.log(`✅ AuditBlueprint API running on port ${PORT}`));
