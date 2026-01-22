---
allowed-tools: Glob(**/*), Grep(pattern:*), Read(**/*), Write(**/*), Task(subagent_type=Explore)
argument-hint: [codebase-path] [output-directory]
description: Detect technologies in codebase and generate tailored coding guidelines for each
---

## Purpose

Analyze any repository to identify all programming languages and technologies in use, then generate comprehensive coding guidelines, best practices, and quality standards for each one. Output is organized as separate Markdown files for easy reference and integration into Claude Code context.

## Parameters

- `$1` (codebase-path): Path to the repository root directory to analyze
- `$2` (output-directory): Directory where generated guideline files will be saved

## Technology Detection (Language & Framework Agnostic)

### Detection Method
1. Scan all file extensions and count occurrences
2. Parse dependency management files (`package.json`, `requirements.txt`, `pom.xml`, `Gemfile`, `composer.json`, `go.mod`, `Cargo.toml`, etc.)
3. Analyze configuration files (`.eslintrc`, `tsconfig.json`, `.flake8`, `build.gradle`, `setup.cfg`, etc.)
4. Examine import/require statements and module references
5. Review project structure, build scripts, and CI/CD files
6. Detect framework versions and associated tools

### Languages Detected
- Python, JavaScript/TypeScript, Java, C#, C++, Go, Rust, Ruby, PHP, Kotlin, Swift, Dart, Scala, Groovy, Clojure, Haskell, Elixir, R, MATLAB, Objective-C, Shell/Bash

### Web Frameworks Detected
- **Frontend**: React, Vue, Angular, Svelte, Next.js, Nuxt, Remix, Astro, Solid, Ember, Backbone
- **Backend**: Django, FastAPI, Flask, Express, NestJS, Spring, Spring Boot, Laravel, Rails, ASP.NET, Gin, Echo, Fiber, Phoenix, Play Framework

### Testing Frameworks Detected
- pytest, unittest, Jest, Vitest, Jasmine, Mocha, Cypress, Playwright, Selenium, TestNG, JUnit, NUnit, RSpec, PHPUnit

### Build & Package Tools Detected
- npm, yarn, pnpm, Maven, Gradle, Cargo, Go modules, pip, poetry, RubyGems, Composer, Mix

### Styling & CSS Detected
- CSS, SCSS/Sass, Less, Tailwind, Bootstrap, Material UI, Styled Components, Emotion, BEM, CSS Modules

### Database Detected
- PostgreSQL, MySQL, MongoDB, SQLite, Redis, DynamoDB, Firebase, Firestore, Cassandra, Oracle, SQL Server, Elasticsearch

### Infrastructure & DevOps Detected
- Docker, Kubernetes, GitHub Actions, GitLab CI, Jenkins, Terraform, CloudFormation, Azure, AWS, GCP, Nginx, Apache

### API Standards Detected
- REST, GraphQL, gRPC, WebSocket, OpenAPI/Swagger specifications

## Generated Guidelines Files

The command generates guidelines tailored to detected technologies:

### Language-Specific Guidelines
- `{language}-guidelines.md` for each detected language
  - Python, JavaScript, TypeScript, Java, C#, Go, Rust, Ruby, PHP, etc.
  - Contains naming conventions, code style, best practices for that language

### Framework-Specific Guidelines
- `{framework}-guidelines.md` for major frameworks detected
  - React, Vue, Angular, Django, FastAPI, Spring Boot, etc.
  - Includes framework patterns, project structure, component/module standards

### Quality & Standards Files
- `testing-standards.md` - Testing frameworks, coverage targets, test patterns
- `code-review-checklist.md` - Verification items for all pull requests
- `linting-and-formatting.md` - Tools, configuration, style consistency
- `naming-conventions.md` - Unified naming standards across all languages
- `error-handling.md` - Error/exception patterns per technology
- `dependencies-management.md` - Versioning, security, update strategies
- `architecture-patterns.md` - Design patterns, modularity, layer separation
- `performance-guidelines.md` - Optimization strategies per technology
- `security-guidelines.md` - Security best practices per language/framework
- `documentation-standards.md` - Comment style, API docs, code examples

## Output Format

Each generated file follows structure relevant to its content:

```markdown
# [Technology/Topic] Guidelines

## Overview
- Purpose in this project
- Key characteristics
- Version/configuration info

## Naming Conventions
- Classes/Types: [convention]
- Functions/Methods: [convention]
- Constants: [convention]
- Variables: [convention]
- Files/Modules: [convention]

## Code Style
- Indentation and spacing
- Line length limits
- Import/require ordering
- Comment and documentation style

## Best Practices
- [Practice 1 with rationale]
- [Practice 2 with rationale]
- [Practice N...]

## Error Handling
- Error types and hierarchy
- Exception/error raising patterns
- Try-catch/try-except patterns
- Error logging standards

## Testing Requirements
- Test framework and setup
- Coverage target percentage
- Test file naming and location
- Required test patterns

## Tools & Configuration
- Linter and formatter config
- Type checker if applicable
- Configuration file references

## Common Pitfalls
- [Pitfall description] → [Solution]
- [Pitfall description] → [Solution]

## References & Resources
- Official documentation
- Relevant style guides
```

## Execution Steps

1. Scan `$1` for file types, extensions, and configuration files
2. Parse dependency files to identify frameworks and libraries
3. Identify all unique technologies (languages, frameworks, tools)
4. Generate language-specific guidelines for each detected language
5. Generate framework-specific guidelines for major frameworks
6. Generate cross-cutting concern guidelines (testing, security, naming, etc.)
7. Create summary file listing all detected technologies
8. Save all files to `$2` with clear, consistent naming
9. Report summary of generation (technologies found, files created)

## Example Usage

```bash
/coding-guidelines /path/to/repo ./docs/guidelines
/coding-guidelines . ./guidelines
```

## Example Output Structure

For a full-stack project with Python, TypeScript, React, Docker:

```
guidelines/
├── python-guidelines.md
├── typescript-guidelines.md
├── javascript-guidelines.md
├── react-guidelines.md
├── testing-standards.md
├── code-review-checklist.md
├── naming-conventions.md
├── error-handling.md
├── security-guidelines.md
├── performance-guidelines.md
├── linting-and-formatting.md
├── docker-guidelines.md
├── architecture-patterns.md
└── detected-technologies.md
```

## Context Integration

Generated guidelines enable Claude Code to:
- Follow technology-specific best practices during implementation
- Apply appropriate patterns and conventions per language
- Maintain consistent code quality across the project
- Apply security standards relevant to each technology
- Optimize code based on technology-specific patterns
- Write tests matching project standards
- Perform effective code review with contextual checklists

Guidelines are automatically tailored to the actual technology stack in use.
