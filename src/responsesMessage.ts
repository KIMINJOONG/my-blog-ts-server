interface IResponseMessage {
  success: boolean;
  message: string;
}

export const responseMessage = (
  { success, message }: IResponseMessage,
  data?: any,
  totalCount?: number,
) => {
  return {
    success,
    message,
    data,
    totalCount,
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
    message,
  };
};
