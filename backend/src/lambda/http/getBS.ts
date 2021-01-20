import 'source-map-support/register'
import { getBS } from '../../businessLayer/BSLogic';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { parseUserId } from '../../auth/utils'

import { createLogger } from '../../utils/logger';

const logger = createLogger('fetching BS Items');


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Get all items on a bestseller list for a current user
    logger.info('Processing event: ', { event: event });

    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]
    const userId = parseUserId(jwtToken)
     
    const items = await getBS(userId);

    logger.info('BS items fetched: ', { items: items });


    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            items
        })
    }


}
