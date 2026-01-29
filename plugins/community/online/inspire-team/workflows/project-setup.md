---
name: project-setup
description: Complete project initialization with structure, configs, and CI/CD setup
type: workflow
phases: 5
---

# Project Setup Workflow

An automated workflow that scaffolds a complete project from scratch, including directory structure, configuration files, and CI/CD pipelines.

## Usage

```
/project-setup <project-name> [--template <template>] [--features <features>]
```

**Options:**
- `--template`: Project template (react, node-api, python, next, monorepo)
- `--features`: Comma-separated features (auth, db, docker, ci)

## Workflow Phases

### Phase 1: Project Structure

Create directory structure:

```
Use the template-server MCP to:
1. Create project directory
2. Generate folder structure based on template
3. Add placeholder files
4. Initialize git repository
```

### Phase 2: Package Setup

Initialize package management:

```
Based on project type:
1. Create package.json / pyproject.toml / go.mod
2. Add core dependencies
3. Configure scripts/commands
4. Setup dependency management (npm/yarn/pnpm)
```

### Phase 3: Configuration Files

Generate configuration:

```
Create standard config files:
1. .gitignore - Language-specific ignores
2. .editorconfig - Editor settings
3. prettier/eslint - Code formatting
4. tsconfig/babel - Build configuration
5. .env.example - Environment template
```

### Phase 4: Documentation

Use the **readme-generator** agent:

```
Generate documentation:
1. README.md with setup instructions
2. CONTRIBUTING.md guidelines
3. CHANGELOG.md template
4. API documentation stubs
```

### Phase 5: CI/CD Setup

Configure automation:

```
Setup CI/CD pipelines:
1. GitHub Actions / GitLab CI
2. Test workflow
3. Build workflow
4. Deploy workflow (if --features includes deploy)
```

## Output

After completion, you'll have:

```
my-project/
├── .github/
│   └── workflows/
│       ├── test.yml
│       └── build.yml
├── src/
│   └── [template-specific structure]
├── tests/
├── docs/
├── .gitignore
├── .editorconfig
├── README.md
├── CONTRIBUTING.md
├── package.json
└── [other config files]
```

## Templates Available

| Template | Description |
|----------|-------------|
| `react` | React + TypeScript + Vite |
| `node-api` | Express/Fastify REST API |
| `python` | Python package with Poetry |
| `next` | Next.js full-stack app |
| `monorepo` | Turborepo workspace |
