# Compliance System Testing Guide

This guide explains how to test the background compliance checking functionality.

## 🧪 Running the Test Suite

### Local Testing (Development)

```bash
# Start the development server
npm run dev

# In another terminal, run the compliance tests
npm run test:compliance
```

### Production Testing

```bash
# Test against the live Vercel deployment
npm run test:compliance:prod
```

## 🔍 What Gets Tested

### 1. Website Compliance Checks

- **Valid websites**: google.com, microsoft.com, apple.com
- **Invalid websites**: nonexistent domains, malformed URLs
- **Checks**: Website scraping, metadata extraction, risk scoring

### 2. AI Business Categorization

- **Test businesses**: Restaurant, Tech company, Construction, Crypto (high-risk)
- **Checks**: Category classification, confidence scores, high-risk detection

### 3. Adverse Media Monitoring

- **Test entities**: Microsoft (low risk), ABC Small Business (low risk), Enron (high risk)
- **Checks**: News article search, sentiment analysis, risk scoring

### 4. Database Integration

- **Compliance results retrieval**: Check if data is properly saved
- **Data persistence**: Verify compliance checks are stored for review

## 📊 Manual Testing

### Test Individual APIs Directly

**Website Compliance:**

```bash
curl -X POST http://localhost:3009/api/test-compliance \
  -H "Content-Type: application/json" \
  -d '{"type": "website", "websiteUrl": "google.com", "businessName": "Google Inc"}'
```

**AI Categorization:**

```bash
curl -X POST http://localhost:3009/api/test-compliance \
  -H "Content-Type: application/json" \
  -d '{"type": "categorization", "businessName": "ABC Restaurant"}'
```

**Adverse Media:**

```bash
curl -X POST http://localhost:3009/api/test-compliance \
  -H "Content-Type: application/json" \
  -d '{"type": "adverse-media", "businessName": "Microsoft"}'
```

**Get All Results:**

```bash
curl http://localhost:3009/api/test-compliance
```

## 🎯 User Flow Testing

### Step-by-Step Application Flow

1. **Start Application**: Go to `/step/1`
2. **Complete Steps 1-3**: Basic info and business search
3. **Step 4 (if manual entry)**: ✅ **AI Categorization triggers**
4. **Complete Steps 5-6**: Sales and loan info
5. **Step 7**: ✅ **Adverse Media Check triggers**
6. **Complete Steps 8-9**: Funding info
7. **Step 10**: Enter website URL → ✅ **Website Compliance Check triggers**
8. **Complete Steps 11-14**: Finish application

### Browser Console Monitoring

Open browser DevTools and watch for:

- POST requests to `/api/compliance/*` endpoints
- Debug logs showing step completion and triggers
- Any error messages in console

## 🔧 Environment Variables Required

For full functionality, ensure these are set in Vercel:

```bash
NEWSAPI_KEY=your_newsapi_key
OPENAI_API_KEY=your_openai_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
```

## 📈 Expected Results

### Successful Test Output Example:

```
🧪 Compliance System Test Suite
================================

🔧 Testing Environment Configuration...
✅ Environment variables appear to be configured

🌐 Testing Website Compliance Checks...
Testing: google.com
✅ Success: Risk score 0.1
   Title: Google
   Emails found: 0
   Social media: 4 platforms

🤖 Testing AI Business Categorization...
Testing: ABC Restaurant
✅ Success: Food and Beverage (confidence: 0.95)
   Summary: ABC Restaurant is a food service business...

📰 Testing Adverse Media Checks...
Testing: Microsoft
✅ Success: 5 articles found
   Overall sentiment: 0.2 (low risk)

📊 Testing Compliance Results Retrieval...
✅ Found 12 compliance checks in database

🎉 Test suite completed!
```

## 🚨 Troubleshooting

### Common Issues:

1. **Environment Variables Missing**
   - Error: "API key not configured"
   - Solution: Check Vercel environment variables

2. **Database Connection Issues**
   - Error: "Supabase not configured"
   - Solution: Verify SUPABASE_SERVICE_ROLE_KEY

3. **API Rate Limits**
   - Error: "Rate limit exceeded"
   - Solution: Wait and retry, or check API usage

4. **Network Timeouts**
   - Error: "Request timeout"
   - Solution: Check internet connection and API availability

## 📝 Test Results Analysis

### Website Compliance:

- **Low Risk (0.0-0.3)**: Professional website with contact info
- **Medium Risk (0.3-0.7)**: Missing some business information
- **High Risk (0.7-1.0)**: Poor website quality or inaccessible

### AI Categorization:

- **Confidence > 0.8**: High confidence classification
- **High-risk similarity > 0.5**: Potential regulatory concern
- **Categories**: Standard business vs. high-risk industries

### Adverse Media:

- **Low Risk**: Minimal negative news coverage
- **Medium Risk**: Some adverse mentions
- **High Risk**: Significant negative coverage or scandals

The compliance system provides early warning indicators for business applications before final submission.
