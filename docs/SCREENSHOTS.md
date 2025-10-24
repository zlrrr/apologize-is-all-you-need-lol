# Screenshots Guide

This guide explains how to add screenshots to the project README.

## Required Screenshots

The README expects the following screenshots in `docs/images/`:

1. **screenshot-chat.png** - Main chat interface showing a conversation
2. **screenshot-sessions.png** - Session management panel open
3. **screenshot-styles.png** - Showing the three apology styles selector
4. **screenshot-mobile.png** - Mobile responsive view

## How to Create Screenshots

### 1. Start the Application

```bash
# Start all services
./scripts/start.sh

# Or manually
cd backend && npx tsx src/mock-lm-studio.ts &
cd backend && npm run dev &
cd frontend && npm run dev
```

### 2. Open in Browser

Navigate to: http://localhost:3000

### 3. Take Screenshots

#### Chat Interface (screenshot-chat.png)
1. Send a few messages in the chat
2. Wait for the apology character animation to appear
3. Take a screenshot showing:
   - The header with app title
   - Some chat messages (user and assistant)
   - The input box at the bottom
   - The apology character if it's visible

**Recommended size**: 800x600 or larger

#### Session Management (screenshot-sessions.png)
1. Create multiple sessions by clicking "会话列表" → "新建会话"
2. Send at least one message in each session
3. Click "会话列表" button to open the session panel
4. Take a screenshot showing:
   - The open session list panel
   - Multiple sessions with names and timestamps
   - The active session highlighted

**Recommended size**: 800x600 or larger

#### Apology Styles (screenshot-styles.png)
1. Click on the "风格" (Style) dropdown in the header
2. Show all three options: 温和/正式/共情
3. Take a screenshot showing the dropdown menu open
4. Alternatively, take screenshots of responses from each style

**Recommended size**: 400x300 or larger

#### Mobile View (screenshot-mobile.png)
1. Open browser dev tools (F12)
2. Toggle device toolbar (Ctrl+Shift+M or Cmd+Shift+M)
3. Select a mobile device (iPhone 12, Pixel 5, etc.)
4. Take a screenshot showing:
   - The responsive layout on mobile
   - Chat messages properly displayed
   - Input box at the bottom

**Recommended size**: 375x667 (iPhone) or 360x640 (Android)

### 4. Optimize Screenshots

Before saving:
- Crop to remove unnecessary browser chrome
- Resize if too large (max 1000px width recommended)
- Save as PNG format for best quality
- Compress using tools like TinyPNG if file size > 500KB

### 5. Save Screenshots

Place all screenshots in the `docs/images/` directory:

```bash
mkdir -p docs/images
# Copy your screenshots here
```

Expected file structure:
```
docs/
└── images/
    ├── screenshot-chat.png
    ├── screenshot-sessions.png
    ├── screenshot-styles.png
    └── screenshot-mobile.png
```

## Screenshot Specifications

| Screenshot | Purpose | Minimum Size | Recommended Size |
|------------|---------|--------------|------------------|
| Chat Interface | Show main chat UI | 600x400 | 800x600 |
| Session Management | Show session panel | 600x400 | 800x600 |
| Apology Styles | Show style selector | 300x200 | 400x300 |
| Mobile View | Show responsive design | 360x640 | 375x667 |

## Tips for Good Screenshots

1. **Use realistic data** - Don't use "test" messages, use actual apology scenarios
2. **Show the feature** - Make sure the screenshot clearly demonstrates what it's showing
3. **Clean UI** - Close unnecessary browser tabs, hide bookmarks bar
4. **Good lighting** - If on dark mode, ensure text is readable
5. **Consistent theme** - Use the same theme (light/dark) across all screenshots
6. **No personal info** - Don't include any personal data in messages
7. **High quality** - Use high DPI/retina screenshots if possible

## Example Messages for Screenshots

### For Chat Interface:
```
User: "今天工作太累了，感觉很烦躁"
Assistant: "非常抱歉听到你今天这么辛苦。工作压力大确实会让人感到疲惫和烦躁..."
```

### For Different Styles:
- **Gentle**: "今天心情不太好"
- **Formal**: "项目进展不顺利"
- **Empathetic**: "感觉很沮丧，不知道该怎么办"

## Alternative: Using Placeholder Images

If you can't create screenshots right now, you can use placeholder images:

```bash
# Create placeholder images with ImageMagick
convert -size 800x600 xc:lightgray -pointsize 24 -draw "text 300,300 'Chat Interface'" docs/images/screenshot-chat.png
convert -size 800x600 xc:lightgray -pointsize 24 -draw "text 250,300 'Session Management'" docs/images/screenshot-sessions.png
convert -size 400x300 xc:lightgray -pointsize 24 -draw "text 120,150 'Apology Styles'" docs/images/screenshot-styles.png
convert -size 375x667 xc:lightgray -pointsize 24 -draw "text 120,333 'Mobile View'" docs/images/screenshot-mobile.png
```

Or use online placeholder services and download images:
- https://via.placeholder.com/800x600.png
- https://placehold.co/800x600/png

## Updating README

Once screenshots are added, the README will automatically display them. No need to modify the README markdown - it's already configured to show the images.

If images are missing, a note will be displayed instead:
> 📝 **Note**: To add screenshots, run the app and take screenshots, then save them to `docs/images/` folder.

## Automated Screenshot Generation (Advanced)

For CI/CD or automated testing, you can use tools like:
- Puppeteer
- Playwright
- Cypress

Example with Puppeteer:
```javascript
const puppeteer = require('puppeteer');

async function takeScreenshot() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  await page.screenshot({ path: 'docs/images/screenshot-chat.png' });
  await browser.close();
}
```
