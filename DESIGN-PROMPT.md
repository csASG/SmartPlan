# SmartPlan Design Prompt

Kopiere diesen Prompt und nutze ihn in deinem Design-Tool (Figma AI, v0.dev, Cursor, etc.):

---

## Prompt

Design a **school timetable management web app** called **SmartPlan**. It is a dark-themed admin dashboard for managing school schedules, teachers, students, rooms, substitutions, and attendance.

### Design System

- **Theme**: Dark mode only. Background is deep dark blue-gray (`oklch(14% 0.01 250)`). Cards/surfaces are slightly lighter (`oklch(18% 0.015 250)`). Text is near-white (`oklch(98% 0.005 250)`).
- **Accent**: Warm orange-red (`oklch(55% 0.15 25)`) for primary actions, active states, and highlights.
- **Muted**: Gray (`oklch(60% 0.02 250)`) for secondary text and labels.
- **Borders**: Subtle dark borders (`oklch(25% 0.02 250)`).
- **Font**: Monospace for labels, data, and UI text. Sans-serif for headings only.
- **Style**: Clean, minimal, tech-utility aesthetic. No rounded cards (use `rounded-lg` or `rounded-xl` only). Sharp, professional look inspired by developer tools.

### Layout

- **Sidebar** (240px fixed, left): Logo at top, navigation grouped into sections (General, Management, System). Active item has a left accent border. User profile with avatar at bottom.
- **Topbar** (64px, sticky): Page title + subtitle on left, action buttons on right. Slightly transparent with blur backdrop.
- **Main content**: Scrollable area below topbar with padding.

### Pages to Design

1. **Login Page**: Centered card on dark background with subtle dot grid pattern and radial gradient glow. Email + password fields, "Sign In" button (accent color), demo account buttons at bottom (ADMIN, TEACHER, STUDENT).

2. **Dashboard**: 4 stat cards in a row (Teachers: 12, Students: 280, Classes: 10, Rooms: 15). Below: recent activity list with colored status dots and timestamps.

3. **Timetable**: Weekly grid view (5 columns for days, 10 rows for periods). Each cell can contain a lesson card with colored left border, subject name, teacher, and room. "Generate Schedule" button in topbar.

4. **Resources (Teachers/Students/Rooms/Classes)**: Data table with columns. "Add [Resource]" button in topbar. Each row has an edit action.

5. **Substitutions**: Stats cards (Today: 3, This Week: 4, Pending: 1). Below: list of substitution entries with date, time, class badge, subject, teacher swap (original → substitute), room, and optional note badge.

6. **Settings**: Form sections for General (school name, year) and Solver Configuration (max solve time, periods per day). Simple input fields on dark background.

7. **Logs**: Monospace event log with timestamp, colored level badge (INFO=green, WARN=yellow, ERROR=red), service name, and message.

### Key Components

- **Stat Card**: Rounded-xl, surface background, border, muted label (uppercase mono), large bold value, subtle change text.
- **Lesson Card**: Left color border (4px), rounded-lg, hover scale effect. Shows subject (bold), teacher (mono), room (mono).
- **Class Badge**: Small rounded pill with accent background and accent text color.
- **Sidebar Nav Item**: Flex row with icon + label. Active: left 2px accent border, surface background, foreground text. Inactive: muted text, hover surface.
- **Data Table**: Full width, xs font, mono headers (uppercase, muted), rows with bottom border, hover background change.
- **Topbar**: Sticky, blur backdrop, flex between title area and action area.

### Navigation Structure

```
General
  - Dashboard (house icon)
  - Timetable (grid icon)
  - Teachers (chalkboard icon)
  - Students (student icon)

Management
  - Rooms (door icon)
  - Classes (users icon)
  - Substitutions (lightning icon)

System
  - Settings (gear icon)
  - Logs (terminal icon)
```

### Color Coding for Subjects

- Mathematik: Blue (#3b82f6)
- Deutsch: Green (#10b981)
- Physik: Purple (#8b5cf6)
- Englisch: Yellow (#f59e0b)
- Informatik: Red (#ef4444)
- Sport: Cyan (#06b6d4)
- Geschichte: Pink (#ec4899)
- Chemie: Lime (#84cc16)
- Kunst: Orange (#f97316)

### Icons

Use Phosphor Icons (weight: duotone) for all navigation and UI icons.
