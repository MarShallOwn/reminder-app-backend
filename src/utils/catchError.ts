import jsonResponse from "./jsonResponse";

export const catchError = (err) => {
    console.log(err);
    if (err instanceof Error) {
      return jsonResponse(400, err.message, { error: err });
    } else {
      return jsonResponse(400, "Something went wrong", { error: err });
    }
}