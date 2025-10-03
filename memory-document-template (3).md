# iHasco Dev Docker - Memory Document

*Living documentation of project decisions, lessons learned, and organizational knowledge*  
*Last Updated: 2025-10-03*  
*References: [Link to project specification or related docs]*

## 🏢 Project Information

**Project Name:** iHasco Dev Docker Environment  
**Description:** Complete Docker development environment for iHasco learning management system including Application, APIs, worker services, and supporting infrastructure (Nginx, MySQL, Redis, Elasticsearch)  
**Team:** Development Team  
**Start Date:** [Project start date]  
**Current Phase:** Development - Active maintenance and improvements  
**Repository:** https://github.com/ihasco/dev_docker  
**Live Demo:** https://app.ihasco.local (local development environment)  

## 📋 Decision Log

### Local Base Image Creation for Application Service
**Date:** 2025-09-26  
**Description:** Created local Docker base images to avoid ECR authentication issues during development  
**Rationale:** Original setup required AWS ECR authentication for base images, causing build failures for developers without proper AWS credentials. Local base images eliminate this dependency.  
**Status:** Implemented  
**Impact:** High - Enables developers to build locally without AWS ECR access  
**Stakeholders:** All developers working on the Application service  
**Implementation:** Created `/home/dev/ihasco/Application/.docker/base-local.Dockerfile` and `/home/dev/ihasco/Application/.docker/Dockerfile.no-newrelic` to build base images locally without New Relic dependencies  

**Alternatives Considered:**
- **AWS ECR Authentication:** Would require all developers to have AWS credentials configured
- **Public Docker Hub Images:** Security concerns and lack of control over base image contents

**Follow-up Actions:**
- [x] Update core.sh to build local base images (Developer - 2025-09-26)
- [x] Create Dockerfiles without New Relic installation (Developer - 2025-09-26)
- [x] Update docker-compose.yml to use local Dockerfiles (Developer - 2025-09-26)

### MySQL Host Configuration Change
**Date:** 2025-09-16  
**Description:** Switched from containerized MySQL to host-based MySQL using host.docker.internal  
**Rationale:** Provides persistent database storage, easier access from desktop tools, and potentially better performance than containerized MySQL  
**Status:** Implemented  
**Impact:** Medium - Affects database connectivity and persistence  
**Stakeholders:** All developers, Database administrators  
**Implementation:** Updated all .env files to use `host.docker.internal` as DB_HOST, removed MySQL container from docker-compose.yml  

**Alternatives Considered:**
- **Keep MySQL in container:** Would require volume management and complex networking
- **External database service:** Would require additional infrastructure setup

**Follow-up Actions:**
- [x] Update environment files with host.docker.internal (Developer - 2025-09-16)
- [x] Remove MySQL container definition (Developer - 2025-09-16)
- [x] Test connectivity from all services (Developer - 2025-09-16)

### Application Container Networking Fix
**Date:** 2025-09-16  
**Description:** Fixed Application container network connectivity by connecting to ihasco_local network with correct alias  
**Rationale:** Nginx was unable to reach the Application container because it was running on a different Docker network  
**Status:** Implemented  
**Impact:** High - Critical for application functionality  
**Stakeholders:** All developers  
**Implementation:** Connected Application container to ihasco_local network with alias `application_project_1` to match Nginx configuration  

**Alternatives Considered:**
- **Update Nginx configuration:** Would require changing existing working configurations
- **Use IP addresses:** Less maintainable and fragile

**Follow-up Actions:**
- [x] Connect Application container to ihasco_local network (Developer - 2025-09-16)
- [x] Add network alias application_project_1 (Developer - 2025-09-16)
- [x] Test Nginx to Application connectivity (Developer - 2025-09-16)

---

## 📚 Glossary

**HOSTED_APPS:** Array of application services managed by core.sh including Application, Application-Admin, Application-Worker, etc.  
**HOSTED_SERVICES:** Array of microservices including Authorisation-Service, Course-Authoring-Service, xAPI-Service, etc.  
**ihasco_local:** Main Docker network used for inter-container communication in the development environment  
**application_project_1:** Container name/alias used for the main Application service  
**ECR:** Amazon Elastic Container Registry - cloud-based Docker registry service  
**New Relic:** Application Performance Monitoring (APM) service - removed from local development builds  
**PHP-FPM:** PHP FastCGI Process Manager - used for serving PHP applications  
**core.sh:** Main build and deployment script for the development environment  

## 🤝 Meeting Notes

