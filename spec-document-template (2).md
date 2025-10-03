# iHasco Dev Docker Environment - Specification Document

*Comprehensive technical specification for iHasco Development Docker Environment*  
*Last Updated: 2025-10-03*  
*Version: 2.0*  
*Status: Implemented*

## 📋 Project Overview

**Project Name:** iHasco Dev Docker Environment  
**Description:** A comprehensive Docker-based development environment for the iHasco learning management system that orchestrates multiple services including the main Application, various APIs, worker services, and supporting infrastructure components (Nginx, MySQL, Redis, Elasticsearch). Provides a complete local development setup that mirrors production architecture.  
**Target Users:** Developers working on iHasco platform, DevOps engineers, QA testers  
**Business Value:** Reduces development environment setup time from hours to minutes, ensures consistency across developer machines, eliminates "works on my machine" issues, and provides isolated testing environments  
**Success Metrics:** Developer onboarding time, environment setup success rate, development velocity, bug reproduction rate  

**Project Scope:**  
**In Scope:**
- Complete Docker orchestration for all iHasco services  
- Local development environment with hot-reload capabilities  
- Database connectivity and persistence  
- Service networking and inter-service communication  
- SSL certificate management for local HTTPS  
- Build automation and setup scripts  
- Environment configuration management  

**Out of Scope:**
- Production deployment configurations  
- Cloud infrastructure provisioning  
- Monitoring and alerting systems  
- Load balancing for production traffic  
- Automated scaling configurations  

**Constraints:**
- Must work on Linux, macOS, and Windows with Docker  
- Local development only (not for production use)  
- Requires Docker and Docker Compose  
- Limited to services that can run in containers  

## ⚙️ Technical Requirements

**Technology Stack:**  
- **Container Platform:** Docker, Docker Compose  
- **Web Server:** Nginx (reverse proxy and static file serving)  
- **Application Runtime:** PHP 8.2 with PHP-FPM  
- **Database:** MySQL 5.7/8.0 (host-based or containerized)  
- **Cache/Queue:** Redis  
- **Search:** Elasticsearch/OpenSearch  
- **Process Management:** Supervisor for background workers  
- **Build Tools:** Bash scripts, Composer, npm  

**System Requirements:**  
- **Performance:** Fast startup (< 5 minutes for full environment), responsive development workflow  
- **Scalability:** Support for 10+ concurrent services, extensible for new microservices  
- **Security:** Local SSL certificates, isolated networks, secure credential management  
- **Compatibility:** Cross-platform Docker support, consistent behavior across development machines  
- **Availability:** Robust error handling, automatic service recovery, health checks  

**Development Environment:**  
- **Version Control:** Git with branch-based workflows  
- **CI/CD:** Local build and test capabilities  
- **Testing:** PHPUnit, Jest, isolated test databases  
- **Monitoring:** Docker logs, application-specific logging  

## 🎯 Functional Requirements

### Core Environment Management

#### Environment Build and Setup
**Priority:** Critical  
**User Story:** As a developer, I want to build the entire development environment with a single command so that I can start working quickly without complex setup procedures  
**Acceptance Criteria:**
- [ ] `./core.sh -b -a` builds and starts all services
- [ ] Handles dependency order (databases before applications)  
- [ ] Creates necessary networks and volumes automatically  
- [ ] Provides clear error messages for setup failures  
- [ ] Backs up existing configurations before updates  

**Business Rules:**
- Must validate required environment variables before starting
- Must check for Docker and Docker Compose availability
- Should provide rollback capability for failed builds

**Dependencies:**
- Docker and Docker Compose installed
- Valid GitHub composer token
- Local filesystem permissions

---

#### Service Orchestration
**Priority:** Critical  
**User Story:** As a developer, I want all application services to start in the correct order with proper networking so that the full application stack is functional  
**Acceptance Criteria:**
- [ ] All services can communicate with each other
- [ ] Services start in dependency order (database → cache → applications)  
- [ ] Network aliases are correctly configured  
- [ ] Health checks verify service readiness  
- [ ] Failed services are reported with actionable errors  

