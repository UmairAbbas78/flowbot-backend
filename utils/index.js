const getPrompt = (prompt) => {
  return `
  You are a Playwright automation expert. Generate a video demo for a web app using Playwright and Text-to-Speech. 
Convert the natural-language task below into **one JavaScript object** with:

• steps — an array of step objects. Include 'wait' actions where needed for synchronization.  
• audioScript — one continuous narration string describing only user actions (click, type, press). Do not narrate wait actions. Add natural pauses between sentences.

-------------------------------------------------
📝 Object shape

{
  steps: [
    { action: 'type',  selector: '#email',    value: 'user@example.com' },
    { action: 'press', selector: '#email',    value: 'Enter' }
  ],
  audioScript: "I am typing the user's email into the input field (#email). Next, I am pressing Enter to submit the form."
}

-------------------------------------------------
🎯 Allowed actions  
(click | type | press | wait)

🕵️ Selector rules  
#id · input[name="field"] · .class · button[type="submit"] · a[href*="text"]

📏 Rules  
1. Always use the most specific selector when an ID or name is provided.  
2. For “press enter”, use action 'press' with value 'Enter'.  
3. If no selector is given, choose a sensible one (e.g., input[type="email"]).  
4. Provide realistic example values for text input.  
5. **Output only the JavaScript object** (no explanations or comments).  
6. Narration in 'audioScript' must describe only user actions, never wait actions.  
7. Concatenate narration into a single coherent paragraph.

-------------------------------------------------
🔤 Example input  
> write email and password in the input field, both have id with the same name and then press enter

🔢 Example output  
{
  steps: [
    { action: 'type',  selector: '#email',    value: 'user@example.com' },
    { action: 'wait',  value: 1000 },
    { action: 'type',  selector: '#password', value: 'yourPassword123' },
    { action: 'wait',  value: 1000 },
    { action: 'press', selector: '#password', value: 'Enter' }
  ],
  audioScript: "I am typing the user's email into the input field (#email). Then I am typing the user's password into the input field (#password). Finally, I am pressing Enter to submit the form."
}

-------------------------------------------------
Convert the following instruction into the required object:


${prompt}

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
function parseAutomationSnippet(raw) {
  // 1️⃣ Trim back‑ticks and possible ```javascript fences
  const cleaned = raw
    .replace(/^```(?:\w+)?/m, "") // opening fence
    .replace(/```$/m, "") // closing fence
    .trim();

  // 2️⃣ Wrap in parentheses so `eval` reads it as an *expression*,
  //    not a block statement.
  const wrapped = `(${cleaned})`;

  // 3️⃣ Use Function constructor instead of direct eval
  //    (slightly safer, avoids current scope leakage).
  try {
    return Function(`"use strict"; return ${wrapped}`)();
  } catch (err) {
    throw new Error("Snippet could not be parsed. Check its syntax.");
  }
}
module.exports = {
  convertAIResponseToSteps,
  getPrompt,
  parseAutomationSnippet,
};
