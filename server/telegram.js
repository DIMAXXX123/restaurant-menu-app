require('dotenv').config();

async function sendTelegramNotification(message) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId || token.includes('...')) {
    console.log('[Telegram] Skipped (no valid credentials):', message);
    return;
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('[Telegram] Error:', err);
    }
  } catch (err) {
    console.error('[Telegram] Failed to send notification:', err.message);
  }
}

module.exports = { sendTelegramNotification };
