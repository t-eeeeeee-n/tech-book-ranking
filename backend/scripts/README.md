# Qiita Fetcher Script

This script connects to the Qiita API, searches for recent articles, and matches them to registered books in the database.

## Setup

1. **Get a Qiita API Token**
   - Go to https://qiita.com/settings/applications
   - Generate a new personal access token
   - Set it in your `.env` file or use the `--token` option

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env and set your QIITA_TOKEN
   ```

## Usage

### Basic Usage
```bash
npm run fetch-qiita
```

### With Options
```bash
# Fetch 3 pages of articles
npm run fetch-qiita -- --pages 3

# Search for specific topics
npm run fetch-qiita -- --query "React TypeScript"

# Custom confidence threshold
npm run fetch-qiita -- --confidence 0.7

# Use specific token
npm run fetch-qiita -- --token your_token_here
```

### CLI Options

- `-t, --token <token>`: Qiita API token (or set QIITA_TOKEN env var)
- `-q, --query <query>`: Search query for Qiita articles
- `-p, --pages <pages>`: Number of pages to fetch (default: 1)
- `--per-page <perPage>`: Articles per page, max 100 (default: 20)
- `-c, --confidence <confidence>`: Minimum confidence for book matches (default: 0.5)
- `--dry-run`: Show what would be processed without saving *(not implemented yet)*

### Default Search Query
If no query is provided, the script uses: `created:>2024-01-01 stocks:>5`
This fetches recent articles with at least 5 likes/stocks.

## How It Works

1. **Connect to Database**: Loads all active books and builds a searchable cache
2. **Fetch Articles**: Retrieves articles from Qiita API with pagination
3. **Match Books**: Uses text matching algorithms to find book references:
   - **High confidence (0.9)**: Direct title matches in article content
   - **Medium confidence (0.3-0.7)**: Word-based matching with book-related keywords
4. **Save Data**: 
   - Saves articles to `qiita_articles` collection
   - Creates entries in `book_mentions` collection
   - Updates book statistics (mention count, trend score, etc.)

## Book Matching Algorithm

The script uses a multi-level matching approach:

### 1. Title Normalization
- Converts to lowercase
- Removes special characters
- Normalizes whitespace

### 2. Direct Matching (High Confidence)
- Looks for exact book titles in article content
- Requires title length > 10 characters
- Confidence: 0.9

### 3. Keyword Matching (Medium Confidence)
- Searches for book-related keywords: 本, book, 書籍, 参考書, おすすめ, recommend
- Matches individual words from book titles
- Confidence: 0.2-0.7 based on word matches

### 4. Filtering
- Minimum confidence threshold (default: 0.5)
- Maximum 5 matches per article
- Removes duplicate books per article

## Database Updates

For each matched book, the script updates:
- `mentionCount`: Total number of mentions
- `uniqueArticleCount`: Number of unique articles mentioning the book
- `firstMentionedAt`: Date of first mention
- `lastMentionedAt`: Date of latest mention
- `trendScore`: Weighted score favoring recent mentions

## Rate Limiting

The script respects Qiita's API limits:
- 1 second delay between page requests
- Configurable timeout (10 seconds)
- Proper error handling for rate limit responses

## Examples

```bash
# Fetch recent programming articles
npm run fetch-qiita -- --query "プログラミング 本" --pages 2

# Fetch React-related articles with high confidence threshold  
npm run fetch-qiita -- --query "React" --confidence 0.8

# Fetch general tech articles
npm run fetch-qiita -- --query "技術書 おすすめ" --pages 5
```

## Output

The script provides detailed logging:
- Connection status
- Article fetching progress  
- Book matching results
- Database save operations
- Summary statistics

Example output:
```
🚀 Starting Qiita fetch process...
📦 Connecting to MongoDB...
✅ Connected to MongoDB
🔍 Building book title cache...
📚 Cached 150 books with 1240 searchable terms
🔍 Fetching articles (page 1, per_page: 20)...
📄 Found 20 articles
📚 Found 3 book matches for: "React開発におすすめの技術書"
📖 Saved mention: "リーダブルコード" (confidence: 0.85)
📊 Summary:
   Articles processed: 20
   Total mentions found: 12
```