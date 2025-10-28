class StadisticsModel {
  //     {
  //         _id: ObjectId(), //ObjectId
  //         type: "", //String
  //         stream: ObjectId(), //ObjectId
  //         ip: "", //String
  //         videoOriginalUrl: "", //String
  //         userId: ObjectId(), //ObjectId
  //         data: [], // array
  //         time: "" // time
  //         createAt: "NOW", //timestamp
  //         navegator: "chrome"
  //         sessionId: ""
  //   }
  constructor(
    type,
    stream,
    ip,
    videoOriginalUrl,
    data,
    time,
    createAt,
    navegator,
    sessionId
  ) {
    this._type = String(type); //requerido
    this._stream = String(stream); //requerido
    this._videoOriginalUrl = String(videoOriginalUrl); //requerido
    this._ip = String(ip);
    this._data = Object(data);
    this._time = String(time);
    this._createAt = createAt ? createAt : Date.now;
    this._navegator = String(navegator);
    this._sessionId = String(sessionId);
  }

  get data() {
    return {
      type: this._type,
      stream: this._stream,
      ip: this._ip,
      videoOriginalUrl: this._videoOriginalUrl,
      data: this._data,
      time: this._time,
      createAt: this._createAt,
      navegator: this._navegator,
      sessionId: this._sessionId,
    };
  }
}

let obj = new StadisticsModel(
  "test",
  1,
  "0.0.0.1",
  1,
  [{ test: "data" }],
  "12:05",
  "2021-05-12",
  "Chrome",
  "123asd"
);

console.log(obj.data);
