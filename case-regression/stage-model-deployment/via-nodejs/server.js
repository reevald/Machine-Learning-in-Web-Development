const Hapi = require("@hapi/hapi");
const tf = require("@tensorflow/tfjs");
require("@tensorflow/tfjs-node");

// Load model
let model;
let isModelLoaded = false;
const pathModel = `file:///${process.cwd()}/model/model.json`;

tf.loadLayersModel(pathModel).then((m) => {
  model = m;
  isModelLoaded = true;
});

const predictHandler = async (request, h) => {
  if (!isModelLoaded) {
    return h
      .response({
        message: "Model not loaded yet! please wait a few seconds.",
      })
      .code(400);
  }

  const { age, gender, eduLevel, jobTitle, yearExp } = request.payload;
  const inputModel = tf.tensor2d(
    [age, gender, eduLevel, jobTitle, yearExp],
    [1, 5]
  );
  const prediction = await model.predict(inputModel).data();
  return { prediction: prediction[0] };
};

const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: "127.0.0.1", // or try with "localhost"
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  server.route([
    {
      method: "GET",
      path: "/",
      handler: () => "Hello world!",
    },
    {
      method: "POST",
      path: "/predict",
      handler: predictHandler,
    },
  ]);

  // Run server
  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
