#!/usr/bin/env python3
"""
SessionStart Hook: Disable All MCP Servers

Purpose:
    This hook disables all MCP (Model Context Protocol) servers when a Claude Code
    session starts. It retrieves the list of active MCP servers and disables each one
    individually. This affects only the current session and does not modify configuration files.

Execution Type:
    Command (bash) or can be invoked as a Python script

Usage:
    Configure in Claude Code settings:
    {
      "hooks": {
        "SessionStart": {
          "command": "python /path/to/session_start.py"
        }
      }
    }

Examples:
    - Disable all MCP servers on session initialization for a clean session
    - Optimize context window usage by disabling unused servers
    - Enforce clean session state across team
"""

import subprocess
import sys
import re
from typing import List, Set


def run_command(cmd: List[str]) -> tuple[bool, str]:
    """
    Execute a shell command and return success status and output.

    Args:
        cmd: Command as list of arguments

    Returns:
        Tuple of (success: bool, output: str)
    """
    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=30
        )
        return result.returncode == 0, result.stdout + result.stderr
    except subprocess.TimeoutExpired:
        return False, f"Command timeout: {' '.join(cmd)}"
    except FileNotFoundError:
        return False, f"Command not found: {cmd[0]}"
    except Exception as e:
        return False, f"Unexpected error: {str(e)}"


def get_enabled_mcp_servers() -> Set[str]:
    """
    Get the list of currently enabled MCP servers using 'claude mcp status'.

    Returns:
        Set of enabled server names
    """
    success, output = run_command(["claude", "mcp", "status"])

    if not success:
        print("⚠ Could not retrieve MCP server status")
        return set()

    # Parse output to extract enabled servers
    # Typically shows servers with their status (enabled/disabled)
    enabled_servers = set()
    for line in output.split('\n'):
        # Look for lines that indicate enabled servers
        if 'enabled' in line.lower() and '✓' in line:
            # Extract server name (typically before the status indicator)
            parts = line.split()
            if parts:
                server_name = parts[0].strip('✓').strip()
                enabled_servers.add(server_name)

    return enabled_servers


def disable_mcp_server(server_name: str) -> bool:
    """
    Disable a specific MCP server.

    Args:
        server_name: Name of the MCP server to disable

    Returns:
        True if successfully disabled, False otherwise
    """
    success, output = run_command(["claude", "mcp", "disable", server_name])

    if success:
        print(f"✓ Disabled {server_name}")
        return True
    elif "already disabled" in output.lower():
        print(f"✓ {server_name} (already disabled)")
        return True
    else:
        print(f"✗ Failed to disable {server_name}: {output.strip()}")
        return False


def disable_all_mcp_servers() -> bool:
    """
    Disable all enabled MCP servers.

    Returns:
        True if all servers disabled successfully, False if any failed
    """
    print("🔧 SessionStart Hook: Disabling all MCP servers...")

    # Get list of enabled servers
    enabled_servers = get_enabled_mcp_servers()

    if not enabled_servers:
        print("✓ No MCP servers to disable")
        return True

    print(f"Found {len(enabled_servers)} enabled server(s): {', '.join(enabled_servers)}")

    # Disable each server individually
    all_disabled = True
    for server_name in enabled_servers:
        if not disable_mcp_server(server_name):
            all_disabled = False

    return all_disabled


def main() -> int:
    """
    Main entry point for the SessionStart hook.

    Returns:
        0 on success, 1 on failure
    """
    try:
        if disable_all_mcp_servers():
            print("✓ SessionStart hook completed successfully")
            return 0
        else:
            print("⚠ SessionStart hook completed with warnings")
            # Return 0 to allow session to continue even if some servers fail to disable
            return 0
    except Exception as e:
        print(f"✗ SessionStart hook failed: {str(e)}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
