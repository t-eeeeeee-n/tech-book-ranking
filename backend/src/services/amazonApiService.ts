import axios, { AxiosInstance } from 'axios'
import * as crypto from 'crypto'
// import { URL } from 'url'
import dotenv from 'dotenv'
import { AmazonBookData, AmazonApiResponse, AmazonApiCredentials } from '@/types'

// Load environment variables
dotenv.config()

interface AmazonApiItem {
    ASIN?: string
    DetailPageURL?: string
    Images?: {
        Primary?: {
            Large?: { URL: string }
            Medium?: { URL: string }
        }
    }
    ItemInfo?: {
        Title?: {
            DisplayValue?: string
        }
        ByLineInfo?: {
            Contributors?: Array<{
                Name?: string
                Role?: string
            }>
        }
        ContentInfo?: {
            PublicationDate?: {
                DisplayValue?: string
            }
        }
        Classifications?: {
            Binding?: {
                DisplayValue?: string
            }
        }
        ExternalIds?: {
            EANs?: {
                DisplayValues?: string[]
            }
            ISBNs?: {
                DisplayValues?: string[]
            }
        }
    }
    Offers?: {
        Listings?: Array<{
            Price?: {
                Amount?: number
                Currency?: string
                DisplayAmount?: string
            }
            Availability?: {
                Message?: string
            }
        }>
    }
}

// interface AmazonApiSearchResponse {
//     SearchResult?: {
//         Items?: AmazonApiItem[]
//     }
//     Errors?: Array<{
//         Code?: string
//         Message?: string
//     }>
// }

export class AmazonApiService {
    private credentials: AmazonApiCredentials
    private httpClient: AxiosInstance
    private serviceName = 'ProductAdvertisingAPI'
    private version = '20131001'

