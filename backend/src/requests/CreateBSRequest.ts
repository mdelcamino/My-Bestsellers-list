
/**
 * Fields in a request to create a single bs item.
 */
export interface CreateBSRequest {
    tittle: string
    author: string
    createdAt: string
    valuation: string
    attachmentUrl?: string
}
