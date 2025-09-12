# Slack Integration Setup Guide

This guide will help you set up Slack notifications for the TechBook Ranking system.

## 🎯 Features

The Slack integration provides:

- **Batch Job Notifications**: Automatic notifications when scheduled jobs complete (success/failure)
- **Error Alerts**: Critical error notifications with context
- **Daily Summaries**: Daily reports of system activity and performance
- **Rich Formatting**: Beautiful message formatting with blocks and attachments
- **Job-Specific Insights**: Customized messages for different job types with recommendations

## 📋 Prerequisites

1. **Slack Workspace**: Access to a Slack workspace where you can create apps
2. **Admin Permissions**: Ability to add apps to your workspace
3. **Channel Access**: Permission to post messages to desired channels

## 🚀 Setup Steps

### Step 1: Create a Slack App

1. Go to https://api.slack.com/apps
2. Click **"Create New App"**
3. Choose **"From scratch"**
4. Enter app details:
   - **App Name**: `TechBook Ranking Bot`
   - **Workspace**: Select your workspace
5. Click **"Create App"**

### Step 2: Configure Bot Permissions

1. In your app settings, go to **"OAuth & Permissions"**
2. Scroll to **"Scopes"** section
3. Under **"Bot Token Scopes"**, add these permissions:
   - `chat:write` - Send messages
   - `chat:write.public` - Send messages to public channels without joining
   - `channels:read` - List public channels (optional)
   - `groups:read` - List private channels (optional)

### Step 3: Install App to Workspace

1. In **"OAuth & Permissions"**, click **"Install to Workspace"**
2. Review permissions and click **"Allow"**
3. Copy the **"Bot User OAuth Token"** (starts with `xoxb-`)

### Step 4: Create/Configure Channels

Create or choose channels for notifications:

- **#techbook-alerts** (recommended default)
- **#techbook-errors** (for critical errors)
- **#techbook-daily** (for daily summaries)

Add the bot to these channels:
1. Go to the channel in Slack
2. Type `/invite @TechBook Ranking Bot`
3. Press Enter

### Step 5: Configure Environment Variables

Add these to your `.env` file:

```env
# Slack Notifications
SLACK_BOT_TOKEN=xoxb-your-bot-token-here
SLACK_DEFAULT_CHANNEL=#techbook-alerts
ENABLE_SLACK_NOTIFICATIONS=true
```

### Step 6: Test the Integration

Run the test script to verify everything works:

```bash
# Test connection
npm run test-slack connection

# Send test message
npm run test-slack message

# Send mock batch notification
npm run test-slack batch

# Send mock error alert
npm run test-slack error

# Send mock daily summary
npm run test-slack summary

# Run all tests
npm run test-slack all
```

## 📨 Message Types

### 1. Batch Job Completion
Sent when any scheduled job completes (fetchQiita, generateRankings, etc.):

- ✅ Success status with metrics
- ❌ Failure status with error details
- ⚠️ Partial success with warnings
- 📊 Performance metrics and duration
- 💡 Recommendations based on results

### 2. Error Alerts
Sent for critical system errors:

- 🚨 High-priority error indicator
- 📋 Error context and stack trace
- 🕐 Timestamp and environment info
- 🔍 Debugging information

### 3. Daily Summary
Sent every morning with:

- 📊 Overall system health
- 📈 Job success rates
- 🔢 Processing statistics
- ⏱️ Performance metrics
- 📅 24-hour activity overview

## 🎨 Customization

### Custom Channels

You can send different types of notifications to different channels:

```typescript
// Error alerts to dedicated channel
await slackNotificationService.sendErrorAlert(
    'critical_error', 
    error, 
    context, 
    '#techbook-errors'
)

// Daily summaries to management channel
await slackNotificationService.sendDailySummary(
    stats, 
    '#techbook-management'
)
```

### Message Formatting

Messages use Slack's Block Kit for rich formatting:
- **Headers** for clear message types
- **Fields** for structured data
- **Code blocks** for error details
- **Context** for timestamps and metadata
- **Emojis** for visual indicators

### Job-Specific Customization

