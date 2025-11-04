---
description: "Git workflow with best practices, branching strategies, commit conventions, and collaboration workflows. Apply when working with version control, git operations, or team collaboration tasks."
alwaysApply: true
category: "development"
priority: "high"
triggers:
  - "context: git commit, git push, git pull"
  - "keywords: git, version control, commit"
  - "file_patterns: .gitignore, .gitattributes"
---

# Git Workflow

## Branching Strategy

### Main Branches

- **main/master**: Production-ready code
- **develop**: Integration branch for features
- **feature/**: Feature development branches
- **hotfix/**: Critical bug fixes
- **release/**: Release preparation branches

### Branch Naming Conventions

- **Features**: `feature/feature-name` (e.g., `feature/user-authentication`)
- **Hotfixes**: `hotfix/issue-description` (e.g., `hotfix/login-bug`)
- **Releases**: `release/version-number` (e.g., `release/v1.2.0`)
- **Bugfixes**: `bugfix/issue-description` (e.g., `bugfix/memory-leak`)

## Commit Conventions

### Commit Message Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Commit Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks
- **perf**: Performance improvements
- **ci**: CI/CD changes

### Examples

```
feat(auth): add OAuth2 login support

fix(api): resolve memory leak in user service

docs(readme): update installation instructions

refactor(ui): extract common button component
```

## Workflow Process

### Feature Development

1. **Create Branch**: `git checkout -b feature/feature-name`
2. **Develop**: Make commits with descriptive messages
3. **Test**: Ensure all tests pass
4. **Push**: `git push origin feature/feature-name`
5. **Create PR**: Submit pull request for review
6. **Review**: Address feedback and make changes
7. **Merge**: Merge after approval
8. **Cleanup**: Delete feature branch

### Hotfix Process

1. **Create Branch**: `git checkout -b hotfix/issue-description`
2. **Fix**: Implement the fix
3. **Test**: Verify fix works
4. **Commit**: Use conventional commit format
5. **Push**: Push to remote
6. **Merge**: Merge to main and develop
7. **Tag**: Create release tag if needed

## Git Best Practices

### Before Committing

- Review changes with `git diff`
- Stage files selectively with `git add`
- Check status with `git status`
- Run tests and linting

### Commit Guidelines

- Make atomic commits (one logical change per commit)
- Write clear, descriptive commit messages
- Include relevant context in commit body
- Reference issues/tickets when applicable

### Branch Management

- Keep branches up to date with main
- Rebase feature branches before merging
- Delete merged branches
- Use meaningful branch names

### Collaboration

- Always pull latest changes before starting work
- Communicate about shared branches
- Use pull requests for code review
- Resolve conflicts promptly

## File Management

### .gitignore Best Practices

```gitignore
# Dependencies
node_modules/
*.pyc
__pycache__/

# Build outputs
dist/
build/
*.o
*.so

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Environment files
.env
.env.local
.env.*.local

# Temporary files
*.tmp
*.temp
```

### .gitattributes

```gitattributes
# Auto detect text files and perform LF normalization
* text=auto

# Force LF line endings for specific file types
*.js text eol=lf
*.ts text eol=lf
*.json text eol=lf
*.md text eol=lf

# Binary files
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.ico binary
```

## Advanced Git Features

### Stashing

- Use `git stash` to temporarily save changes
- Apply stashed changes with `git stash pop`
- List stashes with `git stash list`
- Clear stashes when no longer needed

### Rebasing

- Use `git rebase` to maintain clean history
- Interactive rebase for commit editing
- Rebase feature branches before merging
- Avoid rebasing shared/public branches

### Cherry-picking

- Use `git cherry-pick` to apply specific commits
- Useful for hotfixes and bug fixes
- Be careful with commit dependencies

## Troubleshooting

### Common Issues

- **Merge conflicts**: Resolve manually and commit
- **Detached HEAD**: Checkout to a branch
- **Lost commits**: Use `git reflog` to find them
- **Wrong commit**: Use `git reset` or `git revert`

### Recovery Commands

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Revert a specific commit
git revert <commit-hash>

# Find lost commits
git reflog

# Reset to specific commit
git reset --hard <commit-hash>
```

---

**Success Criteria**: Clean git history, proper branching, meaningful commits, and effective collaboration.