**Business Rules:**
- Main application must wait for database availability
- Services must use consistent network naming
- Container names must follow predictable patterns

**Dependencies:**
- ihasco_local Docker network
- Service-specific Docker images
- Configuration files and environment variables

---

### Application Services

#### Main Application Service
**Priority:** Critical  
**User Story:** As a developer, I want the main iHasco application to be accessible via HTTPS locally so that I can develop and test features in a production-like environment  
**Acceptance Criteria:**
- [ ] Application accessible at https://app.ihasco.local
- [ ] PHP-FPM processes requests correctly  
- [ ] File changes are reflected immediately (hot reload)  
- [ ] Database connections work properly  
- [ ] SSL certificates are automatically configured  

**Business Rules:**
- Must use local base images to avoid ECR dependencies
- Should skip New Relic installation in development
- Must connect to host MySQL when configured

**Dependencies:**
- Local base Docker image (ihasco/application-base:local)
- Nginx reverse proxy configuration
- Database connectivity (host.docker.internal or container)

---

#### API Services Management
**Priority:** High  
**User Story:** As a developer, I want all API services (Application-Api, Assessment-Api, Service-Api) to be available locally so that I can develop full-stack features requiring API integration  
**Acceptance Criteria:**
- [ ] All API services start successfully
- [ ] Each API has unique port/domain configuration  
- [ ] APIs can connect to shared database and cache  
- [ ] API endpoints respond to requests  
- [ ] Cross-service communication works  

**Business Rules:**
- Each API service must have isolated configuration
- Shared resources (database, cache) must be accessible
- API versions must be consistent with main application

**Dependencies:**
- Individual service Docker images
- Shared network configuration
- Database schema compatibility

---

### Infrastructure Services

#### Database Management
**Priority:** Critical  
**User Story:** As a developer, I want flexible database connectivity options so that I can use either containerized or host-based MySQL depending on my development needs  
**Acceptance Criteria:**
- [ ] Can connect to host MySQL via host.docker.internal
- [ ] Can fall back to containerized MySQL if needed  
- [ ] Database persistence works correctly  
- [ ] Migration and seeding tools function  
- [ ] Database accessible from desktop tools  

**Business Rules:**
- Host-based MySQL preferred for persistence and performance
- Must support multiple database configurations per service
- Schema changes must be version controlled

**Dependencies:**
- MySQL 5.7+ running on host or in container
- Database configuration in environment files
- Network connectivity configuration

---

#### Nginx Reverse Proxy
**Priority:** Critical  
**User Story:** As a developer, I want a properly configured reverse proxy so that I can access all services through consistent HTTPS URLs  
**Acceptance Criteria:**
- [ ] SSL certificates generated and configured
- [ ] All services accessible via *.ihasco.local domains  
- [ ] Static file serving works correctly  
- [ ] Proxy passes requests to correct backend services  
- [ ] Error pages are user-friendly  

**Business Rules:**
- Must use HTTPS for all local development
- Each service must have dedicated subdomain
- Static assets must be served efficiently

**Dependencies:**
- SSL certificate generation
- DNS resolution for *.ihasco.local
- Backend service availability

---

## 🔒 Non-Functional Requirements

**Performance Requirements:**
- Environment startup time: < 5 minutes for full stack
- Service response time: < 2 seconds for development requests  
- File change detection: < 1 second for hot reload
- Resource usage: Reasonable memory and CPU consumption for development

**Security Requirements:**
- Network isolation: Services communicate only through defined networks
- Credential management: Secure handling of API tokens and secrets
- Local SSL: Valid certificates for HTTPS development
- Container security: Non-root processes where possible

**Usability Requirements:**
- Single command setup: `./core.sh -b -a` for complete environment
- Clear error messages: Actionable feedback for common issues
- Cross-platform: Consistent behavior on Linux, macOS, Windows
- Documentation: Clear setup and troubleshooting guides

**Reliability Requirements:**
- Service recovery: Automatic restart of failed containers
- Data persistence: Database and file data survives container restarts
- Error handling: Graceful degradation when services are unavailable
- Logging: Comprehensive logs for debugging issues

