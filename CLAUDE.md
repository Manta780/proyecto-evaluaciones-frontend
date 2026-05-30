# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"QuizAI" — A React-based quiz/evaluation system with role-based access (Docente/Estudiante) and Firebase authentication.

## Common Commands

```bash
npm install          # Install dependencies
npm start            # Run development server on http://localhost:3000
npm test             # Run tests in watch mode
npm run build        # Build for production
```

## Architecture

React Router v7 handles navigation. The app uses a `ProtectedRoute` component to enforce role-based access.

### Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Landing` | Public landing page |
| `/login` | `Login` | Login with Firebase Auth |
| `/register` | `Register` | Registration page |
| `/plans` | `Plans` | Subscription plans |
| `/teacher/dashboard` | `TeacherDashboard` | Teacher quiz list |
| `/teacher/quiz/:id` | `QuizDetail` | Question editor |
| `/teacher/quiz/:id/dashboard` | `QuizDashboard` | Quiz results/stats |
| `/teacher/create` | `CreateQuiz` | New quiz form |
| `/student/dashboard` | placeholder | Student view (not implemented) |

### Directory Structure

```
src/
├── App.js                    # Main router setup
├── index.js                  # Entry point
├── index.css                 # Global dark theme
├── components/
│   └── ProtectedRoute.jsx     # Role-based route guard
├── hooks/
│   └── useAuth.js            # Auth state hook (localStorage + Firebase token)
├── services/
│   ├── api.js                # Axios HTTP client (ready for API)
│   └── firebase.js           # Firebase config
└── pages/
    └── {role}/
        └── {PageName}.jsx    # Route components + CSS
```

### Authentication Flow

1. User logs in via Firebase Auth (Email/Password)
2. Firebase token stored in `localStorage.firebaseToken`
3. User profile stored in `localStorage.userProfile`
4. `useAuth` hook checks localStorage on mount to restore session
5. `ProtectedRoute` checks `user.role` against `requiredRole`

## Dependencies

- `react` / `react-dom` (^19.2.6)
- `react-router-dom` (^7.15.0)
- `axios` (^1.16.0) — for API calls
- `firebase` (^12.13.0) — authentication

## Current State

- **Auth**: Firebase Auth with Register/Login pages, subscription plans page
- **Teacher Dashboard**: Quiz list with search, sidebar, dropdown actions
- **Quiz Detail**: Question CRUD (add/edit/delete)
- **Create Quiz**: Form with file upload, settings (tipo, dificultad, grado, longitud)
- **Quiz Dashboard**: Results/stats view for a quiz
- **Student Dashboard**: Placeholder only

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