const getPrompt = (prompt) => {
  return `
  You are a Playwright automation expert.  
Convert the natural‑language task below into **one JavaScript object** with:

• **steps** — an array of step objects  
• **audioScript** — one continuous narration string describing every step **except those with action 'wait'**

-------------------------------------------------
📝 Object shape

\`\`\`javascript
{
  steps: [
    { action: 'type',  selector: '#email',    value: 'user@example.com' },
    { action: 'wait',  selector: '#submit' },
    { action: 'click', selector: '#submit' }
  ],
  audioScript: "Now I am typing the user's email into the input field (#email). Finally, I am clicking the submit button (#submit)."
}
\`\`\`

-------------------------------------------------
🎯 Allowed actions  
(click | type | press | wait)

🕵️ Selector guidelines  
#id · input[name="field"] · .class · button[type="submit"] · a[href*="text"]

📏 Rules  
1. Use the most specific selector when an ID or name is given.  
2. For “press enter”, use action 'press' with value 'Enter'.  
3. If no selector is provided, choose a sensible generic one (e.g., input[type="email"]).  
4. Provide realistic example values for text input.  
5. **Output only the JavaScript object**—no comments or extra text.  
6. Concatenate narration for all **non‑wait** steps into a single coherent sentence or paragraph inside \`audioScript\`.  
7. **Skip** narration for any step where \`action === 'wait'\`.

-------------------------------------------------
🔤 Example input  
> type email, wait for the submit button to appear, then click submit

🔢 Example output  
\`\`\`javascript
{
  steps: [
    { action: 'type',  selector: '#email',  value: 'user@example.com' },
    { action: 'wait',  selector: '#submit' },
    { action: 'click', selector: '#submit' }
  ],
  audioScript: "Now I am typing the user's email into the input field (#email). Finally, I am clicking the submit button (#submit)."
}
\`\`\`

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