Different job types have tailored messages:

- **Qiita Fetch**: API rate limits, article counts, search parameters
- **Ranking Generation**: Book counts, categories processed, cache status
- **Book Enrichment**: Amazon API status, enrichment success rates
- **Cleanup**: Storage saved, old data removed

## 🛠️ Advanced Configuration

### Environment Variables

```env
# Required
SLACK_BOT_TOKEN=<YOUR_SLACK_BOT_TOKEN>
ENABLE_SLACK_NOTIFICATIONS=true

# Optional
SLACK_DEFAULT_CHANNEL=#techbook-alerts
SLACK_ERROR_CHANNEL=#techbook-errors
SLACK_SUMMARY_CHANNEL=#techbook-daily
SLACK_MENTION_USERS=@channel          # For critical alerts
SLACK_THREAD_REPLIES=true             # Group related messages
```

### Docker Configuration

The docker-compose.yml already includes Slack environment variables:

```yaml
environment:
  - SLACK_BOT_TOKEN=${SLACK_BOT_TOKEN}
  - SLACK_DEFAULT_CHANNEL=${SLACK_DEFAULT_CHANNEL:-#techbook-alerts}
  - ENABLE_SLACK_NOTIFICATIONS=${ENABLE_SLACK_NOTIFICATIONS:-true}
```

### Scheduled Jobs

Notifications are automatically sent for these jobs:

| Job | Schedule | Notification |
|-----|----------|-------------|
| `fetchQiita` | Hourly | Completion status + article count |
| `generateRankings` | Daily 2 AM | Completion status + ranking stats |
| `cleanupLogs` | Weekly | Cleanup summary + storage saved |
| `dailySummary` | Daily 8 AM | 24-hour system overview |

## 🔧 Troubleshooting

### Common Issues

**1. "Not in channel" error:**
- Add the bot to the target channel with `/invite @BotName`
- Or use `chat:write.public` scope for public channels

**2. "Token expired" error:**
- Regenerate bot token in Slack app settings
- Update SLACK_BOT_TOKEN environment variable

**3. "Channel not found" error:**
- Verify channel name includes # prefix
- Check bot has access to the channel
- Use channel ID instead of name for private channels

**4. Messages not sending:**
```bash
# Check if notifications are enabled
echo $ENABLE_SLACK_NOTIFICATIONS

# Test connection
npm run test-slack connection

# Check logs
docker-compose logs backend | grep -i slack
```

### Debug Mode

Enable debug logging:

```env
DEBUG=slack:*
LOG_LEVEL=debug
```

### Manual Testing

Test individual components:

```bash
# Test specific job notification
npm run cron-runner run fetchQiita

# Test error alert
npm run test-slack error

# Test daily summary
npm run test-slack summary
```

## 📊 Monitoring

### Message Delivery

- Check Slack app logs in your workspace settings
- Monitor console output for "Slack notification sent" messages
- Use test commands to verify connectivity

### Performance Impact

- Slack notifications are async and won't block jobs
- Failed Slack calls are logged but don't fail the job
- Typical latency: 100-500ms per message

### Rate Limits

- Slack allows ~1 message per second per channel
- Batch notifications are sent sequentially
- System respects Slack's rate limiting

## 🎉 Best Practices

1. **Channel Organization**: Use dedicated channels for different message types
2. **Mention Strategy**: Use @channel sparingly for critical alerts only
3. **Message Frequency**: Balance informativeness with notification fatigue
4. **Error Handling**: Always include context and actionable information
5. **Testing**: Regularly test notifications in development
6. **Documentation**: Keep channel purposes clear for team members

## 🔄 Maintenance

### Regular Tasks

- Review and rotate bot tokens quarterly
- Monitor channel activity and adjust frequency
- Update message formats based on team feedback
- Test disaster recovery scenarios

### Updates

When updating the system:
1. Test notifications in staging environment
2. Verify new job types include proper notifications
3. Update message templates for new features
4. Document any new configuration options

---

For technical support, check the [Slack API documentation](https://api.slack.com/docs) or review the implementation in `src/services/slackNotificationService.ts`.