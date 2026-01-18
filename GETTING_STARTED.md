# Getting Started Guide - Your First Time Coding! 🚀

Welcome! This guide will walk you through everything step-by-step. Don't worry if you've never done this before - we'll go slowly and explain everything.

## Step 1: Check if You Have Node.js Installed

Node.js is the software that runs our ghost news app. Let's check if you have it:

### On Windows:
1. Press `Windows Key + R`
2. Type `cmd` and press Enter
3. In the black window that appears, type: `node --version`
4. Press Enter

### On Mac:
1. Press `Command + Space`
2. Type `terminal` and press Enter
3. In the window that appears, type: `node --version`
4. Press Enter

### On Linux:
1. Open your terminal application
2. Type: `node --version`
3. Press Enter

**What should happen:**
- ✅ If you see something like `v18.0.0` or `v20.0.0`, you're good! Skip to Step 3.
- ❌ If you see "command not found" or an error, continue to Step 2.

---

## Step 2: Install Node.js (If You Don't Have It)

### Windows or Mac:
1. Go to: https://nodejs.org/
2. Click the big green button that says "Download Node.js (LTS)"
3. Run the downloaded file
4. Click "Next" through the installer (keep all default settings)
5. When it's done, close and reopen your terminal/command prompt
6. Type `node --version` again to confirm it worked

### Linux:
In your terminal, type:
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

---

## Step 3: Navigate to the Project Folder

You need to tell your computer where the project files are located.

### In Your Terminal/Command Prompt:

Type this command (exactly as shown):
```bash
cd /home/user/Trial-Balloon
```

Press Enter.

**What this does:** `cd` means "change directory" - it's like opening a folder.

**Tip:** If you see an error, the folder might be in a different location. Type `pwd` (Mac/Linux) or `cd` (Windows) to see where you are.

---

## Step 4: Install the App's Dependencies

Our app needs some extra software packages to work. Let's install them:

### Type this command:
```bash
npm install
```

Press Enter and wait.

**What you'll see:**
- Lots of text scrolling by (this is normal!)
- Lines saying "added X packages"
- It might take 30-60 seconds
- When it's done, you'll see your cursor blinking again

**What this does:** `npm` is the "Node Package Manager" - it downloads all the tools our app needs (like web scraping tools, the web server, etc.)

---

## Step 5: Start the Server

Now let's turn on the app!

### Type this command:
```bash
npm start
```

Press Enter.

**What you'll see:**
```
Ghost News Scraper running on http://localhost:3000
Auto-refresh scheduled every hour
Fetching ghost stories...
Fetched X unique ghost stories
```

**What this means:**
- Your app is now running!
- It's already starting to collect ghost stories
- Don't close this window - the app needs it to stay open

---

## Step 6: Open the App in Your Browser

Now let's actually see the app!

### Do this:
1. Open your web browser (Chrome, Firefox, Safari, Edge - any will work)
2. In the address bar at the top, type: `localhost:3000`
3. Press Enter

**You should see:**
- A dark themed webpage with a purple/blue gradient
- The title "👻 Ghost News Scraper"
- Cards showing ghost stories
- Buttons to filter and sort stories

🎉 **Congratulations! You're now running your first web app!**

---

## Step 7: Using the App - Feature Tour

Now let's explore what you can do!

### 📰 Viewing Stories

Each card shows:
- **Title**: The headline of the ghost story
- **Tags**:
  - Purple tags = Type of haunting (poltergeist, apparition, etc.)
  - Yellow tags = Location where it happened
- **Summary**: A short description of what happened
- **Popularity Score**: The fire emoji (🔥) with a bar showing how popular/detailed the story is
- **Source**: Where the story came from (Google News, Reddit, etc.)
- **Read More**: Click this link to see the full story on the original website

### 🔍 Filtering Stories

Want to see only certain types of stories?

1. **Filter by Type**:
   - Click the "Filter by Type" dropdown
   - Choose: Poltergeist, Apparition, Demonic, Spirit, or Haunted Location
   - Only stories of that type will show

2. **Filter by Location**:
   - Click in the "Filter by Location" box
   - Type a place name (like "New York" or "London")
   - Only stories from that location will show

3. **Clear Filters**:
   - Click the "✖️ Clear Filters" button to see all stories again

