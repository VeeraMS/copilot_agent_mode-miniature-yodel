# OctoCAT Supply Chain Demo - Complete Exploration Guide

A comprehensive, chapter-by-chapter guide to explore all the GitHub Copilot features demonstrated in this workspace.

---

## Chapter 0: Prerequisites & Setup

### 0.1 Environment Setup

You can run this either **locally** or in a **GitHub Codespace**.

```bash
# Clone the repository
git clone https://github.com/msft-common-demos/copilot_agent_mode-miniature-yodel.git
cd copilot_agent_mode-miniature-yodel
```

### 0.2 Build & Run the Application

As specified in [copilot-instructions.md](../.github/copilot-instructions.md) and [build.md](build.md):

```bash
# Install dependencies and build
npm install && npm run build

# Start the application (API + Frontend)
npm run dev
```

- **API** runs on port `3000`
- **Frontend** runs on port `5137`

### 0.3 Verify the App is Running

1. Open `http://localhost:5137` in your browser
2. You should see the OctoCAT Supply website with a hero image
3. Click on **"Products"** in the NavBar — you should see product listings
4. Click **"Add to Cart"** — note that it only shows an alert message (no real cart functionality yet)

### 0.4 Required VS Code Extensions

The `.devcontainer/devcontainer.json` lists the required extensions:

- **GitHub Copilot** (`GitHub.copilot`)
- **Docker** (`ms-azuretools.vscode-docker`)
- **Vitest Explorer** (`vitest.explorer`)
- **Markdown Mermaid** (`bierner.markdown-mermaid`)
- **Bicep** (`ms-azuretools.vscode-bicep`)
- **GitHub Pull Requests** (`GitHub.vscode-pull-request-github`)

### 0.5 MCP Server Setup (Optional — needed for Chapters 3, 4, 10, 11)

#### Playwright MCP Server (for browser testing):

1. `Cmd/Ctrl + Shift + P` → `MCP: List servers` → `playwright` → `Start server`

#### GitHub MCP Server (for GitHub integration):

1. Requires **Docker** (or Podman) installed and running
2. Requires a **GitHub PAT** with read/write permissions for Issues and PRs
3. `Cmd/Ctrl + Shift + P` → `MCP: List servers` → `github` → `Start server`
4. Enter your PAT when prompted

> **Important**: Use either `github-local` OR `github-remote`, not both!

---

## Chapter 1: Custom Prompt Files and Reusable Workflows

**What you'll learn**: How to create and use reusable prompt files with YAML frontmatter to streamline AI-native workflows.

### Steps:

1. **Explore the prompts directory**: Open the `.github/prompts/` folder in VS Code. You'll find several prompt files:
   - `demo-cart-page.prompt.md`
   - `demo-unit-test-coverage.prompt.md`
   - `model-compare.prompt.md`
   - `check-dry-violations.prompt.md`
   - `handoff-to-copilot-coding-agent.prompt.md`

2. **Understand the YAML frontmatter**: Open `model-compare.prompt.md` and notice the structure:

   ```markdown
   ---
   mode: 'agent'
   description: "Generate a markdown file with a model comparison table..."
   tools: ['fetch', 'search', 'editFiles']
   ---
   ```

   - `mode` — tells Copilot which mode to use (agent, ask, etc.)
   - `description` — describes what the prompt does
   - `tools` — lists which tools Copilot can use

3. **Run the Model Comparison prompt**:
   - Open `model-compare.prompt.md`
   - Click **"Run"** at the top of the file (or use Command Palette → `Prompts: Run Prompt`)
   - Watch as Copilot:
     - Automatically switches to Agent mode
     - Fetches live documentation from GitHub docs
     - Generates/updates `docs/model-comparison.md`

4. **Explore Custom Chat Modes**: Open the `.github/chatmodes/` directory:
   - `ModelSelection.chatmode.md` — helps choose the right AI model
   - Look for `Plan` and `BDD` modes as well
   - In Copilot Chat, notice you can switch between these modes using the mode selector

### Key Takeaway

Custom prompts provide **consistency**, reduce cognitive load, and can be **shared across teams** for standardized workflows.

---

## Chapter 2: Vision and Agent Mode — Cart Functionality

**What you'll learn**: How Copilot can understand UI design images and implement complex multi-file features.

### Approach A: Automated (Custom Prompt — Recommended)

1. Open `demo-cart-page.prompt.md` in `.github/prompts/`
2. Review the prompt structure — notice it includes:
   - Context about the current application state
   - Design reference pointing to `docs/design/cart.png`
   - Technical requirements (CartContext, Cart Icon, Cart Page, Cart Hook)
   - Key features (add/remove items, quantities, shipping calculation, localStorage persistence)
3. **Attach the cart design image**: Drag `docs/design/cart.png` into the chat or use the paperclip icon
4. Click **"Run"** to execute
5. Watch Copilot implement the entire cart system across multiple files

