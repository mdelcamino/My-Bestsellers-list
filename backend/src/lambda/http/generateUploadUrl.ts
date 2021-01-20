import 'source-map-support/register'
import { updateBSUrl } from '../../businessLayer/BSLogic';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { parseUserId } from '../../auth/utils'

import { createLogger } from '../../utils/logger';

const logger = createLogger('create bestseller Item');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', { event: event });

    const bsId = event.pathParameters.bsId


    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]
    const userId = parseUserId(jwtToken)
    logger.info('userId: ', { userId: userId });

    const url = await updateBSUrl(bsId, userId)
    logger.info('BS url: ', { url: url });
    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*'
            //'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            uploadUrl: url
        })

    }

}