    constructor() {
        this.credentials = this.loadCredentials()
        this.httpClient = axios.create({
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'X-Amz-Target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems'
            }
        })
    }

    private loadCredentials(): AmazonApiCredentials {
        const credentials: AmazonApiCredentials = {
            accessKey: process.env.AMAZON_ACCESS_KEY || '',
            secretKey: process.env.AMAZON_SECRET_KEY || '',
            associateTag: process.env.AMAZON_ASSOCIATE_TAG || '',
            region: process.env.AMAZON_REGION || 'us-east-1',
            endpoint: process.env.AMAZON_ENDPOINT || 'webservices.amazon.com'
        }

        if (!credentials.accessKey || !credentials.secretKey || !credentials.associateTag) {
            throw new Error('Amazon API credentials are not properly configured')
        }

        return credentials
    }

    /**
     * Convert ISBN-13 to ASIN (for Amazon API)
     * For books, ISBN-13 can sometimes be used directly as ASIN
     * This is a simplified conversion - in production, you might need more sophisticated logic
     */
    private isbnToAsin(isbn13: string): string {
        // Remove any hyphens or spaces
        const cleanIsbn = isbn13.replace(/[-\s]/g, '')
        
        // Validate ISBN-13 format
        if (!/^978\d{10}$/.test(cleanIsbn) && !/^979\d{10}$/.test(cleanIsbn)) {
            throw new Error('Invalid ISBN-13 format')
        }

        // For books, we'll try the ISBN-13 directly as ASIN first
        return cleanIsbn
    }

    /**
     * Generate AWS Signature Version 4
     */
    private generateSignature(
        method: string,
        uri: string,
        queryString: string,
        headers: Record<string, string>,
        payload: string,
        timestamp: string,
        region: string
    ): string {
        // Create canonical request
        const canonicalHeaders = Object.keys(headers)
            .sort()
            .map(key => `${key.toLowerCase()}:${headers[key]}`)
            .join('\n') + '\n'

        const signedHeaders = Object.keys(headers)
            .sort()
            .map(key => key.toLowerCase())
            .join(';')

        const hashedPayload = crypto.createHash('sha256').update(payload).digest('hex')

        const canonicalRequest = [
            method,
            uri,
            queryString,
            canonicalHeaders,
            signedHeaders,
            hashedPayload
        ].join('\n')

        // Create string to sign
        const algorithm = 'AWS4-HMAC-SHA256'
        const credentialScope = `${timestamp.substr(0, 8)}/${region}/execute-api/aws4_request`
        const stringToSign = [
            algorithm,
            timestamp,
            credentialScope,
            crypto.createHash('sha256').update(canonicalRequest).digest('hex')
        ].join('\n')

        // Calculate signature
        const signingKey = this.getSigningKey(this.credentials.secretKey, timestamp.substr(0, 8), region, 'execute-api')
        const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex')

        return signature
    }

    private getSigningKey(secretKey: string, dateStamp: string, region: string, service: string): Buffer {
        const kDate = crypto.createHmac('sha256', 'AWS4' + secretKey).update(dateStamp).digest()
        const kRegion = crypto.createHmac('sha256', kDate).update(region).digest()
        const kService = crypto.createHmac('sha256', kRegion).update(service).digest()
        const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest()
        return kSigning
    }

    /**
     * Make signed request to Amazon Product Advertising API v5
     */
    private async makeSignedRequest(payload: any): Promise<any> {
        const timestamp = new Date().toISOString().replace(/[:\-]|\.\d{3}/g, '')
        const endpoint = `https://${this.credentials.endpoint || 'webservices.amazon.com'}`
        
        const headers: Record<string, string> = {
            'Content-Type': 'application/json; charset=utf-8',
            'Host': this.credentials.endpoint || 'webservices.amazon.com',
            'X-Amz-Date': timestamp,
            'X-Amz-Target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems'
        }

        const payloadString = JSON.stringify(payload)
        const signature = this.generateSignature(
            'POST',
            '/',
            '',
            headers,
            payloadString,
            timestamp,
            this.credentials.region!
        )

        const credentialScope = `${timestamp.substr(0, 8)}/${this.credentials.region}/execute-api/aws4_request`
        const authHeader = [
            `AWS4-HMAC-SHA256 Credential=${this.credentials.accessKey}/${credentialScope}`,
            `SignedHeaders=${Object.keys(headers).sort().map(k => k.toLowerCase()).join(';')}`,
            `Signature=${signature}`
        ].join(', ')

        headers['Authorization'] = authHeader

        try {
            const response = await this.httpClient.post(endpoint, payload, { headers })
            return response.data
        } catch (error: any) {
            console.error('Amazon API request failed:', error.response?.data || error.message)
            throw new Error(`Amazon API request failed: ${error.response?.data?.message || error.message}`)
        }
    }

    /**
     * Fetch book data from Amazon using ISBN-13
     */
    async getBookByIsbn(isbn13: string): Promise<AmazonApiResponse> {
        try {
            // Convert ISBN to ASIN
            const asin = this.isbnToAsin(isbn13)

            // Prepare API request payload
            const payload = {
                PartnerTag: this.credentials.associateTag,
                PartnerType: 'Associates',
                MarketPlace: 'amazon.com', // Can be configured per region
                ItemIds: [asin],
                Resources: [
                    'ItemInfo.Title',
                    'ItemInfo.ByLineInfo',
                    'ItemInfo.ContentInfo',
                    'ItemInfo.Classifications',
                    'ItemInfo.ExternalIds',
                    'Images.Primary.Large',
                    'Images.Primary.Medium',
                    'Offers.Listings.Price',
                    'Offers.Listings.Availability'
                ]
            }

            // Make signed request
            const response = await this.makeSignedRequest(payload)

            if (response.Errors && response.Errors.length > 0) {
                const error = response.Errors[0]
                return {
                    success: false,
                    error: error.Code,
                    message: error.Message || 'Amazon API returned an error'
                }
            }

            if (!response.ItemsResult?.Items || response.ItemsResult.Items.length === 0) {
                return {
                    success: false,
                    message: 'Book not found on Amazon'
                }
            }

            // Parse and normalize the response
            const item = response.ItemsResult.Items[0]
            const bookData = this.normalizeAmazonResponse(item)

            return {
                success: true,
                data: bookData
            }

        } catch (error: any) {
            console.error('Error fetching book from Amazon:', error)
            return {
                success: false,
                error: 'API_ERROR',
                message: error.message || 'Failed to fetch book data from Amazon'
            }
        }
    }

    /**
     * Search for books on Amazon (alternative method if direct ISBN lookup fails)
     */
    async searchBooks(title: string, author?: string): Promise<AmazonApiResponse> {
        try {
            const keywords = author ? `${title} ${author}` : title

            const payload = {
                PartnerTag: this.credentials.associateTag,
                PartnerType: 'Associates',
                MarketPlace: 'amazon.com',
                SearchIndex: 'Books',
                Keywords: keywords,
                ItemCount: 1,
                Resources: [
                    'ItemInfo.Title',
                    'ItemInfo.ByLineInfo',
                    'ItemInfo.ContentInfo',
                    'ItemInfo.Classifications',
                    'ItemInfo.ExternalIds',
                    'Images.Primary.Large',
                    'Offers.Listings.Price'
                ]
            }

            const response = await this.makeSignedRequest(payload)

            if (response.Errors && response.Errors.length > 0) {
                return {
                    success: false,
                    error: response.Errors[0].Code,
                    message: response.Errors[0].Message
                }
            }

            if (!response.SearchResult?.Items || response.SearchResult.Items.length === 0) {
                return {
                    success: false,
                    message: 'No books found matching the search criteria'
                }
            }

            const item = response.SearchResult.Items[0]
            const bookData = this.normalizeAmazonResponse(item)

            return {
                success: true,
                data: bookData
            }

        } catch (error: any) {
            console.error('Error searching books on Amazon:', error)
            return {
                success: false,
                error: 'SEARCH_ERROR',
                message: error.message || 'Failed to search books on Amazon'
            }
        }
    }

    /**
     * Normalize Amazon API response to our standard format
     */
    private normalizeAmazonResponse(item: AmazonApiItem): AmazonBookData {
        const itemInfo = item.ItemInfo
        const offers = item.Offers?.Listings?.[0]

        // Extract authors
        const contributors = itemInfo?.ByLineInfo?.Contributors || []
        const authors = contributors
            .filter(c => c.Role === 'Author' || !c.Role)
            .map(c => c.Name)
            .filter(Boolean) as string[]

        // Extract ISBNs
        const externalIds = itemInfo?.ExternalIds
        const isbn13Values = externalIds?.EANs?.DisplayValues || []
        const isbn10Values = externalIds?.ISBNs?.DisplayValues || []

        // Extract price information
        let price
        if (offers?.Price) {
            price = {
                amount: offers.Price.Amount || 0,
                currency: offers.Price.Currency || 'USD',
                displayAmount: offers.Price.DisplayAmount
            }
        }

        return {
            title: itemInfo?.Title?.DisplayValue,
            authors: authors.length > 0 ? authors : undefined,
            imageUrl: item.Images?.Primary?.Large?.URL || item.Images?.Primary?.Medium?.URL,
            amazonUrl: item.DetailPageURL,
            price,
            isbn10: isbn10Values[0],
            isbn13: isbn13Values[0],
            asin: item.ASIN,
            publisher: undefined, // Not directly available in PA API v5
            publicationDate: itemInfo?.ContentInfo?.PublicationDate?.DisplayValue,
            availability: offers?.Availability?.Message,
            binding: itemInfo?.Classifications?.Binding?.DisplayValue
        }
    }

    /**
     * Test method for validating credentials and connectivity
     */
    async testConnection(): Promise<boolean> {
        try {
            // Try to fetch a well-known book (Clean Code by Robert Martin)
            const testIsbn = '9780132350884'
            const result = await this.getBookByIsbn(testIsbn)
            return result.success
        } catch (error) {
            console.error('Amazon API connection test failed:', error)
            return false
        }
    }
}

export default new AmazonApiService()