# Temple of TRANCE Knowledge Base

## The Problem

Why this app exists

37M+

70%

$327B

96M+

Americans with diabetes

Never receive structured coaching

Annual US diabetes

Adults with prediabetes

cost

## Our solution: a fully-integrated, personalized health coaching platform

- Patients manage diabetes and obesity in fragmented silos — no unified coaching hub

- Clinical data lives in separate systems with no feedback loop to the patient

- Lifestyle tools (fitness, nutrition, journaling) are disconnected from medical records

- Senior populations lack accessible, Medicare-integrated wellness programs


## What Is Temple of TRANCE?

A web-based health coaching application that unifies clinical data, lifestyle tracking, AI assistance, and community engagement for people managing obesity and prediabetes/diabetes.

## Health Tracking

- BMI & weight history

- Blood pressure monitoring

- Blood glucose logging

- Plotly trend charts

## AI & Clinical Sync

- Dialogflow chat widget

- PIRDDIIQ triage API

- CRITICAL/ELEVATED alerts

- GPT clinical summaries

## Wellness Programs

- Silver Sneakers (Medicare)

- Chicago bike trails

- Wellness video library

- Nutrition guidance

## Engagement

- Discord D&D; gamification

- XP & leveling (1–20)

- Daily/weekly quests

- Community leaderboard


## System Architecture

| Layer | Technology | Role |
| --- | --- | --- |
| Frontend | Streamlit (Python) | Multi-page UI, charts, session state |
| Database | PostgreSQL 16 | Persistent health records, auth, gamification |
| Data Viz | Plotly / Pandas | Interactive BMI, glucose, BP trend charts |
| AI Chat | Google Dialogflow | makeDEEPHumanChat floating widget |
| Clinical Sync | PIRDDIIQ REST API | Bidirectional patient data & triage |
| Webhooks | Flask (port 8080) | Inbound PIRDDIIQ triage push receiver |
| Gamification | Discord Bot (discord.py) | D&D; health quests, slash commands |
| Deployment | Replit Autoscale | Always-on, port 5000 |


## PIRDDIIQ Control Tower Integration

## Bidirectional clinical data sync

PIRDDIIQ is an external Virtual Medical Office that serves as the authoritative source for patient diabetes data, AI triage, and metabolic risk scoring.

## TRANCE PIRDDIIQ (Outbound Calls)

| Endpoint | Triggered When |
| --- | --- |
| GET /api/v1/health | On-demand connection check |
| GET /api/v1/patient/ | Patient Snapshot tab — pulls glucose, A1C, risk score, food |
|   | resource |
| POST /api/v1/patient//readings | After every BMI save and every glucose log entry |
| POST /api/v1/triage | AI Triage tab — GPT analysis, returns |
|   | CRITICAL/ELEVATED/NORMAL |
| GET /api/v1/triage-summary | Population Summary tab — coach ranked patient list |

## PIRDDIIQ TRANCE (Inbound Webhooks, port 8080)

| Endpoint | Purpose |
| --- | --- |
| POST /api/pirddiiq/triage-update | PIRDDIIQ pushes AI triage results; stored & shown in sidebar |
| badge |   |
| GET /api/pirddiiq/patient/ | PIRDDIIQ pulls coaching data — weight, glucose, journal count |


## AI Triage — CRITICAL / ELEVATED / NORMAL

Every triage run sends clinical metrics to PIRDDIIQ's GPT engine and returns a real-time risk assessment.

## Inputs submitted to PIRDDIIQ AI Triage:

- K989 Glycation Velocity — Rate of glycation end-product accumulation

- Shear Coefficient (0–1) — Vascular stress indicator

- Nutritional ROI (0–1) — Diet quality score

- Average Glucose (mg/dL) — 30-day rolling average from glucose log

- A1C (%) — Glycated haemoglobin percentage

- ZIP Code — Used to locate nearest fresh-produce pantry

## On CRITICAL alert:

- Full AI clinical summary (3–4 sentences) surfaced prominently

- Nearest community food pantry / fresh-produce resource displayed

- Prompt to schedule a follow-up appointment

- Persistent red alert badge visible in the sidebar on every page


## Core Feature Set

| Feature | Details |
| --- | --- |
| BMI Tracker | Imperial units, historical chart, goal-setting, auto-push to PIRDDIIQ on |
| save |   |
| Blood Pressure Monitor | Systolic/diastolic log, time-of-day tagging, Plotly trend chart |
| Glucose Log | Morning/afternoon/evening/bedtime readings, 30-day avg, chart, |
| PIRDDIIQ sync |   |
| Diabetes Journal | Daily reflection prompts, complication tracking, emotional state, |
|   | weekly/monthly questions |
| Nutrition Guide | Low-GI food lists, meal planner, foods to include/limit/avoid for |
| prediabetes |   |
| Silver Sneakers | Medicare Advantage integration, senior exercise plans, eligibility checker, |
| location finder |   |
| Chicago Bike Trails | 478 miles of trails, calorie calculator, seasonal tips, safety guidelines |
| Video Library | MP4/MP3/WAV upload & streaming, category management, personalised |
| recommendations |   |
| Google Fit Sync | OAuth2 connection, activity data import, steps and calorie integration |
| makeDEEPHumanChat | Dialogflow Messenger floating widget, always-visible on every page |
| Discord DnD Bot | 6 character stats, 1–20 leveling, quests, /stats /log /quests /leaderboard |