### Approach B: Manual (For deeper understanding)

1. **See the current state**: Open `http://localhost:5137`, go to Products, and click "Add to Cart" — notice nothing real happens

2. **Switch to Plan mode** in Copilot Chat (use the mode selector dropdown)

3. **Attach the cart design image**: Use the paperclip icon or drag/drop `docs/design/cart.png`

4. **Enter this prompt**:

   ```
   I need to implement a simple Cart Page. I also want a Cart icon in the NavBar that shows the number of items in the Cart.
   ```

5. **Review the plan**: Copilot will suggest components to add/modify. Highlight the planned changes.

6. **Switch to Agent mode** and select a good implementation model (e.g., `Claude 3.5 Sonnet`):

   ```
   Implement the changes.
   ```

7. **Review and accept** Copilot's suggested changes across multiple files

8. **Verify the result**:
   - Navigate to Products
   - Add items to the cart (watch the cart icon update)
   - Click the Cart icon to see the Cart page
   - Test adding/removing items, verify totals and shipping

9. **Build to verify**:

   ```bash
   npm run build
   ```

### Key Takeaway

Copilot **Vision** detects design patterns from images, and **Agent Mode** can implement complex changes across multiple files autonomously.

---

## Chapter 3: MCP Servers — Playwright (Browser Testing)

**What you'll learn**: How MCP servers extend Copilot's capabilities for functional testing.

> **Prerequisite**: Playwright MCP Server must be running (see Chapter 0.5). This demo does **not** work in a Codespace — you need local VS Code.

### Part 1: BDD Feature File Generation

1. **Switch to BDD mode** in Copilot Chat (use the mode selector)
2. Enter:

   ```
   add a feature to test the cart icon and page
   ```

3. Copilot generates comprehensive **Gherkin feature files** (.feature) with behavioral test scenarios
4. Review the generated scenarios

### Part 2: Playwright Browser Testing

1. **Switch to Agent mode**
2. Enter:

   ```
   browse to http://localhost:5137 and execute the test steps
   ```

3. **Accept** the Playwright command requests when prompted
4. Watch Copilot launch a browser and execute the test steps
5. (Optional) Ask Copilot:

   ```
   generate headless Playwright tests for the .feature file
   ```

### Key Takeaway

MCP servers extend Copilot's capabilities while custom prompts standardize testing approaches across teams.

---

## Chapter 4: MCP Servers — GitHub Integration

**What you'll learn**: How to interact with GitHub directly from Copilot Chat.

> **Prerequisite**: GitHub MCP Server must be running (see Chapter 0.5)

### Steps:

1. **Switch to Agent mode** in Copilot Chat

2. **Check your assigned issues**:

   ```
   check which issues are assigned to me in the repo
   ```

   Watch Copilot fetch issues from GitHub

3. **Create a new issue**:

   ```
   create an Issue for enhancing test coverage in the API project and assign it to me
   ```

   Verify that Copilot creates an Issue with meaningful description and labels

4. **View the issue**: Open the GitHub repository in a browser and find the newly created issue

5. (Optional) **Assign to Coding Agent**: Assign the issue to Copilot to trigger the Coding Agent

### Key Takeaway

The GitHub MCP server lets you manage your repository workflow without leaving VS Code.

---

## Chapter 5: Enhancing Unit Tests and Coverage

**What you'll learn**: How Copilot generates tests, validates them, analyzes coverage, and self-heals.

### Approach A: Custom Prompt (Automated)

1. Open the `demo-unit-test-coverage.prompt.md` file in `.github/prompts/`
2. Review the prompt structure — it includes coverage requirements, CRUD operations, error handling specs
3. Click **"Run"** to execute
4. Watch Copilot:
   - Create comprehensive test files for Product and Supplier routes
   - Run the tests
   - Analyze coverage
   - **Self-heal** when tests fail (fix and re-run)

### Approach B: Manual Chat

1. Open Copilot Chat in **Agent mode**
2. Enter:

   ```
   run tests, analyze coverage and add missing Branch tests to include tests for untested scenarios
   ```

3. Watch Agent mode:
   - Run existing tests
   - Analyze coverage gaps
   - Generate new tests for the API Branch route
   - **Self-heal** if tests fail (modify and retry)

4. Accept the changes

5. **Add more tests manually**:

   ```
   add tests for the Product route
   ```

6. **Verify tests pass**:

   ```bash
   npm run test:api
   ```

### Coding Agent Option

There should be an Issue #1 in the repo for improving code coverage. You can assign this to Copilot Coding Agent — it takes ~15 minutes to complete.

### Key Takeaway

Copilot can **generate**, **execute**, **analyze**, and **self-heal** tests automatically.

---

