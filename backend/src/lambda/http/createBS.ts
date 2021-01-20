import 'source-map-support/register'
import * as uuid from 'uuid'
import { createBS } from '../../businessLayer/BSLogic';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { parseUserId } from '../../auth/utils'
import { CreateBSRequest } from '../../requests/CreateBSRequest'
import { createLogger } from '../../utils/logger';

const logger = createLogger('create BS Item');


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', { event: event });
    const newBS: CreateBSRequest = JSON.parse(event.body)
    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]
    logger.info('jwtToken: ', { jwtToken: jwtToken });

    const userId = parseUserId(jwtToken)
    logger.info('userId: ', { userId: userId });
    // if user is not authenticated, error message

    if (!authorization) {
        return {
            statusCode: 404,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                error: 'Not a valid user'
            })
        }
    }


        // Create a new item in my bestseller item list

        const bsId = uuid.v4()
        const timestamp = new Date().toISOString()
        const newBSItem = {
            bsId,
            timestamp,
            userId,
            ...newBS,//name and duedate
        }

    // Create BS item
    const BSitem = await createBS(newBSItem, userId);
    logger.info('BS item created: ', { BSitem: BSitem });

        return {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                item: BSitem
            })

        }
    
}
