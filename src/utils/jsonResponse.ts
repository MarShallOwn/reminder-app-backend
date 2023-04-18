type Response = {
    data?: any,
    error?: any,
}

const jsonResponse = (statusCode: number, message: string[] | string, response: Response) => {
    return({
        statusCode,
        message,
        response
    })
}

export default jsonResponse;