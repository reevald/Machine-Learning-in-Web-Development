import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-node";

const main = async () => {
  // Load data
  // See: https://js.tensorflow.org/api/latest/#data.csv
  console.log("Load data...[🔃]");
  const csvDataset = tf.data.csv(
    "https://aneechan.github.io/assets/data/salary-prediction-dataset/data-structured.csv",
    {
      columnConfigs: {
        Salary: {
          isLabel: true,
        },
      },
    }
  );

  // Number of features is the number of column names minus one for the label column
  const numOfFeatures = (await csvDataset.columnNames()).length - 1;

  // Prepare the Dataset for training
  const flattenedDataset = await csvDataset
    .map(({ xs, ys }) => {
      return { xs: Object.values(xs), ys: Object.values(ys) };
    })
    .batch(10);
  console.log("Load data...[✅]");

  // Define the model.
  console.log("Create model...[🔃]");
  const model = tf.sequential();
  model.add(
    tf.layers.dense({
      inputShape: [numOfFeatures],
      units: 1,
    })
  );
  model.compile({
    loss: "meanSquaredError",
    optimizer: tf.train.sgd(0.00001),
  });
  console.log("Create model...[✅]");

  // Fit the model using the prepared Dataset
  console.log("Training model...[🔃]");
  await model.fitDataset(flattenedDataset, {
    epochs: 10,
    callbacks: {
      onEpochEnd: async (epoch, logs) => {
        console.log(
          `Epoch (pembelajaran) ke-${epoch + 1} => Loss MSE ${logs.loss}`
        );
      },
    },
  });
  console.log("Training model...[✅]");

  await model.save(`file:///${process.cwd()}`);
  console.log("Save model...[✅]");
};

main();
