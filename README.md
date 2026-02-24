# GPAPro

A simple **offline‑first** SGPA/CGPA calculator built with Expo Router. This version is a clean implementation that **does not require any login or authentication**; all data is stored locally on the device. A future backup/sync feature may be added later, but access is always unrestricted.

## Features

1. Pick a university (first launch only)
2. Choose the appropriate grading system automatically
3. Enter subjects with credit hours and grades
4. Compute semester GPA (SGPA)
5. Save semesters locally using `AsyncStorage`
6. CGPA is updated automatically as you add semesters
7. Entire state is held under one key (`@future_data`)


## Project layout

```
app/
 ├── index.tsx               # root redirect logic
 ├── university-select.tsx   # first‑time screen
 ├── dashboard.tsx           # shows CGPA & semester list
 ├── sgpa.tsx                # add subjects and calculate SGPA
 └── _layout.tsx             # minimal navigation layout

src/
 ├── data/
 │     universities.ts       # list of colleges + grading type
 └── utils/
       gradingTables.ts      # two grading maps
       calculations.ts       # SGPA/CGPA helpers
       storage.ts            # AsyncStorage wrapper
```

## Running the app

```bash
npm install                # install dependencies
npx expo start             # launch Metro/dev server
```

Open on device/emulator via the Expo CLI instructions.

## Next steps

- Implement optional cloud backup/export
- Add nicer grade/subject pickers
- Improve styling and theming

Feel free to read the source in `app/` and `src/` to see how the offline logic works.
