# Section Guide

All 6 sections with narrative steps, data sources, interactive elements, and data files.

---

## Data Files Summary

| File                            | Section | Source                                         |
| ------------------------------- | ------- | ---------------------------------------------- |
| `src/data/prevalence.json`      | 1       | CDC NHANES 2001–2023                           |
| `src/data/youth-incidence.json` | 2       | SEARCH Study (PMC10091237)                     |
| `src/data/screening-rates.json` | 3       | CDC PCD 2023 (23_0173)                         |
| `src/data/complications.json`   | 5       | Diabetologia meta-analysis (S0168822722010087) |

Sections 4 and 6 are prescriptive/guidance — they use illustrations and interactives rather than raw data.

---

## Section 1: What Is Diabetes?

**Role:** The hook. Sets visual language and tone.

**Components:** `GlucoseAnimation.tsx`, `DiagnosisCounter.tsx`, `PrevalenceChart.tsx`

### Narrative Steps

1. Opening — full viewport. "Your body runs on glucose. It's the fuel that keeps every cell alive." Animated glucose molecule assembles.
2. "But for millions of people, that fuel system is broken." Molecule starts glitching/fragmenting.
3. "Diabetes mellitus — a condition where blood glucose levels stay dangerously high because insulin isn't doing its job." Simple diagram: glucose locked out of cell.
4. "Without glucose entering cells, the body starts burning fat for fuel instead — producing acidic ketone bodies." Visual shows ketone buildup.
5. "If untreated, this leads to diabetic ketoacidosis — which can cause coma or death." Visual turns red/danger.
6. "Diabetes is the 7th leading cause of death in the US." Counter/ranking viz.
7. "Adult cases have more than doubled since 2001." Prevalence line chart animates in, using CDC data.
8. "Since you started reading, approximately X people were diagnosed with diabetes." Live counter.

### Data Visualization

**D3 line chart:** Total diabetes prevalence 2001–2023 (diagnosed, undiagnosed, total). Stacked area or multi-line. Animate line drawing on scroll entry.

**Live counter:** Calculate based on CDC annual diagnosis rate (~1.2M new cases/year ≈ ~2.3 per minute). Start counting from when the user enters Section 1.

### Data File: `src/data/prevalence.json`

```json
{
  "source": "CDC National Diabetes Statistics Report, NHANES 2001-2023",
  "url": "https://gis.cdc.gov/grasp/diabetes/diabetesatlas-statsreport.html",
  "metric": "Age-adjusted prevalence (%) among adults 18+, United States",
  "data": [
    {
      "period": "2001-2004",
      "diagnosed": 7.1,
      "undiagnosed": 4.1,
      "total": 11.2
    },
    {
      "period": "2003-2006",
      "diagnosed": 7.4,
      "undiagnosed": 3.8,
      "total": 11.2
    },
    {
      "period": "2005-2008",
      "diagnosed": 7.6,
      "undiagnosed": 4.2,
      "total": 11.8
    },
    {
      "period": "2007-2010",
      "diagnosed": 7.9,
      "undiagnosed": 4.4,
      "total": 12.3
    },
    {
      "period": "2009-2012",
      "diagnosed": 8.1,
      "undiagnosed": 4.0,
      "total": 12.1
    },
    {
      "period": "2011-2014",
      "diagnosed": 8.7,
      "undiagnosed": 3.7,
      "total": 12.4
    },
    {
      "period": "2013-2016",
      "diagnosed": 9.4,
      "undiagnosed": 4.1,
      "total": 13.5
    },
    {
      "period": "2015-2018",
      "diagnosed": 9.8,
      "undiagnosed": 4.3,
      "total": 14.1
    },
    {
      "period": "2017-2020",
      "diagnosed": 10.1,
      "undiagnosed": 4.0,
      "total": 14.1
    },
    {
      "period": "2021-2023",
      "diagnosed": 9.8,
      "undiagnosed": 3.7,
      "total": 13.5
    }
  ]
}
```

---

## Section 2: Type I vs. Type II Diabetes

**Role:** The "aha" moment — visualizing the massive ratio difference and rising youth incidence.

**Components:** `PopulationSplit.tsx`, `TypeComparison.tsx`, `YouthIncidence.tsx`

### Section 2 Narrative Steps

