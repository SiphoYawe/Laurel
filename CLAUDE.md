# Laurel

An AI-powered habit coaching and learning optimization app that helps users achieve their New Year's resolutions using Atomic Habits methodology and evidence-based learning techniques.

## Project Context

- **Hackathon**: Commit To Change - Encode Club / Comet (Opik)
- **Duration**: January 13 - February 2026
- **Prize Category**: Personal Growth & Learning

## Key Frameworks

- `atomic-habits-framework/` - James Clear's habit formation system
- `learning-framework/` - Evidence-based learning techniques (active recall, spaced repetition)

## Tech Stack

- Opik for LLM observability and evaluation

---

## MANDATORY Development Guidelines

### Documentation First - ALWAYS

**BEFORE implementing with ANY library or tool:**

1. **Use Context7 MCP** as the PRIMARY source for documentation lookup
2. **Use Firecrawl** as a BACKUP if Context7 doesn't have the docs
3. **Read and study the documentation thoroughly** before writing any code
4. Never assume how a library works - verify with actual docs first

**For Opik specifically:** Documentation has been saved locally in this project. Check local docs first.

### Skill Discovery First - ALWAYS

**BEFORE implementing ANY feature, ALWAYS use `/find-skills` to search for available skills.**

This is MANDATORY for:

- **Expo** development
- **React Native** development
- **Supabase** integration
- **UI/UX** and frontend work
- Any new library or framework usage

**Workflow:**

1. Run `/find-skills` with a description of what you're trying to build
2. Review available skills that match your task
3. Invoke the appropriate skill(s) before writing any code
4. Only proceed with manual implementation if no relevant skill exists

**Why:** Skills contain specialized knowledge, best practices, and optimized workflows. Using the right skill ensures higher quality code and faster development.

### Design Rules - STRICTLY ENFORCED

**NO GRADIENTS - EVER**

- Do not use gradient backgrounds
- Do not use gradient text
- Do not use gradient borders
- Use solid colors ONLY throughout the entire application

**NO EMOJIS - EVER**

- Do not use emojis anywhere in the UI
- Do not use emojis in text content
- Do not use emojis in notifications/alerts
- Use icons (HugeIcons) instead when visual elements are needed

These rules apply to ALL components, pages, and features - NO EXCEPTIONS.

### Icons - HugeIcons Preferred

- **USE**: HugeIcons for all icons
- **EXCEPTION**: Lucide icons ONLY for:
  - Chevrons (chevron-up, chevron-down, chevron-left, chevron-right)
  - Arrows (arrow-up, arrow-down, arrow-left, arrow-right)
  - Reload/refresh icons
- **DO NOT** use Lucide for any other icons

### Frontend Development - ALWAYS Use Skill

**For ANY frontend-related code, ALWAYS invoke the `/frontend-design` skill first - NO EXCEPTIONS.**

This applies to:

- Creating UI components
- Building pages
- Styling
- Any visual/interface work

### CI/CD Verification - GitHub & Vercel

**ALWAYS verify builds and deployments using CLI tools and MCP.**

#### GitHub CLI (`gh`)

- Check workflow runs: `gh run list` and `gh run view <run-id>`
- View workflow logs: `gh run view <run-id> --log`
- Check PR status and checks: `gh pr checks`
- Monitor Actions: `gh run watch` for live updates
- View failed jobs: `gh run view <run-id> --log-failed`

#### Vercel CLI (`vercel`)

- Check deployment status: `vercel list`
- View deployment logs: `vercel logs <deployment-url>`
- Inspect build output: `vercel inspect <deployment-url>`
- Check environment: `vercel env list`

#### Verification Workflow

After every push:

1. Run `gh run list` to see workflow status
2. If failed, run `gh run view <run-id> --log-failed` to diagnose
3. Check Vercel deployment: `vercel list` for latest deployment
4. View Vercel logs if deployment issues: `vercel logs <url>`
5. **Do NOT proceed to next task if builds/deployments are failing**
6. Fix ALL issues before continuing

#### MCP Integration

- Use GitHub MCP tools to fetch PR details, check statuses
- Use available MCP servers to read logs and verify deployments
- Always cross-check CLI output with MCP data when available

### Git Commits - Best Practices

**NEVER add Claude as a co-author to commits.**

Do not include:

- `Co-Authored-By: Claude <noreply@anthropic.com>`
- Any variation of Claude co-authorship
- Any AI attribution in commit messages

Keep commits clean with only the human author.

**ALWAYS break up large commits into smaller, focused commits.**

- Each commit should represent ONE logical change
- Separate concerns: don't mix feature code with config changes
- Good: "Add user authentication endpoint" then "Add auth middleware" then "Add auth tests"
- Bad: "Add authentication with middleware, tests, and config updates" (all in one commit)
- If a change touches multiple unrelated areas, split it into separate commits
- Smaller commits make code review easier and git history more useful

---

## Ralph Wiggum Plugin - Iterative AI Development Loops

Ralph Wiggum is a Claude Code plugin that enables self-referential AI development loops. It allows Claude to iterate on a task repeatedly until completion.

### How It Actually Works

Ralph uses a **Stop hook** mechanism - NOT manual loop setup:

1. You run `/ralph-loop "Your task" --completion-promise "DONE" --max-iterations 50`
2. Claude works on the task
3. When Claude tries to exit, the Stop hook intercepts it
4. The hook feeds the SAME prompt back to Claude
5. Claude sees its previous work in files/git history
6. Loop continues until completion promise is detected or max iterations reached

**Key insight**: The loop happens INSIDE your Claude session via hooks. You don't set up external bash loops or manually configure anything.

### Installation

The Ralph Wiggum plugin must be installed in Claude Code. It's available in the official plugins:

- Repository: `https://github.com/anthropics/claude-code/tree/main/plugins/ralph-wiggum`

### Commands

| Command         | Description                           |
| --------------- | ------------------------------------- |
| `/ralph-loop`   | Start a Ralph loop in current session |
| `/cancel-ralph` | Cancel an active Ralph loop           |
| `/help`         | Get detailed command reference        |

### Usage Syntax

```bash
/ralph-loop "Your task description" --max-iterations <N> --completion-promise "PHRASE"
```

**Options:**

- `--max-iterations <N>` - Safety limit (ALWAYS SET THIS!)
- `--completion-promise "<text>"` - Phrase that signals completion

### Completion Promise Format

When your task is complete, output:

```
<promise>YOUR_COMPLETION_PHRASE</promise>
```

The promise MUST be wrapped in `<promise>` XML tags exactly as shown.

### Common Mistakes & Why Loops Fail

1. **Trying to manually set up a loop** - You can't just "configure" Ralph. You must use the `/ralph-loop` slash command.

2. **Not installing the plugin** - The plugin must be installed for the Stop hook to work.

3. **Missing max-iterations** - Without `--max-iterations`, the loop runs forever. Always set a limit.

4. **Wrong promise format** - The completion phrase must be in `<promise>` tags, not plain text.

5. **Unclear success criteria** - Vague prompts cause infinite loops. Be specific about what "done" means.

### Example: Good vs Bad Usage

**Bad:**

```
/ralph-loop Build a todo API and make it good
```

**Good:**

```
/ralph-loop "Build a REST API for todos. Requirements:
- CRUD endpoints working
- Input validation
- Tests passing (coverage > 80%)
- README with API docs

Output <promise>COMPLETE</promise> when ALL requirements met." --completion-promise "COMPLETE" --max-iterations 30
```

### State File

Ralph tracks state in `.claude/ralph-loop.local.md` with YAML frontmatter:

- `iteration:` - Current iteration number
- `max_iterations:` - Limit before auto-stop
- `completion_promise:` - The phrase to detect

### Stopping a Loop

1. **Normal completion**: Output `<promise>YOUR_PHRASE</promise>` when genuinely done
2. **Max iterations**: Automatically stops when limit reached
3. **Manual cancel**: Run `/cancel-ralph`
4. **Emergency**: Delete `.claude/ralph-loop.local.md` file

### When to Use Ralph

**Good for:**

- Well-defined tasks with clear success criteria
- Tasks requiring iteration (getting tests to pass)
- Greenfield projects with automatic verification
- Tasks you want to walk away from

**Not good for:**

- Tasks requiring human judgment
- One-shot operations
- Unclear success criteria
- Production debugging

### Philosophy

- Iteration > Perfection: Let the loop refine work
- Failures are data: Use them to tune prompts
- Persistence wins: Keep trying until success
- Operator skill matters: Good prompts = good results
