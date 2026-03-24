# MEMORY.md — SOFRS-EA Overall System

## Project Overview
- **System:** Smart Office Face Recognition System for Employee Access (SOFRS-EA)
- **Location:** `/Volumes/Personal-Projects/SOFRS-EA-Frontend/`
- **Components:** Contains multiple clients (Desktop, Mobile) and the Backend system.

## Folder Structure
- **Backend (`Backend/SOFRS-EA-Backend`)**: Python backend handling data and facial recognition using DeepFace.
- **Desktop (`Desktop/employee-access`)**: Electron and Vite application for employee access management on desktop.
- **Mobile (`Mobile/employee-access`)**: Expo/React Native application for the mobile frontend (onboarding, face setup, badge).

## Active Tasks
### Completed
- Initial folder structure setup.
- Basic implementation of Mobile app (6 screens, context, camera scan).

### Next Steps
- Implement frontend facial tracking (bounding box detection).
- Integrate Desktop/Mobile with Backend via API endpoints.
- Continue development as outlined in sub-project documentation.

## Architecture Decisions
- Monorepo-style structure containing the different clients and the backend.
- Face matching relies on the backend, while client apps capture and detect faces.
