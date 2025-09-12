# Cron Job System

This directory contains the automated task scheduling system for TechBook Ranking.

## Overview

The cron system automates three main operations:

1. **Qiita Fetching** - Hourly article fetching from Qiita API
2. **Ranking Generation** - Daily book ranking updates
3. **Cleanup Tasks** - Weekly maintenance and log cleanup

All operations are logged to the `batch_logs` MongoDB collection with detailed timestamps and result summaries.

## Scheduled Tasks

| Task | Schedule | Description |
|------|----------|-------------|
| `fetchQiita` | `0 * * * *` (Hourly) | Fetch articles from Qiita and match to books |
| `generateRankings` | `0 2 * * *` (Daily at 2 AM) | Generate all book rankings |
| `cleanupLogs` | `0 3 * * 0` (Sunday at 3 AM) | Clean up old logs and expired rankings |

## Usage

### 🖥️ Development Mode

```bash
# Run cron daemon (keeps running)
npm run cron-daemon

# Run single jobs manually
npm run cron-runner run fetchQiita
npm run cron-runner run generateRankings
npm run cron-runner run cleanupLogs

# Check job status
npm run cron-runner status

# View batch logs
npm run cron-runner logs
npm run cron-runner logs --type qiita_fetch --limit 10
npm run cron-runner logs --stats

# Generate crontab entries
npm run cron-runner crontab
```

### 🚀 Production Deployment

#### Option 1: Node.js Daemon (Recommended)

```bash
# Build the project
npm run build

# Run daemon with PM2
pm2 start dist/scripts/cronRunner.js --name "techbook-cron" -- daemon

# Or with systemd
sudo systemctl enable techbook-cron
sudo systemctl start techbook-cron
```

#### Option 2: System Crontab

```bash
# Generate crontab entries
npm run cron-runner crontab

# Add to system crontab
sudo crontab -e

# Add these lines:
0 * * * * cd /path/to/project && NODE_ENV=production node dist/scripts/cronRunner.js run fetchQiita
0 2 * * * cd /path/to/project && NODE_ENV=production node dist/scripts/cronRunner.js run generateRankings
0 3 * * 0 cd /path/to/project && NODE_ENV=production node dist/scripts/cronRunner.js run cleanupLogs
```

## Configuration

### Environment Variables

```env
# Required
MONGODB_URI=mongodb://localhost:27017/techbook-ranking
QIITA_TOKEN=your_qiita_api_token

# Optional
CRON_TIMEZONE=UTC
QIITA_DEFAULT_QUERY=created:>2024-01-01 stocks:>3
ENABLE_CRON_JOBS=true
```

### Customization

Edit `src/services/cronService.ts` to modify:

- **Schedules**: Change cron expressions
- **Job Configuration**: Modify job parameters
- **Job Logic**: Add new jobs or modify existing ones

## Monitoring

### Batch Logs

All operations are logged with:

- **Timestamps**: Start/end times and duration
- **Results**: Processed/success/error counts
- **Metadata**: Job-specific data and configuration
- **Errors**: Detailed error messages and stack traces

### Log Analysis

```bash
# View recent logs
npm run cron-runner logs

# Filter by job type
npm run cron-runner logs --type qiita_fetch

# Show statistics
npm run cron-runner logs --stats

# Check specific job performance
db.batch_logs.find({batchType: "qiita_fetch"}).sort({startedAt: -1}).limit(10)
```

### Health Checks

```bash
# Check if jobs are running
npm run cron-runner status

# Test individual components
npm run fetch-qiita -- --pages 1 --limit 5  # Test Qiita fetching
npm run cron-runner run generateRankings     # Test ranking generation
```

## Troubleshooting

### Common Issues

1. **Jobs Not Running**
   - Check environment variables are set
   - Verify database connectivity
   - Check system timezone settings

2. **Qiita Fetching Fails**
   - Verify `QIITA_TOKEN` is valid
   - Check API rate limits
   - Review network connectivity

3. **Ranking Generation Slow**
   - Monitor database performance
   - Check available memory
   - Consider reducing `maxBooks` limit

4. **High Memory Usage**
   - Adjust batch sizes in job configuration
   - Increase cleanup frequency
   - Monitor MongoDB memory usage

### Log Examples

**Successful Qiita Fetch:**
```javascript
{
  batchType: "qiita_fetch",
  status: "completed",
  startedAt: ISODate("2024-01-15T10:00:00.000Z"),
  completedAt: ISODate("2024-01-15T10:05:23.000Z"),
  duration: 323,
  processedCount: 40,
  successCount: 12,
  errorCount: 0,
  summary: "Processed 40 articles, found 12 book mentions"
}
```

**Failed Ranking Generation:**
```javascript
{
  batchType: "ranking_update",
  status: "failed",
  startedAt: ISODate("2024-01-15T02:00:00.000Z"),
  completedAt: ISODate("2024-01-15T02:01:15.000Z"),
  duration: 75,
  processedCount: 0,
  errorCount: 1,
  errors: [{
    message: "Database connection timeout",
    timestamp: ISODate("2024-01-15T02:01:10.000Z")
  }]
}
```

## Architecture

```
scripts/
├── cronRunner.ts          # CLI interface and job runner
├── fetchQiita.ts         # Qiita API fetching (modified to export class)
└── CRON_README.md        # This documentation

src/services/
├── cronService.ts        # Main cron scheduler service
├── rankingGenerationService.ts  # Ranking generation logic
└── ...

src/utils/
├── batchLogger.ts        # Batch operation logging utilities
└── ...

src/models/
├── BatchLog.ts           # Batch log data model
└── ...
```

## Performance Considerations

- **Memory**: Each job runs in the same Node.js process
- **Database**: Jobs may create temporary database load
- **API Limits**: Qiita API has rate limiting
- **Disk Space**: Logs are automatically cleaned up after 90 days

## Development

```bash
# Test cron expressions
npm install -g node-cron
node -e "console.log(require('node-cron').validate('0 * * * *'))"

# Debug specific jobs
NODE_ENV=development npm run cron-runner run fetchQiita

# Monitor logs in real-time
npm run cron-runner logs --limit 1 && sleep 60 && npm run cron-runner logs --limit 1
```