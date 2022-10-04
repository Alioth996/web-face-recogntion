import '../pkg/face-api.js'
const video = document.querySelector('video')
// 开启摄像头
const openMedia = () => {
  if (!navigator.mediaDevices.getUserMedia) {
    document.querySelector('#app').innerHTML = '当前浏览器不支持该api'
    return
  }

  navigator.mediaDevices
    .getUserMedia({ video: {} })
    // 挂在video的媒体流,实现显示实时录屏画面
    .then(stream => (video.srcObject = stream))
    .catch(err => console.error(err))
}

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('../models'),
  faceapi.nets.faceExpressionNet.loadFromUri('../models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('../models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('../models')
])
  .then(openMedia)
  .catch(err => console.log('本地人脸数据加载失败:', err))

let timer = null
// 视频接入媒体流处理
video.addEventListener('play', e => {
  // 单个人脸数据
  // const detetion = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
  if (!timer) {
    // 从video创建一个canvas元素
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = { width: video.width, height: video.height }
    // 人脸位置校准,人脸居中识别,维度校正
    faceapi.matchDimensions(canvas, displaySize)

    // 获取多个人脸数据,基于不同人脸模型
    timer = setInterval(async () => {
      const allDetetions = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()

      const resizeDetections = faceapi.resizeResults(allDetetions, displaySize)
      // 清空画布
      canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height)
      // 画人脸识别框
      faceapi.draw.drawDetections(canvas, resizeDetections)
      // 骨骼识别
      faceapi.draw.drawFaceLandmarks(canvas, resizeDetections)
      //表情识别
      faceapi.draw.drawFaceExpressions(canvas, resizeDetections)
      timer = null
      clearInterval(timer)
    }, 200)
  }
})