## 🛣️ Implementation Roadmap

### Phase 1: Core Infrastructure - Completed
**Objectives:** Establish basic Docker environment with essential services
**Deliverables:**
- Docker Compose configuration for core services
- Nginx reverse proxy with SSL
- MySQL database connectivity
- Basic networking between services

**Success Criteria:**
- All core services start successfully
- Main application accessible via HTTPS
- Database connections functional

**Risks:**
- Network configuration complexity - Mitigated with standardized network names
- SSL certificate issues - Mitigated with automated certificate generation

---

### Phase 2: Service Integration - Completed
**Objectives:** Add all application services with proper inter-service communication
**Deliverables:**
- All HOSTED_APPS services configured
- Worker and background services
- API service integration
- Service discovery and networking

**Success Criteria:**
- All services communicate properly
- Background jobs process correctly
- APIs respond to requests

**Risks:**
- Service dependency management - Mitigated with health checks and wait conditions
- Resource conflicts - Mitigated with proper port and volume management

---

### Phase 3: Developer Experience - In Progress
**Objectives:** Optimize environment for developer productivity
**Deliverables:**
- Hot reload for code changes
- Improved error handling and logging
- Setup automation and validation
- Documentation and troubleshooting guides

**Success Criteria:**
- < 5 minute setup time for new developers
- Clear error messages for common issues
- Comprehensive documentation

**Risks:**
- Platform compatibility issues - Mitigated with cross-platform testing
- Complex dependency management - Mitigated with local base images

---

## 🔌 Service Configuration

### Core Script API

#### Build and Start Environment
**Command:** `./core.sh -b -a`  
**Description:** Builds all Docker images and starts complete environment  

**Options:**
```bash
-b, --build            Re/build entire Docker environment
-a, --all-images       Remove all images when rebuilding
-i, --ignore-projects  Skip project container builds
-e, --setups           Run application setup scripts
-u, --start            Start containers only
-d, --stop             Stop all containers
```

**Success Response:**
```
Build Completed 5m 23s
Visit https://app.ihasco.local/admin
```

**Error Responses:**
- Missing COMPOSER_TOKEN: Validation error before build starts
- Docker not available: System requirement check failure  
- Network creation failure: Infrastructure setup error
- Service build failure: Individual service build error with logs

---

#### Environment Management
**Command:** `./core.sh [options]`  
**Description:** Manage development environment lifecycle  

**Available Operations:**
```bash
./core.sh -u           # Start services
./core.sh -d           # Stop services  
./core.sh -r           # Restart services
./core.sh -c           # Cleanup environment
./core.sh -e           # Run setup scripts
./core.sh -t           # Run tests
```

**Service Health Check:**
- Waits for Application service PHP-FPM to be ready
- Validates database connectivity
- Confirms network routing between services
- Reports service status and readiness

---

*This specification document should be updated as requirements change, features are implemented, and new insights are gained during development.*

---

## 🤖 AI Agent Instructions

When updating this specification document, please:

1. **Update project overview** with current scope, goals, and business value
2. **Maintain technical requirements** as technology decisions are made
3. **Add new functional requirements** as features are planned or requested
4. **Update acceptance criteria** as features are refined or implemented
5. **Revise non-functional requirements** based on performance testing and user feedback
6. **Update the roadmap** as phases are completed and new phases are planned
7. **Add new service configurations** as services are added or modified
8. **Update existing configurations** when service interactions change
9. **Preserve the exact format** including emojis, sections, and field names for compatibility with Arcana
10. **Keep the document current** by updating the "Last Updated" date and version number

**Format Requirements for Arcana Compatibility:**
- Section headers must use exact emoji format: `## 📋 Project Overview`
- Feature priorities must be: `**Priority:** [Critical | High | Medium | Low]`
- User stories must follow format: `**User Story:** As a [user], I want [action] so that [benefit]`
- Acceptance criteria must use checkbox format: `- [ ] [Criterion]`
- Command formats must be specified clearly with options and responses
- All field names like **Description:**, **Options:**, **Success Response:** must be preserved exactly
- Maintain consistent code block formatting for commands and responses