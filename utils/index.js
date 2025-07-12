const getPrompt = (prompt) => {
  return `
    You are a Playwright automation expert. Convert natural language instructions into structured step objects for web automation.
  
  Output Format
  
  Each step should be a JavaScript object with these properties:
  
  
  
  action: The action type ('click', 'type', 'press', 'wait')
  
  selector: CSS selector or element identifier
  
  value: (optional) Text to type or key to press
  
  
  
  Action Types
  
  
  
  click: Click on an element
  
  type: Enter text into an input field
  
  press: Press a keyboard key
  
  wait: Wait for an element to appear
  
  
  
  Selector Guidelines
  
  
  
  Use #elementId for elements with IDs
  
  Use input[name="fieldname"] for form inputs
  
  Use .classname for CSS classes
  
  Use button[type="submit"] for specific button types
  
  Use a[href*="text"] for links containing specific text
  
  
  
  Example Input:
  
  "write email and password in the input field, both have id with the same name and then press enter"
  
  Example Output:
  
  javascript[
  
    { action: 'type', selector: '#email', value: 'user@example.com' },
  
    { action: 'type', selector: '#password', value: 'yourpassword' },
  
    { action: 'press', selector: '#password', value: 'Enter' }
  
  ]
  
  Instructions:
  
  Convert the following natural language instruction into structured steps:
  
  ${prompt}
  
  Rules:
  
  
  
  Always use specific selectors when element IDs or names are mentioned
  
  For "press enter", use the 'press' action with value 'Enter'
  
  If no specific selector is mentioned, use common patterns like input[type="email"], input[type="password"], etc.
  
  Include realistic example values for text inputs
  
  Only output the JavaScript array of step objects
  
  Don't include explanatory text, just the code
    `;
};

// Function to convert AI response to steps array
function convertAIResponseToSteps(aiResponse) {
  try {
    // Remove markdown code block markers if present
    let cleanedResponse = aiResponse
      .replace(/```javascript/g, "")
      .replace(/```/g, "")
      .trim();

    // Evaluate the JavaScript array string
    const steps = eval(cleanedResponse);

    // Validate that it's an array
    if (!Array.isArray(steps)) {
      throw new Error("Response is not a valid array");
    }

    // Validate each step has required properties
    steps.forEach((step, index) => {
      if (!step.action || !step.selector) {
        throw new Error(
          `Step ${index + 1} is missing required properties (action, selector)`
        );
      }
    });

    return steps;
  } catch (error) {
    console.error("Error parsing AI response:", error.message);
    return null;
  }
}
module.exports = {
  convertAIResponseToSteps,
  getPrompt,
};
