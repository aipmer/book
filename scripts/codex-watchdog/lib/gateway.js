// Express Server Gateway for Codex Mobile Watchdog (Ch.08)
const express = require('express');
const { exec } = require('child_process');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;
const VALID_USER = process.env.CODEX_USER || 'hunkwu';

// Webhook endpoint to receive remote commands from WeChat, Slack, or Keepa
app.post('/api/mobile-reply', (req, res) => {
  const { userMessage, user } = req.body;
  
  console.log(`[Watchdog] Received signal: "${userMessage}" from user: "${user}"`);
  
  // Authenticate user
  if (user !== VALID_USER) {
    console.warn(`[Watchdog] Unauthorized access attempt by user: "${user}"`);
    return res.status(403).json({ error: 'Unauthorized user credentials.' });
  }

  if (userMessage === '1') {
    // Write approval signal to temporary directory
    exec('echo "approved" > /tmp/codex_deploy_signal', (err) => {
      if (err) {
        console.error('[Watchdog] Failed to write deploy signal:', err);
        return res.status(500).json({ error: 'Failed to write authorization signal.' });
      }
      console.log('[Watchdog] Deployment approved and signal written.');
      res.json({ reply: '🚀 Deployment approved, production build is launching!' });
    });
  } else if (userMessage === '0') {
    // Terminate running codex process and revert local edits
    exec('pkill -f codex && git checkout -- .', (err) => {
      if (err) {
        console.warn('[Watchdog] Process termination returned status:', err.message);
      }
      console.log('[Watchdog] Codex process terminated. Code rolled back.');
      res.json({ reply: '🛑 Deployment aborted, active agent terminated and workspace rolled back.' });
    });
  } else {
    res.json({ reply: '⚠️ Invalid instruction. Reply with 1 (approve) or 0 (abort).' });
  }
});

app.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(`📡 Codex Mobile Gateway listening on port ${PORT}`);
  console.log(`🛡️  Configured Authorized User: "${VALID_USER}"`);
  console.log(`=============================================`);
});