## Chapter 6: Automating Deployment with GitHub Actions, Azure & Bicep

**What you'll learn**: How Copilot generates CI/CD workflows and Infrastructure-as-Code.

> **Prerequisites**:
> - Azure CLI (`az login`) with owner permissions on a subscription
> - GitHub CLI (`gh auth login`)

### Steps:

1. **Configure the deployment environment** (one-time setup):

   ```bash
   ./infra/configure-deployment.sh <repo-name>
   ```

   This creates (as documented in [deployment.md](deployment.md)):
   - Azure Service Principal with OIDC
   - 2 Resource Groups (Staging + Prod)
   - Azure Container Registry
   - GitHub Environments (Staging, Prod with manual approval)
   - GitHub Actions Variables

2. **Add context to Copilot**: Open `docs/deployment.md` and add it as context in Copilot Chat

3. **Generate infrastructure and workflows**:

   ```
   generate bicep files and workflows according to the deployment plan
   ```

4. **Review generated files**:
   - GitHub Actions YAML for build & test
   - GitHub Actions YAML for deploy with approval step
   - Bicep files for Azure infrastructure

5. **Accept the changes**, commit and push

6. **Watch the pipeline execute** in the GitHub Actions tab

### Key Takeaway

Copilot can generate complete deployment pipelines and infrastructure code from natural language descriptions.

---

## Chapter 7: Custom Instructions and Repository Configuration

**What you'll learn**: How to personalize Copilot for internal libraries, coding standards, and team practices.

### Steps:

1. **Review the existing custom instructions**: Open `.github/copilot-instructions.md`
   - Notice it contains: repo info, architecture references, build instructions

2. **Review the TAO documentation**: Open `docs/tao.md` — this is a **fictional** internal observability library

3. **Enhance the custom instructions**: Add guidelines for REST APIs:

   ```markdown
   # Additional Guidelines for REST APIs

   For REST APIs, use the following guidelines:

   * Use descriptive naming
   * Add Swagger docs for all API methods
   * Implement logging and monitoring using [TAO](../docs/tao.md)
     - assume TAO is installed and never add the package
   ```

4. **Test with Copilot**: In Agent mode, enter:

   ```
   add observability to the Supplier route using our internal standards
   ```

5. **Observe how Copilot uses TAO**: Even though TAO is fictional and not in any public training data, Copilot implements it correctly based on your custom instructions

6. **Note**: The code **won't compile** since TAO doesn't exist — this demonstrates how custom instructions reference internal frameworks

### Key Takeaway

Custom instructions allow teams to encode their **specific practices, internal libraries, and coding standards** into Copilot's behavior.

---

## Chapter 8: Copilot and Application Security

**What you'll learn**: How Copilot identifies and remediates security vulnerabilities.

### Part 1: Copilot Security Analysis

1. Open Copilot Chat and switch to **Ask** mode
2. Enter:

   ```
   analyze @workspace and check if there are obvious security vulnerabilities
   ```

3. You should see issues like:
   - Cross-site Scripting (XSS) vulnerability
   - Command Injection Vulnerability
   - Insecure CORS Configuration
   - Missing Security Headers
   - Insecure Authentication Implementation

4. **Fix a vulnerability**:

   ```
   generate a fix for [specific vulnerability from the list]
   ```

5. (Optional, with GitHub MCP Server):

   ```
   create an issue to fix [vulnerability name]
   ```

### Part 2: GHAS (GitHub Advanced Security) and Autofix

1. Open the GitHub repository in a browser
2. Navigate to **Settings** → enable **Code scanning**
3. Wait for the scan to complete — it should find at least 1 vulnerability
4. Click **"Generate fix"** to see Copilot auto-generate a fix
5. Use **Chat** to discuss the vulnerability:

   ```
   explain this vulnerability and fix
   ```

### Key Takeaway

Copilot helps **scale AppSec** by bringing security expertise directly to developers.

---

## Chapter 9: Session Handoff — `/handoff` Prompt

**What you'll learn**: How to preserve context between Copilot sessions using custom prompts.

### Steps:

1. Open Copilot Chat and switch to **Plan** mode

2. Start a planning session:

   ```
   I want to add Personal Profile page to the app that shows the user profile and their purchases.
   ```

3. **Refine the plan**: Ask Copilot to modify it:

   ```
   remove the purchases part from the plan
   ```

4. **Explain the problem**: The conversation context grows over time. Custom prompts can create clean handoffs.

5. **Run the handoff**: Switch to **Agent** mode and type:

   ```
   /handoff
   ```

   This creates a clean summary without noise from the conversation.

### Key Takeaway

Custom prompts can **control context**, drop unnecessary information, and efficiently hand off work between sessions.

---

## Chapter 10: Handoff to Copilot Coding Agent

**What you'll learn**: How to hand off planned work to the async Coding Agent.

