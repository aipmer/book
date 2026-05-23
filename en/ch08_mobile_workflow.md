[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.07) ](./ch07_desktop_computer_use.md) | [ ➡️ Next (Ch.09) ](./ch09_legacy_code.md)

# Ch.08 Mobile Sentinel Workflows: 24/7 Remote Development and Orchestration

Don't chain yourself to your terminal. Set up a remote watchtower to approve deployments from your phone.

---

## 8.1 Watchdog Pipeline Setup
Configure GitHub Actions to verify builds and notify your phone on failure:

```yaml
# .github/workflows/codex-watchdog.yml
# ...
      - name: Push Fail Notice to Mobile
        if: env.STATUS == 'failed'
        run: |
          curl -X POST -H "Content-Type: application/json"             -d '{"message": "Codex sandbox testing failed."}'             ${{ secrets.MOBILE_WEBHOOK_URL }}
```

---

## 8.2 Remote Command Authorization
When Codex prepares a production deploy, let it hold and query your gateway. Reply `1` (Approve) or `0` (Abort) via WeChat or Slack:

```javascript
// Express Handler excerpt
app.post('/api/mobile-reply', (req, res) => {
  const { userMessage, user } = req.body;
  if (user !== 'hunkwu') return res.sendStatus(403);

  if (userMessage === '1') {
    exec('echo "approved" > /tmp/codex_deploy_signal');
    res.json({ reply: '🚀 Deploy approved!' });
  } else {
    exec('pkill -f codex && git checkout -- .');
    res.json({ reply: '🛑 Aborted and rolled back.' });
  }
});
```

---

[ 🏠 Index ](../README_EN.md) | [ ⬅️ Prev (Ch.07) ](./ch07_desktop_computer_use.md) | [ ➡️ Next (Ch.09) ](./ch09_legacy_code.md)
