const faceapi = require("face-api.js");
const canvas = require("canvas");
const { Canvas, Image, ImageData } = canvas;

faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

let modelsLoaded = false;

async function loadModels() {
  if (modelsLoaded) return;
  await faceapi.nets.ssdMobilenetv1.loadFromDisk("./models");
  await faceapi.nets.faceRecognitionNet.loadFromDisk("./models");
  await faceapi.nets.faceLandmark68Net.loadFromDisk("./models");
  modelsLoaded = true;
  console.log("Face models loaded");
}

async function createEmbedding(base64) {
  try {
    await loadModels();

    const img = await canvas.loadImage(Buffer.from(base64, "base64"));

    const detection = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) return null;

    return Array.from(detection.descriptor); // float32 → array
  } catch (err) {
    console.log("Embedding error:", err);
    return null;
  }
}

function cosineSimilarity(a, b) {
  if (a.length !== b.length) throw new Error("Vector length mismatch");

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));

  //   const sim = cosineSimilarity(face1_embedding, face2_embedding);
  // console.log("Similarity:", sim);

  // if (sim > 0.6) {
  //   console.log("Same person ");
  // } else {
  //   console.log("Different person ");
  // }
}

function euclideanDistance(a, b) {
  if (a.length !== b.length) throw new Error("Vector length mismatch");

  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += (a[i] - b[i]) ** 2;
  }

  return Math.sqrt(sum);

  // const dist = euclideanDistance(face1_embedding, face2_embedding);
  // if (dist < 0.6) {
  //   console.log("Same person ");
  // }
}

module.exports = { createEmbedding, cosineSimilarity, euclideanDistance };
