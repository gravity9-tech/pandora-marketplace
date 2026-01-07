---
description: Generate comprehensive codebase documentation with architectural diagrams using a phased approach
argument-hint: [repository-path] [destination-folder]
allowed-tools: Read, Glob, Grep, Bash, Write
model: sonnet
---

# DeepWiki Documentation Generator

You will orchestrate a comprehensive, phased documentation generation workflow using the **deepwiki subagent**. This process systematically analyzes codebases and creates professional technical documentation with architectural diagrams.

## Workflow Overview

Execute these 5 phases sequentially:

### Phase 1: Codebase Analysis
### Phase 2: Documentation Structure Planning  
### Phase 3: Structure Review & Finalization
### Phase 4: Content Generation Loop
### Phase 5: Overview & Integration

---

## Command Arguments Parsing

Parse the provided arguments to determine repository path and destination folder:

**Arguments provided:** `$ARGUMENTS`

**Argument parsing logic:**
- If no arguments: Repository = current directory, Destination = `docs/`
- If one argument: Repository = $1, Destination = `docs/`
- If two arguments: Repository = $1, Destination = $2

**Parse now and set:**
- REPOSITORY_PATH = [determined path or current directory]
- DESTINATION_FOLDER = [determined destination or "docs/"]

**Display configuration:**
```
📁 Repository: [REPOSITORY_PATH]
📝 Documentation destination: [REPOSITORY_PATH]/[DESTINATION_FOLDER]
```

**Validate paths:**
1. Check if repository path exists
2. If destination folder exists, ask: "Destination folder already exists. Overwrite (o), Merge (m), or Abort (a)?"
3. If doesn't exist, confirm: "Will create [DESTINATION_FOLDER] in the repository."

---

## Target Configuration

