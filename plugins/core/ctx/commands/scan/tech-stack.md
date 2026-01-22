---
allowed-tools: Glob(**/*), Grep(pattern:*), Read(**/*), Write(**/*), Task(subagent_type=Explore)
argument-hint: [codebase-path] [output-directory]
description: Analyze codebase and generate comprehensive tech stack documentation
---

## Purpose

Analyze any repository to identify all technologies, frameworks, libraries, and infrastructure components in use. Generate detailed documentation files that provide Claude Code with complete visibility into the tech stack across all layers.

## Parameters

- `$1` (codebase-path): Path to the repository root directory to analyze
- `$2` (output-directory): Directory where generated tech stack documentation will be saved

## Tech Stack Detection Strategy

### Frontend Technology Detection
1. Scan for web framework indicators:
   - React/Next.js, Vue/Nuxt, Angular, Svelte, Ember, Astro, Remix, Solid, etc.
2. Detect build tools and bundlers:
   - Webpack, Vite, Esbuild, Parcel, Turbopack, Rollup, etc.
3. Identify styling solutions:
   - CSS, SCSS/Sass, Less, Tailwind, Bootstrap, Material UI, Styled Components, CSS-in-JS, etc.
4. Detect state management:
   - Redux, Zustand, Jotai, Recoil, MobX, Context API, Pinia, Vuex, NgRx, etc.
5. Find UI component libraries:
   - Material Design, Ant Design, Chakra UI, shadcn/ui, Storybook, etc.
6. Identify testing frameworks:
   - Jest, Vitest, Cypress, Playwright, Testing Library, Selenium, etc.
7. Detect package managers:
   - npm, yarn, pnpm, bun

### Backend Technology Detection
1. Identify programming languages:
   - Python, JavaScript/Node.js, Java, Go, Rust, C#/.NET, Ruby, PHP, Kotlin, Scala, etc.
2. Detect web frameworks:
   - Django, FastAPI, Flask, Spring, Spring Boot, Express, NestJS, ASP.NET, Laravel, Rails, etc.
3. Find ORM/database libraries:
   - SQLAlchemy, Prisma, TypeORM, Sequelize, Entity Framework, Hibernate, ActiveRecord, etc.
4. Identify API specifications:
   - REST, GraphQL, gRPC, OpenAPI/Swagger, etc.
5. Detect caching solutions:
   - Redis, Memcached, Elasticsearch, etc.
6. Identify authentication/auth libraries:
   - JWT, OAuth, Passport, Firebase Auth, AWS Cognito, etc.
7. Find background job/task queues:
   - Celery, RQ, Bull, Sidekiq, Hangfire, etc.
8. Detect logging and monitoring:
   - Winston, Pino, Serilog, Log4j, Datadog, New Relic, Sentry, etc.

### Database Technology Detection
1. **Relational Databases**:
   - PostgreSQL, MySQL, MariaDB, SQLite, Oracle, SQL Server, etc.
2. **NoSQL Databases**:
   - MongoDB, CouchDB, DynamoDB, Firebase, Firestore, Cassandra, etc.
3. **Search Engines**:
   - Elasticsearch, Algolia, Meilisearch, etc.
4. **Graph Databases**:
   - Neo4j, Amazon Neptune, etc.
5. **Data Warehouses**:
   - BigQuery, Snowflake, Redshift, etc.

### Infrastructure & Deployment Detection
1. **Containerization**:
   - Docker, Podman, etc.
2. **Orchestration**:
   - Kubernetes, Docker Swarm, etc.
3. **Cloud Platforms**:
   - AWS, Google Cloud, Azure, DigitalOcean, Heroku, Vercel, Netlify, etc.
4. **Infrastructure as Code**:
   - Terraform, CloudFormation, Bicep, Ansible, Pulumi, etc.
5. **CI/CD Pipelines**:
   - GitHub Actions, GitLab CI, Jenkins, CircleCI, TravisCI, Azure Pipelines, etc.
6. **API Gateways & Load Balancing**:
   - Nginx, Apache, HAProxy, AWS ALB/ELB, etc.

### Messaging & Streaming Detection
1. **Message Brokers**:
   - RabbitMQ, Apache Kafka, AWS SQS/SNS, Azure Service Bus, etc.
2. **Event Streaming**:
   - Kafka, Pulsar, Kinesis, Pub/Sub, etc.
3. **WebSocket/Real-time**:
   - Socket.io, WebSocket, SignalR, etc.

### Development Tools & Quality Detection
1. **Linters & Formatters**:
   - ESLint, Prettier, Pylint, Black, isort, Rustfmt, etc.
2. **Type Checkers**:
   - TypeScript, Flow, mypy, Kotlin null safety, etc.
3. **Testing Frameworks**:
   - Unit: pytest, Jest, JUnit, NUnit, etc.
   - Integration: Supertest, pytest, etc.
   - E2E: Cypress, Playwright, Selenium, etc.
4. **Development Servers & Hot Reload**:
   - Webpack Dev Server, Vite, Nodemon, etc.

### Dependency Source Files Analyzed
- `package.json`, `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`
- `requirements.txt`, `setup.py`, `setup.cfg`, `pyproject.toml`, `Pipfile`
- `pom.xml`, `build.gradle`, `build.gradle.kts`
- `Gemfile`, `composer.json`, `go.mod`, `Cargo.toml`, `pubspec.yaml`
- Configuration files: `.eslintrc`, `tsconfig.json`, `pytest.ini`, `Dockerfile`, `docker-compose.yml`
- Build scripts and CI/CD files in `.github/workflows/`, `.gitlab-ci.yml`, `Jenkinsfile`, etc.

## Generated Documentation Files

### Comprehensive Tech Stack Overview
- `tech-stack-overview.md` - Executive summary of all technologies in use

### Technology Category Documents
- `frontend-stack.md` - Frontend frameworks, libraries, build tools, styling
- `backend-stack.md` - Backend frameworks, languages, runtime environments
- `database-stack.md` - Database systems, ORMs, migrations tools
- `infrastructure-stack.md` - Deployment, containerization, orchestration, cloud platforms
- `messaging-stack.md` - Message brokers, event streaming, real-time communication (if applicable)

### Dependency Management
- `dependencies-overview.md` - All production dependencies with versions
- `dev-dependencies.md` - Development and testing dependencies
- `package-managers.md` - Package managers and lock files in use

### Development & Quality
- `development-tools.md` - Linters, formatters, type checkers
- `testing-stack.md` - Testing frameworks and testing tools
- `ci-cd-pipeline.md` - CI/CD systems, automation, deployment workflows

### Architecture-Related Tech
- `api-specifications.md` - REST, GraphQL, gRPC, or other API approaches
- `authentication-stack.md` - Authentication and authorization libraries
- `caching-strategy.md` - Caching solutions and strategies
- `monitoring-observability.md` - Logging, metrics, monitoring, tracing tools

### Technology Matrix
- `tech-matrix.md` - Dependency matrix showing which technologies work together

## Output Format

Each file follows this structure:

```markdown
# [Technology Category]

## Overview
- Summary of this category in the project
- Why these technologies were chosen
- Key responsibilities

## Technologies in Use

### [Specific Technology]
- **Version**: [detected version]
- **Purpose**: What it's used for
- **Configuration**: Location of config files
- **Integration Points**: How it integrates with other tech

...

## Dependency Graph
- How technologies in this category interact
- Key dependencies and relationships

## Key Capabilities
- What this tech stack enables
- Strengths and considerations

## Development Workflow
- How developers use these technologies
- Common commands and scripts

## Known Constraints
- Version constraints
- Compatibility notes
- Upgrade considerations

## References
- Package files and configurations
- Documentation links
```

## Execution Steps

1. Scan `$1` for all configuration and manifest files
2. Parse dependency files to extract packages and versions
3. Detect technologies across all layers (frontend, backend, infrastructure)
4. Analyze file structure for framework indicators
5. Extract CI/CD and deployment configurations
6. Generate comprehensive tech stack documentation in `$2`
7. Create dependency and integration matrices
8. Report detection summary

## Example Usage

```bash
/tech-stack /path/to/repo ./docs/tech-stack
/tech-stack . ./tech-stack-docs
```

## Example Output Structure

```
tech-stack-docs/
├── tech-stack-overview.md
├── frontend-stack.md
├── backend-stack.md
├── database-stack.md
├── infrastructure-stack.md
├── dependencies-overview.md
├── dev-dependencies.md
├── development-tools.md
├── testing-stack.md
├── ci-cd-pipeline.md
├── api-specifications.md
├── authentication-stack.md
├── monitoring-observability.md
└── tech-matrix.md
```

## Context Integration

Generated tech stack documentation enables Claude Code to:
- Understand complete technology landscape
- Make technology-aware implementation decisions
- Use appropriate libraries and frameworks correctly
- Follow dependency version constraints
- Integrate with existing infrastructure
- Maintain consistency with development tools
- Understand CI/CD and deployment processes
- Make informed decisions about technology interactions

Documentation is automatically tailored to the actual tech stack of the analyzed codebase.
