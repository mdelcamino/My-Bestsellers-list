import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { BSItem } from '../models/BSItem'
import {  BSUpdate } from '../models/BSUpdate'

export class BSAccess {

    constructor(
        private readonly s3_image = process.env.IMAGES_S3_BUCKET,
        private readonly s3 = new AWS.S3({
            signatureVersion: 'v4' // Use Sigv4 algorithm
        }),
        private readonly expirationtime = parseInt(process.env.SIGNED_URL_EXPIRATION),
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly bsTable = process.env.BS_TABLE) {
    }

    async getBS(userId: string): Promise<BSItem[]> {

        const result = await this.docClient.query({
            TableName: this.bsTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: { ':userId': userId },
            ScanIndexForward: false
        }).promise()
        const items = result.Items
        return items as BSItem[]
    }

    async createBS(bs: BSItem): Promise<BSItem> {
        await this.docClient.put({
            TableName: this.bsTable,
            Item: bs
        }).promise()

        return bs
    }

    async deleteBS(bsId: string, userId: string) {

        await this.docClient.delete({
            TableName: this.bsTable,
            Key: {
                userId: userId,
                bsId: bsId
            }
        }).promise();

    }
    async updateBS(bs: BSUpdate, bsId: string, userId: string) {
        var params = {
            TableName: this.bsTable,
            Key: {
                userId: userId,
                bsId: bsId
            },
           
            UpdateExpression: 'SET #valuation = :valuation',    
            ExpressionAttributeValues: {
                ':valuation': bs.valuation
            },
        
            ReturnValues: "UPDATED_NEW"
        }


        this.docClient.update(params , function (err, data) {
           if (err) console.log(err);
            else console.log(data);
        }).promise();

      /*  var params = {
            TableName: this.bsTable,
            Key: {
                userId: userId,
                bsId: bsId
            },
            ExpressionAttributeValues: {},
            ExpressionAttributeNames: {},
            UpdateExpression: "",
            ReturnValues: "UPDATED_NEW"
        };

        params["Key"][idAttributeName] = item[idAttributeName];

        let prefix = "set ";
        let attributes = Object.keys(item);
        for (let i = 0; i < attributes.length; i++) {
            let attribute = attributes[i];
            if (attribute != idAttributeName) {
                params["UpdateExpression"] += prefix + "#" + attribute + " = :" + attribute;
                params["ExpressionAttributeValues"][":" + attribute] = item[attribute];
                params["ExpressionAttributeNames"]["#" + attribute] = attribute;
                prefix = ", ";
            }
        }

        return await this.docClient.update(params).promise();
        */
    }



    async updateBSUrl(bsId: string, userId: string): Promise<string> {

        const url = this.s3.getSignedUrl("putObject", {
            Bucket: this.s3_image,
            Key: bsId,
            Expires: this.expirationtime
        });
        await this.docClient.update({
            TableName: this.bsTable,
            Key: { userId, bsId },
            UpdateExpression: "set attachmentUrl=:URL",
            ExpressionAttributeValues: {
                ":URL": url.split("?")[0]
            },
            ReturnValues: "UPDATED_NEW"
        }).promise();
    return url;
    }
    
}