Repository to document: **[REPOSITORY_PATH]**
Documentation output: **[REPOSITORY_PATH]/[DESTINATION_FOLDER]/**

---

## Phase 1: Codebase Analysis

**Use the deepwiki subagent for analysis:**

```
Use the deepwiki subagent to analyze the codebase at [REPOSITORY_PATH].

Perform a comprehensive analysis:
1. Map the repository structure using Glob
2. Identify the technology stack from configuration files
3. Determine the architectural pattern (microservices, monolith, MVC, etc.)
4. Identify major components and their responsibilities
5. Map integration points and dependencies
6. Identify external service connections
7. Check for multi-repository dependencies

Provide a detailed analysis report covering:
- Technology stack (languages, frameworks, databases, infrastructure)
- Architectural pattern and design principles
- Major components list with purposes
- Integration points (internal and external)
- Data models and domain entities
- Build and deployment configuration
- Testing infrastructure
- Notable patterns or conventions

Format as a structured markdown report.
```

**After analysis, display summary and proceed to Phase 2.**

---

## Phase 2: Documentation Structure Planning

**Use the deepwiki subagent for planning:**

```
Use the deepwiki subagent to create a documentation structure plan based on the previous analysis.

Design a comprehensive documentation structure for [DESTINATION_FOLDER]/:

1. Create a hierarchical folder structure for [DESTINATION_FOLDER]/ (not hardcoded "docs/")
2. Plan individual document files with purposes
3. Determine which diagram types are needed:
   - C4 Architecture diagrams (Context, Container, Component)
   - System Architecture diagram
   - Component diagrams
   - Sequence diagrams (for key workflows)
   - Data Flow diagrams
   - Deployment diagrams
   - Integration diagrams
   - Class diagrams (if OOP)
   - Activity diagrams (for complex workflows)
   - Network diagrams (if infrastructure-heavy)

4. Plan content sections for each document
5. Identify cross-references between documents
6. Consider multi-repo documentation if detected

Output the plan as:
- Complete folder/file tree structure
- For each file: purpose, key sections, required diagrams
- Estimated total pages
- Documentation dependencies and order
```

**Display the plan and proceed to Phase 3.**

---

## Phase 3: Structure Review & Finalization

**Use the deepwiki subagent for review:**

```
Use the deepwiki subagent to review and finalize the documentation plan.

Cross-validate the plan against the codebase:

1. Re-examine key parts of the codebase with Grep/Read
2. Check for missing components in the plan
3. Validate that diagram types match architecture
4. Ensure all major features are covered
5. Verify cross-repo dependencies are documented (if applicable)
6. Look for gaps in:
   - Component coverage
   - Integration points
   - Data flows
   - Infrastructure details
   - Security documentation
   - Development workflows

Provide:
- List of any missing items found
- Updated/finalized documentation structure
- Prioritized page generation order
- Confirmation that plan is complete and ready
```

**Display findings and the finalized structure. Request user confirmation before proceeding to generation.**

---

## Phase 4: Content Generation Loop

**User checkpoint:** Ask if user wants to proceed with generation.

Once confirmed, generate documentation page by page:

```
Use the deepwiki subagent to generate documentation pages in priority order.

IMPORTANT: Write all files to [DESTINATION_FOLDER]/ (the specified destination folder).

For each page in the finalized structure:

1. Announce which page is being generated
2. Gather relevant source files for this page
3. Generate the page content with:
   - Clear technical prose
   - Appropriate ASCII diagrams
   - Source file references (path:line-numbers)
   - Code examples for key patterns
   - Internal cross-references to other docs
   - Proper markdown formatting

4. Write the file to [DESTINATION_FOLDER]/ with proper path structure
5. Report completion and move to next page

Generate pages in this order:
- System overview and architecture first
- Component documentation second
- Integration and infrastructure third
- Development and operational docs last

Continue until all pages are generated.
```

**Progress reporting:** After every 3-5 pages, show progress update.

---

## Phase 5: Overview & Integration

**Use the deepwiki subagent for final integration:**

```
Use the deepwiki subagent to create the documentation overview and navigation structure.

IMPORTANT: All files should be in [DESTINATION_FOLDER]/ (the specified destination folder).

Create the final integration layer:

1. Generate [DESTINATION_FOLDER]/README.md as the documentation hub:
   - Project overview summary
   - Documentation structure with clickable links
   - Quick navigation to key sections
   - Getting started guide
   - How to use this documentation

2. Generate [DESTINATION_FOLDER]/overview/system-overview.md:
   - High-level system description
   - Key capabilities
   - Main use cases
   - Technology stack summary
   - Links to detailed architecture

3. Verify all cross-references are valid
4. Ensure all diagrams render correctly
5. Create a documentation map visual (ASCII)
6. Add any missing index files

Finalize the documentation package in [DESTINATION_FOLDER]/.
```

**Display completion summary.**

---

## Completion Report

After all phases complete, provide a summary:

### Documentation Generated
- **Location:** [REPOSITORY_PATH]/[DESTINATION_FOLDER]/
- Total pages created: [count]
- Total diagrams: [count by type]
- Lines of documentation: [estimate]

### Key Architectural Insights
[Highlight 3-5 interesting architectural findings]

### Documentation Structure
```
[DESTINATION_FOLDER]/
[Show final tree structure]
```

### Maintenance Recommendations
- Suggest triggers for updating docs (e.g., architectural changes)
- Recommend documentation review cadence
- Identify living documentation opportunities

### Next Steps
- Review generated documentation
- Validate technical accuracy
- Share with team for feedback
- Integrate into onboarding process

---

## Multi-Repository Support

If **multiple repositories** are referenced or detected:

1. Document the multi-repo architecture first
2. Show repository dependencies diagram
3. Document common/shared components
4. Link related repositories in documentation
5. Create a system-level overview spanning repos

---

## Error Handling

If any phase fails or needs clarification:
- Pause and request user guidance
- Show what was attempted
- Suggest alternative approaches
- Allow user to adjust scope

---

## Important Notes

- The deepwiki subagent will handle all technical analysis and generation
- This command orchestrates the workflow and provides user feedback
- Generation can take 10-30 minutes depending on codebase size
- User can interrupt between phases if needed
- Documentation can be regenerated or updated anytime

---

Begin Phase 1 now.