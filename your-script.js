// your-script.js

// 获取视频和画布元素
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// 在页面加载完成后运行初始化函数
window.onload = async function () {
    // 加载 face-api.js 模型
    await faceapi.nets.tinyFaceDetector.loadFromUri('models');
    await faceapi.nets.faceExpressionNet.loadFromUri('models');

    // 获取摄像头权限
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    video.srcObject = stream;

    // 在视频加载后开始人脸检测
    video.onloadedmetadata = function () {
        video.play();
        detectEmotions();
    };
};

// 人脸检测和情绪识别函数
async function detectEmotions() {
    canvas.width = video.width;
    canvas.height = video.height;

    // 循环进行检测
    setInterval(async () => {
        // 使用 face-api.js 进行人脸检测和情绪识别
        const detections = await faceapi.detectAllFaces(video,
            new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();

        // 在画布上绘制人脸检测框和表情结果
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        detections.forEach(detection => {
            const emotions = detection.expressions;
            // 绘制人脸检测框等
            // ...

            // 输出表情结果为 JSON 格式
            const jsonResult = JSON.stringify({
                // ...
            });
            console.log(jsonResult);
        });
    }, 100); // 每100毫秒检测一次
}
