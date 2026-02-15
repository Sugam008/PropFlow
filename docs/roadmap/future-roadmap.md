# Future Roadmap Preparation

Feature ideas and preparation notes for PropFlow Phase 2+.

---

## 1. AI Preliminary Valuation

### Description

Automated property valuation using ML models trained on comparable sales data.

### Technical Requirements

- **Data**: Historical sales data with property features
- **Model**: Gradient boosting (XGBoost/LightGBM) or neural network
- **Features**: Area, location, bedrooms, age, floor, amenities
- **Output**: Estimated value with confidence interval

### Readiness Assessment

| Component       | Status         | Notes                           |
| --------------- | -------------- | ------------------------------- |
| Data Collection | 🟡 Partial     | Need more historical sales data |
| Model Training  | 🔴 Not Started | Requires 1000+ samples minimum  |
| API Integration | 🟢 Ready       | Valuation endpoint exists       |
| Validation      | 🔴 Not Started | Need A/B testing framework      |

### Next Steps

1. Collect 2+ years of sales data
2. Build feature engineering pipeline
3. Train baseline model
4. Validate against expert valuations
5. Deploy as "Preliminary Estimate" feature

---

## 2. OCR Document Upload

### Description

Allow users to upload property documents (tax receipts, society papers) via camera.

### Technical Requirements

- **OCR**: Google Cloud Vision or AWS Textract
- **Parsing**: Extract key fields (owner name, property ID, dimensions)
- **Validation**: Cross-reference with property details

### Feature Ideas

- Upload tax receipts
- Upload society sale agreements
- Upload building approval documents
- Automatic data extraction

---

## 3. Voice Input for Notes

### Description

Allow valuers to add voice notes during property review.

### Technical Requirements

- **Speech-to-Text**: Whisper API or browser SpeechRecognition
- **Storage**: Save as text, optionally audio
- **Search**: Index voice notes for queries

### Use Cases

- Quick notes during review
- Dictate property observations
- Record special circumstances

---

## 4. Property Registry Integration

### Description

Integrate with government property registration APIs for verification.

### Potential Integrations

- **Bihar Bhumi**: Land records
- **Karnataka**: Bhoomi RTR
- **Maharashtra**: Mahabhulekh

### Technical Requirements

- API access agreements
- Data mapping/standardization
- Consent management
- Real-time verification

---

## 5. Dark Mode

### Description

Add dark theme option to both customer app and dashboard.

### Implementation

```typescript
// Theme configuration
const darkTheme = {
  colors: {
    background: '#121212',
    surface: '#1E1E1E',
    primary: '#BB86FC',
    // ...
  },
};
```

### Timeline

- Design tokens update: 2 days
- Customer app: 3 days
- Dashboard: 2 days
- Testing: 1 day

---

## 6. Multi-Language Support

### Languages Priority

1. **Hindi** - Most common regional language
2. **Kannada** - Karnataka focus
3. **Marathi** - Maharashtra focus
4. **Tamil** - Tamil Nadu focus
5. **Telugu** - Andhra/Telangana

### Technical Requirements

- i18n framework (react-i18next)
- Translation files
- RTL support consideration
- Date/number formatting

### Timeline

- Framework setup: 1 day
- Core translations: 3 days
- All screens: 5 days
- Testing: 2 days

---

## 7. Push Notifications

### Description

Replace SMS with push notifications for cost savings.

### Technical Requirements

- Expo Notifications / FCM
- Notification preferences per user
- Rich notifications with actions
- Notification history

### Cost Comparison

| Channel | Cost per 1000 |
| ------- | ------------- |
| SMS     | ₹0.30-0.50    |
| Push    | ₹0.01-0.02    |

---

## 8. Payment Integration

### Description

Add payment for premium valuation services.

### Technical Requirements

- Razorpay or Stripe integration
- Payment history
- Receipt generation
- Refund handling

---

## 9. Portfolio View

### Description

Allow users to track multiple properties.

### Features

- Property list/dashboard
- Historical valuations
- Value trends
- Portfolio analytics

---

## 10. WhatsApp Business API

### Description

Replace WhatsApp template messages with interactive WhatsApp.

### Features

- Two-way conversations
- Rich cards
- Quick replies
- Chat history

---

## Prioritization Matrix

| Feature            | Impact | Effort | Priority |
| ------------------ | ------ | ------ | -------- |
| Push Notifications | High   | Low    | 1        |
| Dark Mode          | Medium | Medium | 2        |
| AI Valuation       | High   | High   | 3        |
| Hindi Support      | High   | Medium | 4        |
| Portfolio View     | Medium | Medium | 5        |
| OCR Documents      | Medium | Medium | 6        |
| Voice Notes        | Low    | Low    | 7        |

---

## Technical Debt

### Backlog

1. Refactor image QC to use async processing
2. Add database indexes for common queries
3. Implement caching layer for comparables
4. Upgrade to FastAPI 0.110+
5. Migrate from Redis to ElastiCache

---

## Q3 Roadmap Draft

### July - September

1. **Push Notifications** (Week 1-2)
2. **Dark Mode** (Week 3-4)
3. **Hindi Language** (Week 5-6)
4. **AI Valuation Beta** (Week 7-8)

---

## Notes

- All new features require user research and validation
- Priority can shift based on business goals
- Technical feasibility should be reassessed before development
