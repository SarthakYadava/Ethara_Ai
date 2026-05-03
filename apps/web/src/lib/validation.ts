const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateAuthForm(input: { mode: "login" | "signup"; name: string; email: string; password: string }) {
  if (input.mode === "signup" && input.name.trim().length < 2) {
    return "Name must be at least 2 characters.";
  }

  if (!emailPattern.test(input.email.trim())) {
    return "Enter a valid email address.";
  }

  if (input.mode === "signup") {
    if (input.password.length < 8) {
      return "Password must be at least 8 characters.";
    }

    if (!/[A-Z]/.test(input.password) || !/[a-z]/.test(input.password) || !/[0-9]/.test(input.password)) {
      return "Password must include uppercase, lowercase, and a number.";
    }
  }

  if (!input.password) {
    return "Password is required.";
  }

  return "";
}

export function validateProjectForm(input: { name: string; description: string }) {
  if (input.name.trim().length < 2) {
    return "Project name must be at least 2 characters.";
  }

  if (input.description.length > 600) {
    return "Project description must be 600 characters or less.";
  }

  return "";
}

export function validateTaskForm(input: { title: string; description: string; dueDate: string }) {
  if (input.title.trim().length < 2) {
    return "Task title must be at least 2 characters.";
  }

  if (input.description.length > 1000) {
    return "Task description must be 1000 characters or less.";
  }

  if (input.dueDate) {
    const selectedDate = new Date(`${input.dueDate}T00:00:00`);

    if (Number.isNaN(selectedDate.getTime())) {
      return "Choose a valid due date.";
    }
  }

  return "";
}
