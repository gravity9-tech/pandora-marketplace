
## Integrating with LaunchDarkly MCP
1. Install LaunchDarkly MCP server
```bash
npm install -g @launchdarkly/mcp-server
 ```
2. Generate your personal token here: https://app.launchdarkly.com/settings/authorization roles:
3. Set the **LAUNCHDARKLY_API_KEY** as an environment variable before running scans:
    - **Linux/macOS:** `export LAUNCHDARKLY_API_KEY=<your_token>` or `echo "export LAUNCHDARKLY_API_KEY=<TOKEN>" >> ~/.zshrc or ~/.bashrc` or modify `~/.zshrc | .bashrc` file
    - **Windows (PowerShell):** `$env:LAUNCHDARKLY_API_KEY = "<your_token>"` or add env in UI
