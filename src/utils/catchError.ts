import jsonResponse from "./jsonResponse";

export const catchError = (err, statusCode = 400) => {
    if (err instanceof Error) {
      return jsonResponse(statusCode, err.message, { error: err });
    } else {
      return jsonResponse(statusCode, "Something went wrong", { error: err });
    }
}