1. "Not all diabetes is the same. There are two main types — and they work very differently."
2. "Type 1 is an autoimmune disease. Your immune system attacks the insulin-producing beta cells in your pancreas." Visual: immune cells attacking pancreas.
3. "It usually begins in childhood or early adult years. Peak age of diagnosis: 10 years old for T1D." Visual shows age distribution.
4. "Type 1 accounts for only 5–10% of all cases. But these patients need insulin injections for life." Population viz: 5–10 figures highlight out of 100.
5. "Type 2 is different. Your cells become resistant to insulin — they stop responding to it." Visual: insulin bouncing off cell receptor.
6. "It accounts for 90–95% of all diabetes cases." Population viz: remaining 90–95 figures highlight.
7. "Eventually, the insulin-producing cells get exhausted." Visual: tired/depleted pancreas.
8. "Both types are rising in youth. T1D incidence increased 2% annually, T2D by 5.3% annually among 10–19 year olds." Youth incidence chart.
9. "The increases are highest among racial and ethnic minority youth — Asian/Pacific Islander, Hispanic, and non-Hispanic Black children." Demographic breakdown.
10. "There's also prediabetes — blood glucose higher than normal but not yet diabetes. It's a warning sign that heart disease and other complications can already begin." Third group fades in on population viz.

### Data Visualizations

**Waffle/population chart:** 100 human figures. On step 4: 5–10 highlight in one color (Type 1). On step 6: remaining 90–95 highlight in another (Type 2). On step 10: a separate overlay or counter for prediabetes prevalence.

**Youth incidence chart:** Bar or slope chart showing T1D +2.02%/year vs T2D +5.31%/year. Optionally broken down by racial/ethnic group.

### Key Data Points (from SEARCH study)

- T1D annual incidence increase: 2.02% among 0–19 year olds
- T2D annual incidence increase: 5.31% among 10–19 year olds
- T1D peak diagnosis age: 10 overall (girls: 10, boys: 12)
- T2D peak diagnosis age: 16 overall (non-Hispanic Black youth: 13)
- T1D seasonal peak: January (winter — linked to vitamin D, viral infections)
- T2D seasonal peak: August (back-to-school physicals detecting asymptomatic cases)
- Youth obesity rose from 13.9% (1999) to 18.5% (2016), parallel to T2D rise
- Highest incidence increases: Asian/Pacific Islander, Hispanic, non-Hispanic Black youth
- Contrast: adult diabetes incidence _declined_ 3.1%/year (2007–2017) while youth incidence _rose_
- T2D diagnostic accuracy improved: 73% meeting gold standard in 2002 → 84% in 2016

### Data File: `src/data/youth-incidence.json`

```json
{
  "source": "SEARCH for Diabetes in Youth Study",
  "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10091237/",
  "findings": {
    "t1d_annual_increase_pct": 2.02,
    "t1d_population": "0-19 year olds",
    "t2d_annual_increase_pct": 5.31,
    "t2d_population": "10-19 year olds",
    "study_duration_years": 17,
    "peak_diagnosis_age": {
      "t1d_overall": 10,
      "t1d_girls": 10,
      "t1d_boys": 12,
      "t1d_hispanic_asian_pi": 9,
      "t1d_other_groups": "10-11",
      "t2d_overall": 16,
      "t2d_non_hispanic_black": 13
    },
    "seasonal_patterns": {
      "t1d_peak_month": "January",
      "t1d_explanation": "Winter peak linked to vitamin D fluctuation and viral infections",
      "t2d_peak_month": "August",
      "t2d_explanation": "Back-to-school physical exams detecting asymptomatic hyperglycemia"
    },
    "racial_ethnic_disparities": {
      "highest_increase_groups": [
        "Asian/Pacific Islander",
        "Hispanic",
        "Non-Hispanic Black"
      ],
      "comparison": "Annual percent increases for T1D and T2D were higher among racial and ethnic minority youth than non-Hispanic White youth"
    },
    "adult_contrast": {
      "adult_incidence_change": -3.1,
      "adult_period": "2007-2017",
      "note": "Adult incidence declining while youth incidence rising — diverging trends"
    },
    "obesity_parallel": {
      "youth_obesity_1999_pct": 13.9,
      "youth_obesity_2016_pct": 18.5,
      "highest_obesity_groups": "Non-Hispanic Black and Hispanic youth"
    },
    "diagnostic_accuracy": {
      "t2d_gold_standard_2002_pct": 73,
      "t2d_gold_standard_2016_pct": 84
    }
  }
}
```

