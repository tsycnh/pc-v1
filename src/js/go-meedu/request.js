import HttpClient from "../http-client";

class GoMeeduRequest {
  constructor(uri) {
    this.client = new HttpClient(uri);
  }

  chatMsgSend(courseId, videoId, params) {
    return this.client.post(
      `/addons/zhibo/api/v1/course/${courseId}/video/${videoId}/chat/send`,
      params
    );
  }

  chatMsgPaginate(courseId, videoId, params) {
    return this.client.get(
      `/addons/zhibo/api/v1/course/${courseId}/video/${videoId}/chat/msg`,
      params
    );
  }
}

export default GoMeeduRequest;
