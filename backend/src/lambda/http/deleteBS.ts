import 'source-map-support/register'
import { deleteBS } from '../../businessLayer/BSLogic';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { parseUserId } from '../../auth/utils'

import { createLogger } from '../../utils/logger';

const logger = createLogger('create BS Item');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', { event: event });

    const bsId = event.pathParameters.bsId;

    const authorization = event.headers.Authorization;
    const split = authorization.split(' ');
    const jwtToken = split[1];
    logger.info('jwtToken: ', { jwtToken: jwtToken });

    const userId = parseUserId(jwtToken);
    logger.info('userId: ', { userId: userId });
    
    // Remove an item on my bestseller list
    await deleteBS(bsId, userId)
    logger.info('BS deleted: ', { bsId: bsId });

    return {
        statusCode: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: ''
    };
    
}
