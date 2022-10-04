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

// 视频接入媒体流处理
video.addEventListener('play', async e => {
  // 单个人脸数据
  const detetion = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())

  // 获取多个人脸数据,基于不同人脸模型
  // const allDetetions = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
  console.log(detetion)
})
