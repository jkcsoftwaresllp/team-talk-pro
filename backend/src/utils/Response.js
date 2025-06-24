
export class Response {
  static success(message, data = null) {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    };
  }

  static error(message, errors = null) {
    return {
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString()
    };
  }
}