---

## Section 3: How Diabetes Develops

**Role:** Make it personal. Show the physiological process and the screening gap.

**Components:** `DayInTheLife.tsx`, `RiskFactorViz.tsx`, `ScreeningGap.tsx`

### Section 3 Narrative Steps

1. "Let's follow what happens in your body when you eat a meal heavy in added sugar." Visual: food entering digestive system.
2. "Sugar hits your bloodstream. Your pancreas releases insulin to help cells absorb glucose." Visual: insulin + glucose animation.
3. "In a healthy body, this works smoothly. Glucose enters cells, blood sugar normalizes." Visual: smooth process.
4. "But when you regularly eat too much sugar, are physically inactive, or carry excess weight — cells start ignoring insulin." Visual: cells rejecting insulin, process breaking down.
5. "Obesity and overweight are strong risk factors. US overweight prevalence: 31.1%. Obesity: 42.5%." Stats appear.
6. "People 45 and older, or those with risk factors, should be tested regularly." Age/risk callout.
7. "But testing rates are low. Only about 33% of eligible adults received proper blood glucose testing within 3 years." Screening gap visualization.
8. "Even with broader test definitions, at least 1 in 4 adults with overweight or obesity went untested." Visual emphasis.
9. "The USPSTF has been expanding screening guidelines — lowering the recommended starting age from 40 to 35 in 2021." Timeline of guideline changes.
10. "Adults aware of having prediabetes were more than twice as likely to pursue lifestyle changes. Screening saves lives." Hopeful closing visual.

### Section 3 Data Visualizations

**Physiological animation:** Illustrated (not data-driven). Step-by-step: food → bloodstream → insulin released → glucose enters cells (healthy) → glucose blocked (insulin resistance).

**Screening gap:** Bar chart or icon-based viz showing 33.4% strict vs 74.3% broad testing rate. "1 in 4 untested" callout.

**USPSTF timeline:** Simple horizontal timeline with 3 milestones (2008, 2015, 2021).

### Key Data Points (from CDC PCD 2023)

- Prediabetes and diabetes prevalence continues to grow in the US
- Most people with prediabetes are unaware they have it
- Strict blood glucose testing rate (3-year window, 2016–2019): 33.4%
- Broad testing rate (including random plasma glucose): 74.3%
- Even with broad definition: at least 1 in 4 overweight/obese adults went untested
- Higher testing rates among people with obesity vs overweight (providers more aware of obesity-diabetes link)
- Men had 19% higher odds of being screened than women
- Black patients had higher screening rates than White patients (strict definition)
- Adults aware of prediabetes were 2x+ as likely to pursue evidence-based lifestyle goals
- Without intervention, prediabetes → diabetes sooner, longer exposure to dysglycemia, more complications
- US overweight prevalence: 31.1%; obesity prevalence: 42.5% (2017–2018 NHANES)
- ADA recommends screening every 3 years for adults 45+ and overweight adults under 45 with additional risk factors (including race/ethnicity: African American, Asian American, Latino, Native American, Pacific Islander)

### USPSTF Screening Guideline Timeline

- **2008:** Recommended screening adults with sustained blood pressure >135/80 mmHg
- **2015:** Recommended screening adults aged 40–70 with overweight or obesity
- **2021:** Lowered recommended starting age to 35 for adults with overweight or obesity

### Data File: `src/data/screening-rates.json`

```json
{
  "source": "CDC Preventing Chronic Disease, 2023",
  "url": "https://www.cdc.gov/pcd/issues/2023/23_0173.htm",
  "findings": {
    "strict_testing_rate_3yr_pct": 33.4,
    "broad_testing_rate_3yr_pct": 74.3,
    "study_period": "2016-2019",
    "untested_overweight_obese": "At least 1 in 4 adults with overweight or obesity went untested in 3 years",
    "obesity_vs_overweight_testing": "Higher testing rates among people with obesity than overweight",
    "gender_disparity": "Men had 19% higher odds of screening than women",
    "racial_disparity": "Black patients had higher screening rates than White patients (strict definition)",
    "awareness_effect": "Adults aware of prediabetes were 2x+ as likely to pursue lifestyle goals",
    "us_overweight_prevalence_pct": 31.1,
    "us_obesity_prevalence_pct": 42.5,
    "prevalence_data_source": "2017-2018 NHANES",
    "uspstf_timeline": [
      {
        "year": 2008,
        "recommendation": "Screen adults with sustained blood pressure >135/80 mmHg"
      },
      {
        "year": 2015,
        "recommendation": "Screen adults aged 40-70 with overweight or obesity"
      },
      {
        "year": 2021,
        "recommendation": "Lowered starting age to 35 for adults with overweight or obesity"
      }
    ],
    "ada_recommendation": "Screen all adults 45+ every 3 years; overweight adults under 45 with additional risk factors (African American, Asian American, Latino, Native American, Pacific Islander)"
  }
}
```

