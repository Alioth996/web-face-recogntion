const video = document.querySelector('video')
// 开启摄像头
const openMedia = () => {
  if (!navigator.mediaDevices.getUserMedia) {
    document.querySelector('#app').innerHTML = '当前浏览器不支持该api'
    return
  }

  navigator.mediaDevices
    .getUserMedia({ video: {} })
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

video.addEventListener('play', () => {})
