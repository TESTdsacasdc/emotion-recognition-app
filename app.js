
async function setupWebcam() {
    const video = document.getElementById('video');
    const stream = await navigator.mediaDevices.getUserMedia({ 'video': true });
    video.srcObject = stream;

    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}

async function detectEmotions(video) {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
    
    // Format the result
    const formattedResult = detections.map(d => ({
        faceId: d._detection._imageDims._width.toString(), // Use any unique identifier. Here I'm just using width for simplicity.
        faceRectangle: {
            top: d._detection._box._y,
            left: d._detection._box._x,
            width: d._detection._box._width,
            height: d._detection._box._height,
        },
        faceAttributes: {
            gender: 'unknown', // face-api.js doesn't provide gender. You'd need a different library or API for this.
            age: 0, // face-api.js doesn't provide age. You'd need a different library or API for this.
            emotion: d._expressions
        }
    }));
    
    console.log(formattedResult);
}

async function main() {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceExpressionNet.loadFromUri('/models');

    const video = await setupWebcam();
    video.play();

    video.addEventListener('play', () => {
        setInterval(async () => {
            await detectEmotions(video);
        }, 100);
    });
}

main();
