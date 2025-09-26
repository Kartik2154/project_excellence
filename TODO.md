# TODO: Remove Project Table Code and Use Group Table API

## Backend Changes

- [x] Remove backend/controllers/projectController.js
- [x] Remove backend/routes/projectRoutes.js
- [x] Update backend/index.js: Remove import and use of projectRoutes

## Frontend Changes

- [x] Update frontend/src/services/api.js: Remove projectAPI export
- [ ] Update frontend/src/pages/admin/ProjectManagement.jsx:
  - Change state from 'projects' to 'groups'
  - Replace projectAPI.update/delete with groupAPI.update/delete
  - Update edit modal fields: name="title" -> name="projectTitle", etc., remove groupId select
  - Update display logic: use group.projectTitle, group.projectDescription, etc.
  - Change page titles to "Manage Group Projects"
  - Update filters and mappings (e.g., technology -> projectTechnology)
  - Remove unused [groups] state

## Testing

- [ ] Run backend to ensure no errors
- [ ] Test frontend ProjectManagement page: load groups, edit, delete
