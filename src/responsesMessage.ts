interface IResponseMessage {
    success: boolean;
    message: string;
}

export const responseMessage = (
    { success, message }: IResponseMessage,
    data?: any
) => {
    return {
        success,
        message,
        data
    };
};

interface IResponseError extends Error {
    status: number;
    data?: any;
}

export const errorMessage = ({ status, data, message }: IResponseError) => {
    return {
        status,
        data,
        message
    };
};
