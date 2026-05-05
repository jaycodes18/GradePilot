# GradePilot

GPA-focused study planner for students: optimize study hours toward your target GPA, track grades over time, block your day, and manage tasks — with a responsive dashboard and local persistence (demo-friendly, no backend required).

## Stack

| Concern    | Choice                                   |
| ---------- | ---------------------------------------- |
| Framework  | Next.js 15 (App Router) + React 19       |
| Styling    | Tailwind CSS                             |
| Motion     | Framer Motion                            |
| Charts     | Recharts (GPA history)                   |
| Auth / data | Client-side sessions + `localStorage` |

## Run

```bash
npm install
npm run dev       # http://localhost:3000
npm run build
npm run typecheck
```

## Features

- **Planner** — Course inputs, exam weights, study availability; prioritized plan and calendar-style view with export helpers.
- **GPA tracker** — Classes, credits, snapshots, trend chart.
- **Schedule** — Hourly time blocks for the day.
- **To-do** — Priorities, categories, due dates, search and filters.

## License

Private / hackathon use — adjust as needed.
