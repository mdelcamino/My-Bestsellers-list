import * as uuid from 'uuid';

import { BSItem } from '../models/BSItem';
import { BSAccess } from '../dataLayer/BSAccess';

import { CreateBSRequest } from '../requests/CreateBSRequest';
import { UpdateBSRequest } from '../requests/UpdateBSRequest';

import { createLogger } from '../utils/logger';

const logger = createLogger('BSBusinessLayer');

const bsAccess = new BSAccess();

export async function updateBSUrl(bsId: string, userId: string): Promise<string> {
    logger.info('Entering updateBSUrl function');
    const url = await bsAccess.updateBSUrl(bsId, userId);
    return url;
}

export async function getBS(userId: string): Promise<BSItem[]> {
    logger.info('Entering getBS function');
    return bsAccess.getBS(userId)
}
export async function deleteBS(bsId: string, userId: string) {
    logger.info('Entering deleteBS function');
    return await bsAccess.deleteBS(bsId, userId);
}
export async function createBS( createBSRequest: CreateBSRequest, userId: string): Promise<BSItem> {

    logger.info('Entering createBS function');

    const bsId = uuid.v4();
    const timestamp = new Date().toISOString();

    return await bsAccess.createBS({
        userId: userId,
        bsId: bsId,
        createdAt: timestamp,
        tittle: createBSRequest.tittle,
        author: createBSRequest.author,
        valuation: createBSRequest.valuation,
     });
}

export async function updateBS( bsId: string,  updateBSRequest: UpdateBSRequest, userId: string
){

    logger.info('Entering updateBS function');

    await bsAccess.updateBS({
        tittle: updateBSRequest.tittle,
        author: updateBSRequest.author,
        valuation: updateBSRequest.valuation,
        attachmentUrl: updateBSRequest.attachmentUrl
    },
        bsId,
        userId);
}
