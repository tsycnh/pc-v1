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

  Sign(courseId, videoId, id, params) {
    return this.client.post(
      `/addons/zhibo/api/v1/course/${courseId}/video/${videoId}/signIn/${id}`,
      params
    );
  }

  LiveWatchRecord(courseId, videoId, params) {
    return this.client.post(
      `/addons/zhibo/api/v1/course/${courseId}/video/${videoId}/LiveWatchRecord`,
      params
    );
  }

  VodWatchRecord(courseId, videoId, params) {
    return this.client.post(
      `/addons/zhibo/api/v1/course/${courseId}/video/${videoId}/vodWatchRecord`,
      params
    );
  }
}

export default GoMeeduRequest;
