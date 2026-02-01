# TechSoi Bangladesh - Web Frontend

## 🚀 Quick Start

1. Open terminal in `web-front` folder
2. Run: `python3 -m http.server 8080`
3. Open: http://localhost:8080

---

## � Optimized File Structure

```
web-front/
├── index.html                    # Main page (don't edit for data)
├── css/
│   └── styles.css                # Styling
├── js/
│   └── app.js                    # Logic with pagination
├── data/
│   ├── proposals-index.json      # ✅ Lightweight list (for home page)
│   ├── issues-index.json         # ✅ Lightweight list (for home page)
│   ├── proposals/                # Individual proposal files
│   │   ├── my-proposal-id.json   # Full details (loaded on click)
│   │   └── ...
│   └── issues/                   # Individual issue files
│       ├── my-issue-id.json      # Full details (loaded on click)
│       └── ...
├── pages/
│   ├── proposal-detail.html
│   └── issue-detail.html
└── assets/
    └── images/
```

### Why This Structure?

| File | Size | When Loaded |
|------|------|-------------|
| `proposals-index.json` | ~2-5 KB | Home page load (fast!) |
| `proposals/xyz.json` | ~2 KB each | Only when clicking item |

**Result:** Home page loads in <100ms even with 1000+ items!

---

## 📝 Adding New Data

### Step 1: Add to Index File (for home page listing)

Edit `data/proposals-index.json`:

```json
{
  "totalCount": 5,
  "perPage": 12,
  "proposals": [
    // ... existing items ...
    {
      "id": "my-new-proposal",
      "title": "My New Proposal Title",
      "category": "Healthcare",
      "status": "New",
      "summary": "Brief 1-2 sentence description for the card."
    }
  ]
}
```

### Step 2: Create Detail File

Create `data/proposals/my-new-proposal.json`:

```json
{
  "id": "my-new-proposal",
  "title": "My New Proposal Title",
  "category": "Healthcare",
  "status": "New",
  "author": "Your Name",
  "summary": "Brief description.",
  "problemStatement": "Detailed problem explanation...",
  "proposedSolution": "Your proposed solution...",
  "technicalArchitecture": [
    "Technology 1",
    "Technology 2"
  ],
  "implementationPhases": [
    {
      "phase": "Phase 1",
      "description": "Description",
      "timeline": "3 months"
    }
  ],
  "budgetEstimate": "৳XX crore",
  "expectedImpact": [
    "Impact 1",
    "Impact 2"
  ],
  "teamRequirements": [
    "Role 1 (count)"
  ],
  "risks": [
    {
      "risk": "Risk description",
      "mitigation": "How to handle"
    }
  ],
  "createdAt": "2026-02-01",
  "updatedAt": "2026-02-01"
}
```

### Adding an Issue

Same pattern:
1. Add minimal info to `data/issues-index.json`
2. Create `data/issues/my-issue-id.json` with full details

---

## 📊 Available Categories & Status

### Categories
**Proposals:** Governance, Healthcare, Education, Transportation, Agriculture, Finance, Environment, Technology

**Issues:** Corruption, Healthcare, Education, Infrastructure, Environment, Economy, Social

### Status Options
| Status | Badge Color |
|--------|-------------|
| `New` / `Open` | Purple |
| `Pending` | Yellow |
| `Under Review` | Blue |
| `Active` / `In Progress` | Green |

---

## ⚠️ Important Notes

1. **ID must match filename:** If `id` is `my-proposal`, file must be `my-proposal.json`
2. **Update totalCount:** When adding items, update `totalCount` in index file
3. **Validate JSON:** Use https://jsonlint.com/ to check for errors

---

## 🌐 Deployment

Static site - deploy anywhere:
- GitHub Pages (free)
- Netlify (free)
- Vercel (free)

Just upload the entire `web-front` folder.
