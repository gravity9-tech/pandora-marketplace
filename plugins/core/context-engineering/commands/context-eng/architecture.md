---
allowed-tools: Glob(**/*), Grep(pattern:*), Read(**/*), Write(**/*), Task(subagent_type=Explore)
argument-hint: [codebase-path] [output-directory]
description: Analyze codebase structure and generate comprehensive architecture documentation
---

## Purpose

Analyze a repository to understand its system architecture, design patterns, and architectural decisions. Generate comprehensive documentation files that provide Claude Code with deep architectural context for informed implementation decisions.

## Parameters

- `$1` (codebase-path): Path to the repository root directory to analyze
- `$2` (output-directory): Directory where generated architecture documentation will be saved

## Architecture Analysis Strategy

### Directory & File Structure Analysis
1. Scan directory hierarchy and identify layers/modules
2. Detect separation of concerns (frontend, backend, database, etc.)
3. Identify project type:
   - **Monolithic**: Single codebase, tightly coupled layers
   - **Microservices**: Multiple independent services
   - **Modular Monolith**: Single deployment, clear module boundaries
   - **Serverless**: Function-based, cloud-native
   - **Distributed**: Services across multiple deployment units

### Component & Module Detection
1. Analyze folder structure and naming conventions
2. Identify core components and their relationships
3. Map dependencies between modules
4. Detect communication patterns (API calls, message queues, events, etc.)

### Data Flow Analysis
1. Trace data flow from entry points through layers
2. Identify storage mechanisms and persistence patterns
3. Detect data transformation and processing pipelines
4. Analyze caching strategies and data consistency patterns

### Integration Pattern Detection
1. **Synchronous**: REST APIs, gRPC, function calls
2. **Asynchronous**: Message queues, event streaming, pub/sub
3. **Database**: Shared database, per-service database, event sourcing
4. **Hybrid**: Mix of synchronous and asynchronous patterns

### Architectural Style Detection
- **N-Tier/Layered**: Presentation, business logic, data access layers
- **Microservices**: Independent services with separate databases
- **Event-Driven**: Event producers, consumers, event bus/broker
- **Serverless**: Cloud functions, managed services
- **CQRS**: Command Query Responsibility Segregation
- **Hexagonal**: Domain-centric, ports and adapters
- **Repository Pattern**: Data access abstraction
- **MVC/MVVM**: Model-View-Controller/ViewModel separation

### Technology Stack Analysis
1. Detect frontend, backend, database technologies
2. Identify messaging systems (Kafka, RabbitMQ, etc.)
3. Detect deployment infrastructure (Docker, Kubernetes, etc.)
4. Identify observability tools (logging, metrics, tracing)
5. Analyze CI/CD and automation pipelines

## Generated Documentation Files

### Core Architecture Files
- `system-architecture.md` - Overall system design, layers, components, high-level overview
- `architectural-decisions.md` - Key decisions (monolithic vs microservices, sync vs async, etc.)
- `component-hierarchy.md` - Components, their responsibilities, relationships
- `module-dependencies.md` - Dependency graph, circular dependencies, module coupling

### Pattern & Design Files
- `design-patterns.md` - Patterns used (Factory, Strategy, Observer, Repository, etc.)
- `integration-patterns.md` - How components communicate and integrate
- `data-patterns.md` - Data flow patterns, storage strategies, consistency models
- `deployment-architecture.md` - How system is deployed (containers, orchestration, environments)

### Data & Storage Files
- `data-storage-architecture.md` - Databases, caches, storage systems in use
- `data-models.md` - Core data entities and their relationships
- `data-flow.md` - How data moves through the system
- `event-streaming.md` - Event-driven aspects, message queues, event sources (if applicable)

### Advanced Architecture Topics
- `scalability-considerations.md` - How system scales horizontally/vertically
- `performance-architecture.md` - Caching strategies, optimization patterns
- `security-architecture.md` - Authentication, authorization, data protection
- `observability-architecture.md` - Logging, metrics, tracing, monitoring
- `resilience-patterns.md` - Failure handling, circuit breakers, retries, fallbacks

### Context & Reference Files
- `technology-stack.md` - Complete list of technologies, versions, rationale
- `architectural-constraints.md` - Limitations, external requirements, non-functional requirements
- `communication-protocols.md` - API types, message formats, protocols in use

## Output Format

Each generated file follows this structure:

```markdown
# [Architecture Topic]

## Overview
- Brief description of this aspect of the architecture
- Why it matters for this system
- Key technologies or patterns involved

## Current Implementation
- How this is currently implemented in the codebase
- Specific examples and file references
- Diagrams or flow descriptions

## Design Decisions
- Why these choices were made
- Trade-offs considered
- Constraints or requirements driving the decisions

## Components/Layers/Services
- List of relevant components
- Their responsibilities
- How they interact

## Technology Stack
- Specific tools and libraries used
- Versions and configurations
- Rationale for selections

## Key Patterns
- Design patterns employed
- Integration patterns used
- Data flow patterns

## Scalability & Performance
- How this aspect scales
- Performance considerations
- Optimization opportunities

## Risks & Limitations
- Known limitations
- Technical debt
- Areas needing improvement

## References
- File locations for implementation
- Configuration file locations
- Related documentation
```

## Execution Steps

1. Scan `$1` repository structure and file organization
2. Analyze code dependencies and module relationships
3. Detect architectural style and patterns in use
4. Identify data flow and integration mechanisms
5. Map technology stack and infrastructure decisions
6. Generate comprehensive architecture documentation files in `$2`
7. Create visual diagrams/ASCII representations where applicable
8. Produce summary of architectural findings

## Example Usage

```bash
/architecture /path/to/repo ./docs/architecture
/architecture . ./architecture-docs
```

## Example Output Structure

```
architecture-docs/
├── system-architecture.md
├── architectural-decisions.md
├── component-hierarchy.md
├── design-patterns.md
├── integration-patterns.md
├── data-flow.md
├── data-storage-architecture.md
├── technology-stack.md
├── deployment-architecture.md
├── scalability-considerations.md
├── security-architecture.md
├── observability-architecture.md
├── resilience-patterns.md
└── architectural-constraints.md
```

## Context Integration

Generated architecture documentation enables Claude Code to:
- Understand system boundaries and component responsibilities
- Make informed implementation decisions respecting existing patterns
- Maintain architectural consistency in new features
- Identify appropriate integration points for new functionality
- Understand data flow and persistence strategies
- Apply security and scalability patterns correctly
- Maintain resilience and reliability standards
- Implement features with architectural awareness
- Refactor code with understanding of design decisions

All documentation is automatically tailored to the actual architecture of the analyzed codebase.
