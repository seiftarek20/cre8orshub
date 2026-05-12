# Cre8ors Hub – Codex Instructions

## Project Context
This is a React + Vite website for Cre8ors Hub, a premium educational platform for creative courses.

Stack:
- React + Vite
- React Router
- Custom CSS
- Vercel deployment
- Dark luxury design

Brand style:
- Black / charcoal backgrounds
- Gold accent
- Premium cinematic feel
- Smooth but lightweight animations
- Clean UI, not crowded
- Avoid bulky elements, big circles, or noisy UI

## Main Goal
Always improve the website without breaking the existing project.

Before editing:
- Inspect the current file structure.
- Reuse existing components when possible.
- Do not rewrite the whole project.
- Do not break routing.
- Do not remove existing sections unless explicitly requested.
- Keep performance good.

## Important Pages
- Home
- Courses
- Course Details
- Booking
- Roadmap
- Student Work

## Current Features
- Course cards from `src/data/courses.js`
- Reviews from `reviews.xlsx`
- Student work section
- Roadmap page with vertical reel and steps
- Creative Path Quiz
- Learning Modes
- What You’ll Create
- Is This For You
- Instructor Section
- Tools Wall
- Mini Projects
- Vertical timeline section navigation

## File Guidance
Common places to check:
- Course data: `src/data/courses.js`
- Pages: `src/pages/`
- Components: `src/components/`
- Global CSS: `src/index.css`
- App routing: `src/App.jsx`
- Assets: prefer `public/images/` for course images

## Image Path Rule
For course images, prefer:
`public/images/image-name.jpg`

Use paths like:
`/images/image-name.jpg`

Avoid:
`src/assets/image.png`
unless using proper imports.

## UI Rules
When improving cards:
- Keep card sizes consistent.
- Recommended course card size: around 320–360px wide.
- Image area should be fixed height, around 190–210px.
- Use `object-fit: cover`.
- Keep spacing clean.
- Buttons should be elegant and not too large.
- Hover effects should be subtle.

## Deployment Workflow
After changes, remind me to run:

```bash
npm run build
git add .
git commit -m "update website"
git push