> **Prerequisite**: Remote GitHub MCP Server must be running

### Steps:

1. Open Copilot Chat and switch to **Plan** mode

2. Plan a feature:

   ```
   I want to add Personal Profile page to the app that shows the user profile and their purchases.
   ```

3. Refine the plan (e.g., remove the `purchases` part)

4. **Review the handoff prompt**: Open `handoff-to-copilot-coding-agent.prompt.md` and notice:
   - YAML frontmatter configuring Agent mode
   - Internal thinking process (in HTML comments)
   - Structured issue template for consistent handoffs
   - Tool usage: `changes`, `create_issue`, `assign_copilot_to_issue`

5. **Switch to Agent mode** and run:

   ```
   /handoff-to-copilot-coding-agent
   ```

6. **View the result**:
   - Open GitHub repository
   - Find the new issue — it's assigned to GitHub Copilot Coding Agent
   - The agent starts working asynchronously

7. You can now **close VS Code** and let the Coding Agent work!

### Key Takeaway

Custom prompts can encapsulate IDE tools and MCP tool calls into cohesive **async workflows**.

---

## Chapter 11: Parallel Experimentation with Coding Agent

**What you'll learn**: How to use the Coding Agent to test multiple design approaches simultaneously.

> **Prerequisite**: Remote GitHub MCP Server must be running

### Steps:

1. Ensure the GitHub Remote MCP server is running

2. Run the parallel experimentation prompt:
   - Use Command Palette → `Prompts: Run Prompt` → select `demo-cca-parallel`
   - Or open `demo-cca-parallel.prompt.md` and click **Run**

3. **What happens**:
   - Copilot analyzes the repo
   - Creates **3 different visual design approaches** for the Cart Page
   - Creates an **Epic issue** called "Cart Page Experimentation"
   - Creates **3 sub-issues** (one per design)
   - **Assigns the Coding Agent** to each sub-issue

4. **Wait for results**: The Coding Agent takes ~20 minutes per implementation

5. **Review the results**: Each implementation will be on a separate branch — compare the approaches and choose your favorite

### Key Takeaway

Experimentation becomes **fast and cheap** when you can run multiple approaches in parallel with the Coding Agent.

---

## Chapter 12: DRY Violation Analysis

**What you'll learn**: How to use Copilot to analyze code quality and identify duplication.

### Steps:

1. Open `check-dry-violations.prompt.md` in `.github/prompts/` and review:
   - Areas to analyze (route files, entity models, etc.)
   - Analysis framework with severity ratings
   - Recommended refactoring patterns

2. **Run the prompt**: Click "Run" or use Command Palette

3. **Review the output**:
   - File-by-file analysis of duplication
   - Severity assessment
   - Prioritized action plan (Quick Wins, Medium Efforts, Large Projects)
   - Before/after code examples

### Key Takeaway

Custom prompts can encode **code quality standards** and automate periodic codebase health checks.

---

## Chapter 13: Model Selection Chat Mode

**What you'll learn**: How to use a custom chat mode to choose the right AI model for your task.

### Steps:

1. Switch to **ModelSelection** mode in Copilot Chat (see `.github/chatmodes/ModelSelection.chatmode.md`)

2. Ask about a specific task:

   ```
   I want to refactor the Supplier route to improve error handling
   ```

3. **Review Copilot's response** — it will:
   - List ALL available models
   - Summarize pros/cons for each
   - Include cost and performance considerations
   - Recommend the best model for **planning** vs **implementation**

4. **Note the constraints**: This mode will NOT suggest code changes — it only recommends models

5. Compare with `docs/model-comparison.md` for reference

### Key Takeaway

Custom chat modes can **constrain** Copilot's behavior to specific tasks — in this case, purely advisory model selection.

---

## Quick Reference: Command Cheat Sheet

| Action | Command |
|--------|---------|
| Build all | `npm run build` |
| Run dev servers | `npm run dev` |
| Run API tests | `npm run test:api` |
| Run a prompt | `Cmd/Ctrl+Shift+P` → `Prompts: Run Prompt` |
| Start MCP server | `Cmd/Ctrl+Shift+P` → `MCP: List servers` |
| Switch chat mode | Use the mode selector in Copilot Chat |

## Key Files Reference

| File | Purpose |
|------|---------|
| `docs/architecture.md` | System architecture |
| `docs/demo-script.md` | Full demo script |
| `docs/deployment.md` | Deployment plan |
| `docs/tao.md` | Fictional observability library |
| `.github/copilot-instructions.md` | Custom instructions |
| `infra/configure-deployment.sh` | Azure setup script |

---

> **Pro Tips** from the README:
> - Practice demos before customer presentations
> - Copilot is **non-deterministic** — be ready to adapt
> - Mix and match scenarios based on your audience
> - Keep your GitHub PAT handy for MCP demos
