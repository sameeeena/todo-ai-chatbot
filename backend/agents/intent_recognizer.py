"""
Intent Recognizer for TodoChatAgent
Parses natural language input and determines the appropriate action
"""
import re
from typing import Dict, Any, Optional


def recognize_intent(text: str) -> Dict[str, Any]:
    """
    Recognize the intent from user input text and extract relevant parameters
    """
    text_lower = text.lower().strip()

    # Define patterns for different actions
    # Add task patterns
    add_patterns = [
        r'(add|create|make|put|set|remember|note|save|record).*?(?:task|todo|thing|item|to-do)',
        r'(add|create|make|put|set|remember|note|save|record).*?(?:a|the|an)?\s*(.+?)(?:\s+(?:to|on|by)\s+|$)',
        r'(i\s+want|let\'s|i\'d\s+like|please|can\s+i).*?(add|create|make|remember|note|save|record).*?(?:a|the|an)?\s*(.+?)(?:\s+(?:to|on|by)\s+|$)'
    ]

    # List tasks patterns
    list_patterns = [
        r'(show|list|display|see|view|get|fetch|find|tell me|what are|what\'s).*?(?:my|the|all|current|existing)?\s*(?:tasks|todos|things|items|to-dos)',
        r'(what|what\'s|whats).*?(?:do|did|have|got|on|in|for me).*?(?:my|the|current|existing)?\s*(?:tasks|todos|things|items|to-dos)',
        r'(list|show|view|display).*?(?:my|the|all|current|existing)?\s*(?:tasks|todos|things|items|to-dos)',
        r'what.*?(?:do|did|have|got|on|in|for me).*?today',
        r'what.*?(?:do|did|have|got|on|in|for me).*?tomorrow'
    ]

    # Extract potential task number/identifier from the text
    task_number_match = re.search(r'(?:task|number|#)\s*(\d+)', text_lower)
    task_number = int(task_number_match.group(1)) if task_number_match else None

    # Complete task patterns
    complete_patterns = [
        r'(complete|finish|done|finished|mark.*?as.*?done|check|tick|accomplish|achieve|fulfill).*?(?:task|todo|thing|item|to-do)',
        r'(done|completed|finished|marked).*?(?:task|todo|thing|item|to-do)',
        r'(i\'?ve|we\'?ve|i have|we have).*?(completed|finished|done|done with|finished with).*?(?:task|todo|thing|item|to-do)',
        r'mark.*?(?:as|to be|is|are).*?(complete|done|finished)',
        r'(complete|finish|mark as done|check off).*?\s*(?:task|number|#)?\s*(\d+)',
        r'(mark|complete|finish).*?\s*(?:task|number|#)?\s*(\d+)\s*(?:as)?\s*(?:complete|done|finished)'
    ]

    # Delete task patterns
    delete_patterns = [
        r'(delete|remove|cancel|erase|eliminate|get rid of|throw away|dispose of).*?(?:task|todo|thing|item|to-do)',
        r'(remove|delete|cancel|get rid of|throw away|dispose of).*?(?:my|the|a|an)?\s*(.+?)(?:\s+(?:from|off|out|of)\s+|$)',
        r'never mind|forget it|cancel that|scrap that|abort that'
    ]

    # Update task patterns
    update_patterns = [
        r'(change|update|modify|edit|alter|adjust|revise|reword|rename|switch|transform|update).*?(?:task|todo|thing|item|to-do)',
        r'(change|update|modify|edit|alter|adjust|revise|reword|rename|switch|transform|update).*?(?:a|the|my|an)?\s*(.+?)(?:\s+(?:to|as|into|with)\s+|by|\s*$)',
        r'(make|change|update).*?(?:a|the|my|an)?\s*(.+?)\s+(more|less|different|important|urgent|critical|normal|regular|standard)',
        r'(make|change|update).*?(?:a|the|my|an)?\s*(.+?)\s+(high|higher|low|lower|medium|normal|regular|standard)\s*(?:priority|important|urgent)'
    ]

    # Check for add task intent
    for pattern in add_patterns:
        match = re.search(pattern, text_lower)
        if match:
            # Extract the task description if available
            groups = match.groups()
            if len(groups) > 1 and groups[1]:
                description = groups[1].strip()
            else:
                # Extract everything after the verb if no specific group
                verb_match = re.search(r'(add|create|make|remember|note|save|record)', text_lower)
                if verb_match:
                    pos = verb_match.end()
                    description = text_lower[pos:].strip()
                else:
                    description = text_lower

            # Clean up description
            description = re.sub(r'(a |the |an )', '', description, 1)

            return {
                "action": "add_task",
                "description": description.strip(),
                "title": description.strip(),  # Use description as title for now
                "task_number": task_number
            }

    # Check for list tasks intent
    for pattern in list_patterns:
        if re.search(pattern, text_lower):
            # Check if user specified a status
            status = None
            if 'completed' in text_lower or 'done' in text_lower:
                status = "completed"
            elif 'pending' in text_lower or 'not done' in text_lower or 'not finished' in text_lower:
                status = "pending"
            elif 'in progress' in text_lower or 'working on' in text_lower:
                status = "in_progress"

            return {
                "action": "list_tasks",
                "status": status,
                "task_number": task_number
            }

    # Check for complete task intent
    for pattern in complete_patterns:
        match = re.search(pattern, text_lower)
        if match:
            groups = match.groups()
            # Extract task number if available in the match
            extracted_task_number = None
            if groups and len(groups) > 0 and groups[0] and groups[0].isdigit():
                extracted_task_number = int(groups[0])

            return {
                "action": "complete_task",
                "task_number": extracted_task_number or task_number
            }

    # Check for delete task intent
    for pattern in delete_patterns:
        match = re.search(pattern, text_lower)
        if match:
            groups = match.groups()
            if len(groups) > 0 and groups[0]:
                description = groups[0].strip()
            else:
                description = text_lower

            return {
                "action": "delete_task",
                "description": description,
                "task_number": task_number
            }

    # Check for update task intent
    for pattern in update_patterns:
        match = re.search(pattern, text_lower)
        if match:
            groups = match.groups()
            if len(groups) > 1 and groups[1]:
                description = groups[1].strip()
            else:
                description = text_lower

            # Check for priority indicators
            priority = None
            if 'high' in text_lower or 'urgent' in text_lower or 'critical' in text_lower:
                priority = 'high'
            elif 'low' in text_lower or 'not urgent' in text_lower or 'not critical' in text_lower:
                priority = 'low'
            elif 'medium' in text_lower or 'normal' in text_lower or 'regular' in text_lower or 'standard' in text_lower:
                priority = 'medium'

            # Check for status indicators
            status = None
            if 'in progress' in text_lower or 'working on' in text_lower:
                status = 'in_progress'
            elif 'completed' in text_lower or 'done' in text_lower:
                status = 'completed'
            elif 'pending' in text_lower:
                status = 'pending'

            return {
                "action": "update_task",
                "description": description,
                "priority": priority,
                "status": status,
                "task_number": task_number
            }

    # If no specific intent is recognized, return a default
    return {
        "action": "unknown",
        "raw_text": text_lower,
        "task_number": task_number
    }


def extract_task_details(text: str) -> Dict[str, Any]:
    """
    Extract additional details from task description like priority, due date, etc.
    """
    details = {}

    # Extract priority indicators
    if any(word in text.lower() for word in ['high priority', 'urgent', 'critical', 'asap', 'important']):
        details['priority'] = 'high'
    elif any(word in text.lower() for word in ['low priority', 'not urgent', 'not critical', 'later', 'whenever']):
        details['priority'] = 'low'
    elif any(word in text.lower() for word in ['medium priority', 'normal', 'regular', 'standard']):
        details['priority'] = 'medium'

    # Extract due date indicators
    if any(word in text.lower() for word in ['today', 'by end of day', 'by eod']):
        details['due_date'] = 'today'
    elif any(word in text.lower() for word in ['tomorrow', 'by tomorrow', 'by tomorrow night']):
        details['due_date'] = 'tomorrow'
    elif any(word in text.lower() for word in ['this week', 'by end of week', 'by weekend']):
        details['due_date'] = 'this_week'
    elif any(word in text.lower() for word in ['next week', 'by next week']):
        details['due_date'] = 'next_week'

    return details