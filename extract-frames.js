const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'src', 'components', 'predict_scroll_30fps.html');
if (!fs.existsSync(htmlPath)) {
  console.error(`File not found: ${htmlPath}`);
  process.exit(1);
}

const html = fs.readFileSync(htmlPath, 'utf8');

const startMatch = html.indexOf('var RAW = [');
if (startMatch === -1) {
  console.error('Could not find var RAW = [ in HTML');
  process.exit(1);
}

const startIndex = html.indexOf('[', startMatch);
const endIndex = html.indexOf('];', startIndex);
if (endIndex === -1) {
  console.error('Could not find ]; after var RAW');
  process.exit(1);
}

const arrayStr = html.substring(startIndex, endIndex + 1);

try {
  const rawArray = JSON.parse(arrayStr);
  console.log(`Successfully parsed ${rawArray.length} frames.`);
  
  const publicDir = path.join(__dirname, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const outputPath = path.join(publicDir, 'frames_30fps.json');
  fs.writeFileSync(outputPath, JSON.stringify(rawArray));
  console.log(`Saved frames to ${outputPath}`);
} catch (e) {
  console.error('Failed to parse array:', e);
}
