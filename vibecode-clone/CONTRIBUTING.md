# Contributing to Vibecode Clone

Thank you for your interest in contributing to Vibecode Clone! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Bug Reports](#bug-reports)
- [Feature Requests](#feature-requests)

## Code of Conduct

We are committed to providing a welcoming and inclusive experience for everyone. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- PostgreSQL 14+
- Redis 7+
- Docker and Docker Compose
- Git

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/vibecode-clone.git
   cd vibecode-clone
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Database Setup**
   ```bash
   npm run db:setup
   ```

5. **Start Development Servers**
   ```bash
   npm run dev
   ```

This will start:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- AI Agent Manager: http://localhost:8001

## Project Structure

```
vibecode-clone/
├── frontend/           # Next.js React application
├── backend/            # Node.js API server
├── ai-agent-manager/   # AI agent orchestration service
├── shared/             # Shared types and utilities
├── database/           # Database schemas and migrations
├── docker/             # Docker configurations
├── docs/               # Documentation
├── templates/          # Project templates
└── tests/              # End-to-end tests
```

## Development Workflow

### Branching Strategy

We use a Git Flow inspired branching model:

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: Feature development branches
- `hotfix/*`: Critical bug fixes
- `release/*`: Release preparation branches

### Creating a Feature Branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

### Making Changes

1. Make your changes in small, logical commits
2. Write or update tests as needed
3. Update documentation if necessary
4. Ensure all tests pass
5. Follow our coding standards

### Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): add OAuth integration with GitHub

fix(workspace): resolve file synchronization issue

docs(api): update authentication endpoint documentation

test(collaboration): add real-time editing tests
```

## Coding Standards

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Prefer `const` over `let`, avoid `var`
- Use async/await over Promises when possible

### React/Frontend

- Use functional components with hooks
- Follow React best practices and patterns
- Use TypeScript for prop types
- Implement proper error boundaries
- Optimize for performance (memo, useMemo, useCallback)

### Node.js/Backend

- Use async/await for asynchronous operations
- Implement proper error handling
- Use middleware for cross-cutting concerns
- Follow RESTful API design principles
- Implement proper logging and monitoring

### Database

- Use Prisma schema for database models
- Write migrations for schema changes
- Use proper indexing for performance
- Follow normalization principles
- Implement proper foreign key constraints

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:frontend
npm run test:backend
npm run test:agents
npm run test:e2e

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Types

1. **Unit Tests**: Test individual functions and components
2. **Integration Tests**: Test interactions between components
3. **End-to-End Tests**: Test complete user workflows
4. **API Tests**: Test API endpoints and responses

### Writing Tests

- Write tests for new features and bug fixes
- Aim for high test coverage (>80%)
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Mock external dependencies appropriately

**Example Test:**
```typescript
describe('UserService', () => {
  it('should create a new user with valid data', async () => {
    // Arrange
    const userData = {
      email: 'test@example.com',
      password: 'securePassword',
      name: 'Test User'
    }

    // Act
    const user = await UserService.createUser(userData)

    // Assert
    expect(user).toBeDefined()
    expect(user.email).toBe(userData.email)
    expect(user.password).not.toBe(userData.password) // Should be hashed
  })
})
```

## Submitting Changes

### Pull Request Process

1. **Ensure your branch is up to date**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout feature/your-feature-name
   git rebase develop
   ```

2. **Run tests and linting**
   ```bash
   npm test
   npm run lint
   ```

3. **Push your changes**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a Pull Request**
   - Use a descriptive title
   - Fill out the PR template
   - Link related issues
   - Add screenshots for UI changes
   - Request reviews from relevant team members

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added/updated tests
- [ ] Manual testing completed

## Screenshots (if applicable)

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or properly documented)
```

### Review Process

1. **Automated Checks**: All CI checks must pass
2. **Code Review**: At least one team member must approve
3. **Testing**: QA testing for significant changes
4. **Merge**: Squash and merge to develop branch

## Bug Reports

### Before Submitting

1. Check if the bug has already been reported
2. Try to reproduce the issue
3. Gather relevant information (browser, OS, steps to reproduce)

### Bug Report Template

```markdown
**Bug Description**
A clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: [e.g. macOS 12.0]
- Browser: [e.g. Chrome 96]
- Version: [e.g. 1.0.0]

**Screenshots**
Add screenshots if applicable

**Additional Context**
Any other relevant information
```

## Feature Requests

### Before Submitting

1. Check if the feature has already been requested
2. Consider if it aligns with project goals
3. Think about implementation complexity

### Feature Request Template

```markdown
**Feature Description**
A clear description of the feature

**Problem/Use Case**
What problem does this solve?

**Proposed Solution**
How should this feature work?

**Alternatives Considered**
Other solutions you've considered

**Additional Context**
Any other relevant information
```

## Development Guidelines

### Performance Considerations

- Optimize database queries
- Implement proper caching strategies
- Use lazy loading where appropriate
- Monitor bundle sizes
- Implement proper pagination

### Security Best Practices

- Validate all user inputs
- Use parameterized queries
- Implement proper authentication
- Follow OWASP guidelines
- Keep dependencies updated

### Accessibility

- Follow WCAG 2.1 guidelines
- Use semantic HTML
- Implement proper ARIA labels
- Ensure keyboard navigation
- Test with screen readers

### Documentation

- Keep README files updated
- Document API changes
- Add inline code comments
- Update architecture diagrams
- Maintain changelog

## Getting Help

### Community Resources

- **Discussions**: GitHub Discussions for questions and ideas
- **Discord**: Real-time chat with the community
- **Documentation**: Comprehensive docs at `/docs`
- **Examples**: Sample code and tutorials

### Contact

- **Issues**: GitHub Issues for bugs and features
- **Email**: dev@vibecode.dev for private matters
- **Twitter**: @VibecodeDev for announcements

## Recognition

Contributors will be recognized in:
- README contributors section
- Release notes for significant contributions
- Annual contributor awards
- Community highlights

Thank you for contributing to Vibecode Clone! 🚀