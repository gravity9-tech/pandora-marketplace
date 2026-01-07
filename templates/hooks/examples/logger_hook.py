#!/usr/bin/env python3
"""
Claude Code Event Logger
Logs all Claude Code lifecycle events to log.md in the project root with timestamps
"""

import sys
import json
import os
from datetime import datetime
from pathlib import Path


def get_timestamp():
    """Get current timestamp in readable format"""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def get_log_file_path():
    """Get the path to log.md in project root"""
    project_dir = os.environ.get("CLAUDE_PROJECT_DIR", os.getcwd())
    return Path(project_dir) / "log.md"


def append_to_log(message):
    """Append a message to the log file"""
    log_file = get_log_file_path()
    
    # Create log file if it doesn't exist
    if not log_file.exists():
        with open(log_file, "w") as f:
            f.write("# Claude Code Event Log\n\n")
    
    # Append the message
    with open(log_file, "a") as f:
        f.write(f"{message}\n\n")


def log_session_start(data):
    """Log session start event"""
    timestamp = get_timestamp()
    source = data.get("source", "unknown")
    session_id = data.get("session_id", "unknown")
    
    message = f"## Session Started\n"
    message += f"**Time:** {timestamp}\n"
    message += f"**Source:** {source}\n"
    message += f"**Session ID:** {session_id}"
    
    append_to_log(message)


def log_user_prompt(data):
    """Log user prompt submission"""
    timestamp = get_timestamp()
    prompt = data.get("prompt", "")
    session_id = data.get("session_id", "unknown")
    
    # Truncate very long prompts for readability
    display_prompt = prompt[:200] + "..." if len(prompt) > 200 else prompt
    
    message = f"## User Prompt Submitted\n"
    message += f"**Time:** {timestamp}\n"
    message += f"**Session ID:** {session_id}\n"
    message += f"**Prompt:** {display_prompt}"
    
    append_to_log(message)


def log_pre_tool_use(data):
    """Log before tool execution"""
    timestamp = get_timestamp()
    tool_name = data.get("tool_name", "unknown")
    tool_input = data.get("tool_input", {})
    
    message = f"## Tool Invoked (Pre-execution)\n"
    message += f"**Time:** {timestamp}\n"
    message += f"**Tool:** {tool_name}\n"
    
    # Add specific details for certain tools
    if tool_name == "Task":
        message += f"**Type:** Subagent\n"
        message += f"**Task:** {tool_input.get('task', 'N/A')}"
    elif tool_name == "Bash":
        message += f"**Type:** Command\n"
        message += f"**Command:** {tool_input.get('command', 'N/A')}"
    elif tool_name in ["Write", "Edit", "MultiEdit", "Read"]:
        message += f"**Type:** File Operation\n"
        if "file_path" in tool_input:
            message += f"**File:** {tool_input['file_path']}"
        elif "path" in tool_input:
            message += f"**File:** {tool_input['path']}"
    else:
        message += f"**Input:** {json.dumps(tool_input, indent=2)[:200]}"
    
    append_to_log(message)


def log_post_tool_use(data):
    """Log after tool execution"""
    timestamp = get_timestamp()
    tool_name = data.get("tool_name", "unknown")
    tool_response = data.get("tool_response", {})
    
    message = f"## Tool Completed (Post-execution)\n"
    message += f"**Time:** {timestamp}\n"
    message += f"**Tool:** {tool_name}\n"
    
    # Log success/error status
    if isinstance(tool_response, dict):
        if "error" in tool_response:
            message += f"**Status:** Error - {tool_response.get('error', 'Unknown error')}"
        else:
            message += f"**Status:** Success"
    else:
        message += f"**Status:** Completed"
    
    append_to_log(message)


def log_stop(data):
    """Log session stop event"""
    timestamp = get_timestamp()
    
    message = f"## Session Stopped\n"
    message += f"**Time:** {timestamp}\n"
    message += f"**Status:** Claude finished responding"
    
    append_to_log(message)


def log_subagent_stop(data):
    """Log subagent stop event"""
    timestamp = get_timestamp()
    
    message = f"## Subagent Stopped\n"
    message += f"**Time:** {timestamp}\n"
    message += f"**Status:** Subagent task completed"
    
    append_to_log(message)


def log_pre_compact(data):
    """Log before compaction"""
    timestamp = get_timestamp()
    trigger = data.get("trigger", "unknown")
    custom_instructions = data.get("custom_instructions", "")
    
    message = f"## Pre-Compact Event\n"
    message += f"**Time:** {timestamp}\n"
    message += f"**Trigger:** {trigger}\n"
    if custom_instructions:
        message += f"**Custom Instructions:** {custom_instructions[:200]}"
    
    append_to_log(message)


def log_notification(data):
    """Log notification events"""
    timestamp = get_timestamp()
    notification_type = data.get("type", "unknown")
    notification_message = data.get("message", "")
    
    message = f"## Notification\n"
    message += f"**Time:** {timestamp}\n"
    message += f"**Type:** {notification_type}\n"
    message += f"**Message:** {notification_message}"
    
    append_to_log(message)


def main():
    """Main entry point for the logger"""
    try:
        # Read the hook data from stdin
        input_data = sys.stdin.read().strip()
        
        if not input_data:
            print("No hook data received", file=sys.stderr)
            sys.exit(0)
        
        # Parse the JSON data
        hook_data = json.loads(input_data)
        
        # Determine the hook type from environment or data
        # Claude Code passes different data structures for different hooks
        
        # Check for specific hook indicators
        if "source" in hook_data and "session_id" in hook_data:
            log_session_start(hook_data)
        elif "prompt" in hook_data:
            log_user_prompt(hook_data)
        elif "tool_name" in hook_data and "tool_input" in hook_data:
            # This is PreToolUse
            log_pre_tool_use(hook_data)
        elif "tool_name" in hook_data and "tool_response" in hook_data:
            # This is PostToolUse
            log_post_tool_use(hook_data)
        elif "trigger" in hook_data:
            # This is PreCompact
            log_pre_compact(hook_data)
        elif "stop_hook_active" in hook_data:
            # Check if it's a subagent stop or regular stop
            # This requires checking the context, for now we'll log as Stop
            log_stop(hook_data)
        elif "type" in hook_data and "message" in hook_data:
            log_notification(hook_data)
        else:
            # Generic logging for unknown hook types
            timestamp = get_timestamp()
            message = f"## Unknown Event\n"
            message += f"**Time:** {timestamp}\n"
            message += f"**Data:** {json.dumps(hook_data, indent=2)[:500]}"
            append_to_log(message)
        
        # Exit successfully
        sys.exit(0)
        
    except json.JSONDecodeError as e:
        print(f"Error parsing hook data: {e}", file=sys.stderr)
        sys.exit(0)  # Don't block on errors
    except Exception as e:
        print(f"Error in logger: {e}", file=sys.stderr)
        sys.exit(0)  # Don't block on errors


if __name__ == "__main__":
    main()