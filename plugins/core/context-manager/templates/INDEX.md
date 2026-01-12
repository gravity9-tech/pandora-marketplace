# Team Context Index

This index provides Claude with a map of available team context. **Do not load all files upfront.** Instead, use the Read tool to fetch specific files when relevant to the current task.

## How to Use This Index

1. Review the domain table below to understand what context is available
2. Based on the current task, identify which domains are relevant
3. Use the Read tool to load only the files you need
4. Reference the loaded context in your responses

## Available Domains

| Domain | Description | When to Read | Path |
|--------|-------------|--------------|------|
| **architecture** | System design, patterns, component relationships | New features, refactoring, understanding system structure | `.claude/context/architecture/` |
| **business_domain** | Domain terminology, glossary, user stories | Understanding requirements, domain-specific logic | `.claude/context/business_domain/` |
| **coding_guidelines** | Style guides, best practices, code review standards | Writing code, reviewing PRs, enforcing standards | `.claude/context/coding_guidelines/` |
| **development-env** | Local setup, prerequisites, troubleshooting | Environment issues, onboarding, debugging setup | `.claude/context/development-env/` |
| **integration** | API standards, integration patterns, third-party services | Building integrations, API work, external services | `.claude/context/integration/` |
| **monitoring-observability** | Logging, alerting, monitoring configuration | Adding observability, debugging production issues | `.claude/context/monitoring-observability/` |
| **qa-standards** | Testing guidelines, quality standards | Writing tests, reviewing test coverage | `.claude/context/qa-standards/` |
| **references** | Quick references, useful links | Looking up resources, finding documentation | `.claude/context/references/` |
| **repositories** | Repository standards, inventory | Multi-repo work, understanding project structure | `.claude/context/repositories/` |
| **security-compliance** | Security guidelines, secrets management | Auth, security reviews, handling sensitive data | `.claude/context/security-compliance/` |
| **tech_stack** | Frameworks, libraries, tooling documentation | Technology decisions, understanding dependencies | `.claude/context/tech_stack/` |
| **workflows** | Development, deployment, QA, PR processes | Following team processes, CI/CD, releases | `.claude/context/workflows/` |

## Domain Details

### architecture/
System architecture and design patterns used in this project.

| File | Purpose |
|------|---------|
| `system-architecture.md` | High-level system design and component overview |
| `design-patterns.md` | Design patterns and architectural decisions |

### business_domain/
Domain knowledge and business context.

| File | Purpose |
|------|---------|
| `glossary.md` | Domain-specific terminology and definitions |
| `domain_knowledge.md` | Core business concepts and rules |
| `user_stories.md` | Key user stories and requirements |

### coding_guidelines/
Coding standards and review processes.

| File | Purpose |
|------|---------|
| `style_guide.md` | Code style and formatting rules |
| `best_practices.md` | General coding best practices |
| `code_review_guidelines.md` | How to conduct code reviews |
| `code-review-checklist.md` | Checklist for PR reviews |
| `detected-technologies.md` | Technologies in use and their conventions |

### development-env/
Development environment setup and troubleshooting.

| File | Purpose |
|------|---------|
| `env-overview.md` | Development environment overview |
| `local-setup.md` | Step-by-step local setup guide |
| `troubleshooting.md` | Common issues and solutions |

### integration/
API and integration standards.

| File | Purpose |
|------|---------|
| `api-standards.md` | API design and documentation standards |
| `integration-patterns.md` | Common integration patterns |
| `third-party-services.md` | External services and their usage |

### monitoring-observability/
Logging, monitoring, and alerting.

| File | Purpose |
|------|---------|
| `logging-standards.md` | Logging conventions and levels |
| `monitoring-setup.md` | Monitoring infrastructure |
| `alerting-guidelines.md` | Alert configuration and response |

### qa-standards/
Testing and quality assurance.

| File | Purpose |
|------|---------|
| `unit-test-guidelines.md` | Unit testing standards and patterns |

### references/
Quick references and links.

| File | Purpose |
|------|---------|
| `quick-references.md` | Commonly needed reference information |
| `useful-links.md` | Links to external resources |

### repositories/
Repository information and standards.

| File | Purpose |
|------|---------|
| `repositories-inventory.md` | List of team repositories |
| `repositories-standard.md` | Repository structure standards |

### security-compliance/
Security guidelines and compliance.

| File | Purpose |
|------|---------|
| `security-guidelines.md` | Security best practices |
| `secrets-management.md` | How to handle secrets and credentials |

### tech_stack/
Technology stack documentation.

| File | Purpose |
|------|---------|
| `frameworks.md` | Frameworks in use |
| `libraries.md` | Key libraries and their purposes |
| `tooling.md` | Development tools and utilities |

### workflows/
Team processes and workflows.

| File | Purpose |
|------|---------|
| `development_workflow.md` | Day-to-day development process |
| `pr-process.md` | Pull request workflow |
| `deployment_pipelines.md` | CI/CD and deployment |
| `qa_workflow.md` | QA and testing process |
| `testing-generation-workflow.md` | Test generation guidelines |
| `fronend_workflow.md` | Frontend-specific workflow |
| `amplience-workflow.md` | Amplience CMS workflow |

---

## Loading Examples

**Task: Implementing a new API endpoint**
```
Read: .claude/context/coding_guidelines/best_practices.md
Read: .claude/context/integration/api-standards.md
Read: .claude/context/qa-standards/unit-test-guidelines.md
```

**Task: Reviewing a pull request**
```
Read: .claude/context/coding_guidelines/code-review-checklist.md
Read: .claude/context/coding_guidelines/style_guide.md
```

**Task: Understanding the system architecture**
```
Read: .claude/context/architecture/system-architecture.md
Read: .claude/context/architecture/design-patterns.md
```

**Task: Setting up local development**
```
Read: .claude/context/development-env/local-setup.md
Read: .claude/context/development-env/troubleshooting.md
```
