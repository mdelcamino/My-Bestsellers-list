import 'source-map-support/register'
import { UpdateBSRequest } from '../../requests/UpdateBSRequest'

import { updateBS } from '../../businessLayer/BSLogic';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { parseUserId } from '../../auth/utils'

import { createLogger } from '../../utils/logger';

const logger = createLogger('update BS Item');


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', { event: event });

    const bsId = event.pathParameters.bsId
    const updatedBS: UpdateBSRequest = JSON.parse(event.body)

    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]
    const userId = parseUserId(jwtToken)
    logger.info('userId: ', { userId: userId });

  // Update an item of the bestseller list with the provided id of the item and the user using values in the "updatedTodo" object

    await updateBS(bsId, updatedBS, userId)
    logger.info('updated BS: ', { updatedBS: updatedBS });

    return {
        statusCode: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: ''

    };

}