## Discord D&D; Health Gamification

## DOVIC Simulation House DnD Game Server

Health habits are mapped to D&D; character stats, turning daily wellness activities into an RPG progression system your Discord community can compete in together.

| CON Constitution | Exercise consistency |
| --- | --- |
| STR Strength | Weight-loss progress |
| DEX Dexterity | Flexibility & activity |
| WIS Wisdom | Journal & reflection |
| CHA Charisma | Community engagement |
| INT Intelligence | Nutrition knowledge |

| /stats | View your character sheet |
| --- | --- |
| /log | Log a health activity for XP |
|   | See daily/weekly/monthly |
| /quests | quests |
|   | Community health |
| /leaderboard | champion rankings |
|   | Link Discord to TRANCE |
| /link | account |
|   | Show all available |
| /help | commands |

Level 1 20 progression · XP log · achievement badges · persistent PostgreSQL storage


## Database Schema Overview

| Table | Purpose |
| --- | --- |
| users | Accounts, profile, health conditions, goals |
| weight_records | BMI & weight history per user |
| blood_pressure_records | Systolic/diastolic + time-of-day log |
| glucose_readings | Blood glucose with time-of-day tagging |
| user_goals | Active weight / health goals with target dates |
| meal_plans | Weekly meal planner by day & meal type |
| chat_messages | Dialogflow AI chat history |
| symptom_logs | Symptom type, severity, triggers |
| wellness_videos | Video library metadata & file paths |
| diabetes_journal_entries | Daily reflection, complications, emotional state |
| diabetes_goals | Diabetes-specific goal tracking |
| Discord discord_users | TRANCE account linking |
| character_stats | D&D; stat scores per user |
| quest_progress | Daily/weekly/monthly quest completion |
| achievements | Unlocked achievement badges |
| xp_log | XP earn history for leveling |
| silver_sneakers_activities | Senior fitness activity log |
| pirddiiq_triage_results | Inbound triage pushes from PIRDDIIQ |

*18 tables · PostgreSQL 16 · psycopg2-binary · RealDictCursor*


## Deployment & Infrastructure

| Item | Details |
| --- | --- |
| Platform | Replit Autoscale (always-on) |
| Runtime | Python 3.11 + NixOS stable-24_05 |
| Main App | Streamlit — port 5000, webview output |
| Webhook Server | Flask — port 8080, console output |
| Database | Replit PostgreSQL 16 (DATABASE_URL secret) |
| Secrets | DATABASE_URL, DIALOGFLOW_PROJECT_ID, FIREBASE_*, |
|   | GOOGLE_FIT_CREDENTIALS, PIRDDIIQ_API_KEY, |
|   | PIRDDIIQ_BASE_URL, DISCORD_BOT_TOKEN, SENDGRID_API_KEY |
| Nix packages | cairo, ffmpeg, freetype, ghostscript, gtk3, qhull, tcl, tk |
| Key packages | streamlit, plotly, pandas, numpy, psycopg2-binary, flask, reportlab, |
|   | discord.py, google-cloud-dialogflow, firebase-admin, anthropic |

Deployment URL auto-configured · Two concurrent workflows · Stateless design enables horizontal scaling


## What's Next — Roadmap

## Short-term

- Connect live PIRDDIIQ_BASE_URL and test end-to-end clinical triage loop

- Add DISCORD_BOT_TOKEN and go live with the DnD Health Bot on DOVIC server

- Enable Firebase real-time sync for cross-device session persistence

- Add push notifications for CRITICAL triage alerts (email / Discord DM)

## Medium-term

- Telehealth appointment scheduling directly from CRITICAL alert UI

- Continuous glucose monitor (CGM) data import via FHIR/HL7 API

- Meal photo analysis with AI calorie / glycemic load estimation

- Expanded Silver Sneakers — class booking & attendance tracking

## Longer-term

- HIPAA-compliant data handling audit and BAA with cloud provider

- Mobile companion app (React Native) synced to same PostgreSQL backend

- Population health analytics dashboard for coaches and care teams

- Marketplace for certified diabetes educators to offer group sessions


## Temple of TRANCE Health Fitness App

Transformation · Recovery · Accountability Nutrition · Coaching ·

Empowerment

"Your health journey, clinically connected, community powered, and

AI-guided."

Built on Replit · Powered by Python & PostgreSQL

© 2026 Temple of TRANCE Health Fitness App
