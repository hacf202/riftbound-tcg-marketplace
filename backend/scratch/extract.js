const fs = require('fs');
const html = fs.readFileSync('C:/Users/Administrator/.gemini/antigravity/brain/cd13339e-eb45-4a6e-974f-afb26e758a0a/.system_generated/steps/369/output.txt', 'utf8');

const regex = /x-api-key|api[_-]?key|bearer|token|authorization/gi;
let match;
while ((match = regex.exec(html)) !== null) {
  console.log(html.slice(Math.max(0, match.index - 50), match.index + 100).replace(/<[^>]+>/g, ' '));
}