---

## Section 4: Treatments for Diabetes

**Role:** Empowering, actionable. Make dietary advice tangible.

**Components:** `PlateBuilder.tsx`, `FiberMeter.tsx`, `TreatmentTimeline.tsx`

### Section 4 Narrative Steps

1. "The central goal of diabetes management is blood glucose control. Everything revolves around this."
2. "And the most powerful tool? Your plate." Plate visual appears empty.
3. "A well-balanced diet includes high-fiber carbs from whole grains, fruits, and vegetables." Items animate onto plate.
4. "Low-fat milk for calcium. Lean proteins like chicken, fish, and legumes." More items appear.
5. "Unsaturated fats — olive oil, nuts, avocado." Plate fills out.
6. "Why fiber matters: it slows digestion and glucose absorption, preventing blood sugar spikes." Animation: two glucose curves — with fiber (smooth) vs without (spiky).
7. "Physical exercise is just as important — it helps cells use insulin more effectively."
8. "Depending on the type and progression, insulin injections or medication may be required." Treatment spectrum visual: lifestyle → medication → insulin.

### Interactive Element

**Plate builder:** User drags food items onto a plate. A live meter shows fiber content and estimated glycemic impact. Categories: whole grains, fruits, vegetables, lean proteins, dairy, fats. Needs keyboard alternative (select menu or arrow key navigation).

### No Data File Needed

This section is prescriptive. The food items and their nutritional properties can be hard-coded in the component or in a small inline config.

---

## Section 5: Risks and Prevention

**Role:** Visceral impact. Show what's at stake, then offer hope.

**Components:** `BodyDiagram.tsx`, `GlucoseSlider.tsx`, `AmputationStats.tsx`

### Section 5 Narrative Steps

1. "High blood glucose doesn't just make you feel bad. Over time, it destroys your body." Body diagram appears, neutral.
2. "Nerve damage and numbness — especially in extremities." Nerves/hands/feet highlight on body.
3. "Poor circulation leading to infections, and in severe cases, amputation." Legs highlight + amputation stats appear.
4. "Globally, there are about 95 major and 140 minor diabetes-related amputations per 100,000 patients annually. Men are disproportionately affected — roughly 2x the rate of women." Stats overlay.
5. "Eye damage and blindness." Eyes highlight on body.
6. "Tooth and gum problems." Mouth highlights.
7. "Kidney damage — diabetes is the leading cause of kidney failure." Kidneys highlight.
8. "Increased risk of heart disease." Heart highlights.
9. "And diabetic ketoacidosis — when it all spirals out of control." Full body danger state (all organs red).
10. "Low blood sugar is dangerous too. Below 70 mg/dL: hunger, shakiness, dizziness. It can cause fainting or coma." Glucose slider interactive appears.
11. "But type 2 diabetes is preventable. Lose excess weight. Exercise more. Limit sugary drinks. Eat a heart-healthy, plant-based diet." Body diagram transitions from red/danger to green/healthy.

### Section 5 Data Visualizations

**Body diagram:** SVG with individually selectable organ `<path>` elements. Each organ highlights on its corresponding scroll step. Must be an SVG file — not a raster image. Needs `aria-label` per organ.

**Glucose range slider:** Interactive `<input type="range">` styled to show zones:

- Normal fasting: 70–99 mg/dL (green)
- Prediabetic: 100–125 mg/dL (orange)
- Diabetic: 126+ mg/dL (red)
- Hypoglycemia danger: below 70 mg/dL (red, with symptoms listed)

**Amputation statistics:** Could be a simple annotated bar chart or icon-based comparison (men vs women rates).

### Key Data Points (from Diabetologia meta-analysis)

