# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React frontend application for "QuizAI" — an evaluation/quiz system. The app provides authentication with role-based access (Docente/estudiante) and different dashboards for teachers and students.

## Common Commands

```bash
npm install          # Install dependencies
npm start            # Run development server on http://localhost:3000
npm test             # Run tests in watch mode
npm run build        # Build for production
```

## Architecture

The app uses React Router v7 for navigation with the following route structure:

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Redirect | Redirects to `/login` |
| `/login` | `Login` | Login page with email/password and role selection |
| `/teacher/dashboard` | `TeacherDashboard` | Teacher dashboard with quiz list |
| `/teacher/quiz/:id` | `QuizDetail` | Quiz detail with question editing |
| `/teacher/create` | `CreateQuiz` | Create new quiz form |
| `/student/dashboard` | — | Not yet implemented |

**Entry point**: `src/index.js` → `src/App.js`

**Page structure**: `src/pages/{role}/{PageName}.jsx`

**Dependencies**:
- `react` & `react-dom` (^19.2.6)
- `react-router-dom` (^7.15.0) — routing
- `axios` (^1.16.0) — HTTP client (ready for API integration)

## Key Files

### Routes (src/App.js)
- `/` → Redirect to `/login`
- `/login` → Login page
- `/teacher/dashboard` → Teacher dashboard
- `/teacher/quiz/:id` → Quiz detail view
- `/teacher/create` → Create quiz form

### Pages (src/pages/)
- `src/pages/auth/Login.jsx` — Login form with role selection (Docente/Estudiante)
- `src/pages/teacher/TeacherDashboard.jsx` — Teacher dashboard with quiz list, search, and sidebar
- `src/pages/teacher/QuizDetail.jsx` — Quiz detail with question editing (add/edit/delete)
- `src/pages/teacher/CreateQuiz.jsx` — Create quiz form with file upload

### Styles
- `src/index.css` — Global styles (dark theme)
- Each page imports its own CSS (e.g., `Login.css`, `TeacherDashboard.css`)

## Current State

- **Login**: Functional mock login with role selection
- **Teacher Dashboard**: Displays quiz list with search, sidebar with collapse toggle, dropdown actions
- **Quiz Detail**: View/edit questions, add new questions, save changes
- **Create Quiz**: Form with file upload, quiz settings (tipo, dificultad, grado, longitud)
- **Student Dashboard**: Not yet implemented (route exists but no component)

## Known Gaps

- Student dashboard component not implemented
- CSS files may need to be created for each page component
- No actual API integration (all data is hardcoded)
- No authentication (mock login only)
- Quiz data lost on page refresh (uses location.state)

## Development Notes

- All pages use a common layout with collapsible sidebar
- Dark theme applied globally in `index.css`
- Uses `react-router-dom` v7 hooks: `useNavigate`, `useLocation`, `useParams`
- Form validation uses basic required field checks


## Backend API Routes                                                                                       
                                                                                                            
      77 +The frontend integrates with a FastAPI backend. API base URL: `/api/quiz` (configurable)                    
      78 +                                                                                                            
      79 +| Endpoint | Method | Description |                                                                         
      80 +|----------|--------|-------------|                                                                         
      81 +| `/obtener_quiz/{quiz_id}` | GET | Get quiz by ID |                                                        
      82 +| `/code/{access_code}` | GET | Get quiz by access code |                                                   
      83 +| `/creator/{creator_id}` | GET | List all quizzes by creator |                                             
      84 +| `/actualizar_quiz/{quiz_id}` | PUT | Update quiz |                                                        
      85 +| `/eliminar_quiz/{quiz_id}` | DELETE | Delete (deactivate) quiz |                                          
      86 +| `/question/agregar_pregunta` | POST | Add question to quiz |                                              
      87 +| `/question/actualizar_pregunta/{question_id}` | PUT | Update question |                                   
      88 +| `/question/eliminar_pregunta/{question_id}` | DELETE | Delete question |                                  
      89 +| `/search/{title}?creator_id=` | GET | Search quiz by title |                                              
      90 +                                                                                                            
      91  ## Development Notes