### 📊 Sorting Stories

Change the order of stories:

1. Click the "Sort By" dropdown
2. Choose how you want to organize:
   - **Date**: Newest stories first (default)
   - **Popularity**: Most popular stories first
   - **Location**: Alphabetically by place
   - **Type**: Alphabetically by haunting type

### 🔄 Refreshing Stories

Get new stories:

1. **Manual Refresh**:
   - Click the "🔄 Refresh Now" button
   - The button will say "Refreshing..." while it works
   - New stories will appear in a few seconds

2. **Automatic Refresh**:
   - Look at the bottom-right corner
   - You'll see a countdown timer
   - The app automatically fetches new stories every hour
   - You don't need to do anything - it happens automatically!

### 📈 Statistics

At the top of the page, you'll see:
- **Total Stories**: How many ghost stories have been collected
- **Haunting Types**: How many different categories
- **Locations**: How many different places

---

## Step 8: Stopping the App

When you're done using the app:

### In the Terminal/Command Prompt Window:
1. Click on the window where you typed `npm start`
2. Press `Ctrl + C` (Windows/Linux) or `Command + C` (Mac)
3. The app will stop
4. The webpage will no longer work (until you start it again)

### To Start Again Later:
1. Open terminal/command prompt
2. Type: `cd /home/user/Trial-Balloon`
3. Type: `npm start`
4. Open browser to `localhost:3000`

---

## Troubleshooting

### "Port 3000 is already in use"
**Problem:** Another app is using port 3000.

**Solution:** Stop the other app, or use a different port:
```bash
PORT=8080 npm start
```
Then open: `localhost:8080` instead

### No Stories Showing
**Problem:** The app couldn't fetch stories.

**Solution:**
- Check your internet connection
- Click "🔄 Refresh Now" button
- Wait a minute and try again

### Browser Shows "Can't Connect"
**Problem:** The server isn't running.

**Solution:**
- Go back to your terminal
- Make sure you see "Ghost News Scraper running on http://localhost:3000"
- If not, type `npm start` again

### "npm: command not found"
**Problem:** Node.js isn't installed correctly.

**Solution:** Go back to Step 2 and reinstall Node.js

---

## Understanding What You've Built

Let me explain what's happening behind the scenes:

1. **The Server (server.js)**:
   - This is like the "brain" of your app
   - It goes to websites and collects ghost stories
   - It organizes them by type and location
   - It creates summaries
   - It gives information to the webpage

2. **The Webpage (public/index.html)**:
   - This is what you see in the browser
   - It asks the server for stories
   - It displays them in a pretty way
   - It handles the buttons and filters

3. **The Communication**:
   - When you click "Refresh", the webpage asks the server: "Get me new stories!"
   - The server goes to Google News and Reddit
   - It brings back the stories
   - The webpage displays them

4. **The Automation**:
   - Every hour, the server automatically wakes up
   - It fetches new stories without you doing anything
   - It updates the list so you always have fresh content

---

## Next Steps - Learning More

Want to customize your app? Here are some ideas:

1. **Change the Refresh Time**:
   - Open `server.js` in a text editor
   - Find line 415: `cron.schedule('0 * * * *'`
   - Change to refresh every 30 minutes: `'*/30 * * * *'`

2. **Change the Colors**:
   - Open `public/index.html` in a text editor
   - Look for the `<style>` section
   - Try changing color codes (like `#00d4ff` to `#ff0000` for red)

3. **Add More News Sources**:
   - Edit `server.js`
   - Add new scraping functions
   - The code is commented to help you understand it

---

## Questions?

If something doesn't work:
1. Read the error message carefully
2. Check this guide again
3. Make sure Node.js is installed
4. Make sure you're in the right folder (`/home/user/Trial-Balloon`)
5. Try stopping the app (Ctrl+C) and starting again

**Remember:** Every programmer gets stuck sometimes. It's totally normal! The important thing is to read error messages and try to understand what they're telling you.

---

## Congratulations! 🎉

You've just:
- ✅ Installed Node.js
- ✅ Installed dependencies
- ✅ Started a web server
- ✅ Viewed a web application in your browser
- ✅ Used advanced features like filtering and sorting

These are real programming skills! You're not just using an app - you built it and ran it yourself. That's awesome!

Happy ghost hunting! 👻