### Development Environment Setup Issues Resolution
**Date:** 2025-09-26  
**Attendees:** Development Team  
**Agenda:**
- ECR authentication failures
- New Relic installation issues  
- Local development improvements

**Notes:** 
Resolved multiple issues with local development setup including ECR authentication problems and New Relic installation failures. Created local Docker base images to eliminate external dependencies. Updated build process to work entirely with local resources.

**Action Items:**
- [x] Create local base Dockerfiles (Developer - 2025-09-26)
- [x] Update core.sh build process (Developer - 2025-09-26)
- [x] Test complete build process (Developer - 2025-09-26)

---

## 💡 Lessons Learned

### Docker Network Configuration Complexity
**Date:** 2025-09-16  
**Category:** Technical  
**Situation:** Application container was unreachable from Nginx due to different Docker networks  
**Lesson:** Container networking requires careful attention to network aliases and inter-service communication patterns  
**Application:** Always verify container network connectivity when adding new services or changing network configurations  
**Impact:** High - Critical for service functionality and can be difficult to debug  

### ECR Dependency Management
**Date:** 2025-09-26  
**Category:** Technical  
**Situation:** Developers unable to build locally due to AWS ECR authentication requirements  
**Lesson:** External dependencies (like ECR) should be minimized in local development environments to reduce friction  
**Application:** Create local alternatives for external dependencies when possible, especially for base images  
**Impact:** High - Significantly improves developer experience and reduces setup complexity  

### Environment File Management
**Date:** 2025-09-16  
**Category:** Project Management  
**Situation:** Multiple environment files needed updates for host configuration changes  
**Lesson:** Centralized environment configuration management is crucial for maintaining consistency across services  
**Application:** Consider using environment file templates or automated updating scripts for large changes  
**Impact:** Medium - Reduces manual errors and ensures consistency  

---

## 👥 Onboarding Notes

### New Developer Setup
**Status:** Template  
**Department:** Development  
**Start Date:** [To be filled]  
**Mentor:** [To be assigned]  

**Technical Setup:**
- [ ] Install Docker and Docker Compose
- [ ] Clone dev_docker repository
- [ ] Set up .env file with COMPOSER_TOKEN
- [ ] Run `./core.sh -b -a` for initial build
- [ ] Configure local hosts file for *.ihasco.local domains
- [ ] Install MySQL client for local database access

**Codebase Familiarity:**
- [ ] Understand core.sh script functionality
- [ ] Learn Docker Compose service architecture
- [ ] Review environment file structure
- [ ] Understand network configuration (ihasco_local)
- [ ] Learn about hosted apps vs hosted services distinction

**Feature Implementation:**
- [ ] Successfully build and run local environment
- [ ] Access application at https://app.ihasco.local
- [ ] Connect to local MySQL database
- [ ] Run application setup scripts
- [ ] Understand log monitoring and debugging

**Resources:**
- 📚 [core.sh script documentation in repository]
- 📚 [Docker Compose files for each service]
- 📚 [Environment file templates in .docker/env_files/]
- 📚 [Nginx configuration in .docker/nginx/]

**Notes:**
Focus on understanding the overall architecture before diving into specific services. The core.sh script is the main entry point for all development operations.

**Next Goals:**
- [ ] Complete local environment setup
- [ ] Understand service interdependencies
- [ ] Learn debugging and troubleshooting processes

**Completion Status:** 0% - [Template for new developers]

---

*This memory document should be updated whenever significant decisions are made, lessons are learned, or team changes occur. It serves as both historical record and guidance for future development.*

---

## 🤖 AI Agent Instructions

When updating this memory document, please:

1. **Add new decisions** to the Decision Log with proper rationale and implementation details
2. **Update existing decisions** if their status changes (e.g., from Decided to Implemented)
3. **Add lessons learned** from recent project experiences, focusing on actionable insights
4. **Update meeting notes** with recent team meetings, decisions, and action items
5. **Maintain the glossary** by adding new terms and updating existing definitions
6. **Update onboarding notes** as team members progress or new members join
7. **Preserve the exact format** including emojis, sections, and field names for compatibility with Arcana
8. **Use the action item format**: `- [x] Task description (Assignee - Date)` for completed items
9. **Use the action item format**: `- [ ] Task description (Assignee - Date)` for pending items
10. **Keep the document current** by updating the "Last Updated" date at the top

**Format Requirements for Arcana Compatibility:**
- Section headers must use exact emoji format: `## 🏢 Project Information`
- Action items must follow format: `- [x] Description (Person - Date)`
- All field names like **Date:**, **Status:**, **Impact:** must be preserved exactly
- Maintain consistent indentation and bullet point formatting