- 23 studies included, reporting 505,390 diabetes-related lower extremity amputations (2010–2020)
- Minor amputation rate: 139.97 per 100,000 (T1D: 148.59, T2D: 75.53)
- Major amputation rate: 94.82 per 100,000 (T1D: 100.76, T2D: 40.58)
- Women: 83.84 annual amputations per 100,000
- Men: 178.04 annual amputations per 100,000
- Men face roughly 2x the amputation rate of women
- Amputations disproportionately affect men and individuals with type 1 diabetes
- Incidence is not uniform across countries

### Glucose Ranges

- **Normal fasting:** 70–99 mg/dL
- **Prediabetic:** 100–125 mg/dL
- **Diabetic:** 126+ mg/dL
- **Hypoglycemia (dangerous):** below 70 mg/dL — symptoms: hunger, shakiness, dizziness, fainting, coma

### Data File: `src/data/complications.json`

```json
{
  "source": "Diabetologia meta-analysis of diabetes-related amputations, 2010-2020",
  "url": "https://www.sciencedirect.com/science/article/pii/S0168822722010087",
  "amputation_data": {
    "total_studies": 23,
    "total_amputations_reported": 505390,
    "period": "2010-2020",
    "minor_amputation_rate_per_100k": {
      "overall": 139.97,
      "t1d": 148.59,
      "t2d": 75.53
    },
    "major_amputation_rate_per_100k": {
      "overall": 94.82,
      "t1d": 100.76,
      "t2d": 40.58
    },
    "by_gender_per_100k": {
      "women": 83.84,
      "men": 178.04
    },
    "gender_disparity": "Men face roughly 2x the amputation rate of women",
    "type_disparity": "Type 1 diabetes patients have higher amputation rates than Type 2"
  },
  "complications_list": [
    {
      "organ": "nerves",
      "label": "Nerve damage & numbness",
      "detail": "Neuropathy, especially in hands and feet",
      "svg_target": "nerves-path"
    },
    {
      "organ": "legs",
      "label": "Poor circulation & amputation",
      "detail": "Infections, foot ulcers, lower extremity amputation",
      "svg_target": "legs-path"
    },
    {
      "organ": "eyes",
      "label": "Eye damage & blindness",
      "detail": "Diabetic retinopathy",
      "svg_target": "eyes-path"
    },
    {
      "organ": "mouth",
      "label": "Tooth & gum disease",
      "detail": "Periodontal disease, tooth loss",
      "svg_target": "mouth-path"
    },
    {
      "organ": "kidneys",
      "label": "Kidney damage",
      "detail": "Diabetic nephropathy — leading cause of kidney failure",
      "svg_target": "kidneys-path"
    },
    {
      "organ": "heart",
      "label": "Heart disease",
      "detail": "Increased cardiovascular disease risk",
      "svg_target": "heart-path"
    }
  ],
  "glucose_ranges_mg_dl": {
    "normal_fasting": { "min": 70, "max": 99, "color": "success" },
    "prediabetic": { "min": 100, "max": 125, "color": "orange" },
    "diabetic": { "min": 126, "max": 300, "color": "danger" },
    "hypoglycemia": {
      "below": 70,
      "color": "danger",
      "symptoms": ["hunger", "shakiness", "dizziness", "fainting", "coma"]
    }
  }
}
```

---

## Section 6: Suggestions for Living with Diabetes

**Role:** Closing. Practical, empowering, forward-looking.

**Components:** `DailyTimeline.tsx`, `ClosingCTA.tsx`

### Section 6 Narrative Steps

1. "Living with diabetes isn't about deprivation — it's about balance."
2. "Eat regularly to balance the effects of insulin or medication and avoid hypoglycemia." Timeline shows regular meal spacing.
3. "Focus on high-fiber carbs, lean proteins, unsaturated fats, and low-fat milk." Visual callback to plate from Section 4.
4. "Stay physically active — it's one of the most effective tools for glucose control."
5. "Monitor blood glucose consistently. Control is the central goal." Timeline shows monitoring checkpoints.
6. "You now know more about diabetes than most people. Share what you've learned." Closing CTA.

### Section 6 Interactive Element

**24-hour timeline:** Shows a day with meal, exercise, medication, and glucose monitoring events plotted across 24 hours. A glucose curve runs along the timeline showing how blood sugar responds to each event.

Interactive scenarios: clicking "skip breakfast" or "miss medication" shows the glucose curve destabilizing. Clicking "add a walk after lunch" shows it smoothing out. This makes the cause-and-effect tangible.

### Section 6 No Data File Needed

This section uses illustrative/simulated glucose curves, not research data.
