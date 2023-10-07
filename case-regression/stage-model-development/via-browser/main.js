document.addEventListener("DOMContentLoaded", () => {
  const loadDataBtnElem = document.getElementById("loadDataBtn");
  const trainModelBtnElem = document.getElementById("trainModelBtn");
  const saveModelBtnElem = document.getElementById("saveModelBtn");
  const dataInfoElem = document.getElementById("dataInfoBox");
  const trainInfoElem = document.getElementById("trainInfoBox");

  let model;
  let csvDataset;
  let numOfFeatures;
  let flattenedDataset;

  let isDataLoaded = false;
  let isModelTrained = false;

  loadDataBtnElem.addEventListener("click", async () => {
    // See: https://js.tensorflow.org/api/latest/#data.csv
    csvDataset = tf.data.csv(
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
    numOfFeatures = (await csvDataset.columnNames()).length - 1;

    // Prepare the Dataset for training
    flattenedDataset = await csvDataset
      .map(({ xs, ys }) => {
        return { xs: Object.values(xs), ys: Object.values(ys) };
      })
      .batch(10);

    isDataLoaded = true;
    dataInfoElem.innerText = "Good! the data already loaded";
  });

  trainModelBtnElem.addEventListener("click", async () => {
    if (!isDataLoaded) {
      alert("Please load data first!");
      return;
    }

    // Define the model.
    model = tf.sequential();
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

    // Fit the model using the prepared Dataset
    trainInfoElem.innerHTML = "";
    await model.fitDataset(flattenedDataset, {
      epochs: 10,
      callbacks: {
        onEpochEnd: async (epoch, logs) => {
          trainInfoElem.innerHTML += `<div class="log-train">Epoch (pembelajaran) ke-${
            epoch + 1
          } => Loss MSE ${logs.loss}</div>`;
        },
      },
    });

    isModelTrained = true;
  });

  saveModelBtnElem.addEventListener("click", async () => {
    if (!isModelTrained) {
      alert("Please train model first!");
      return;
    }

    // Save the model into local device
    await model.save("downloads://model");
  });

  // Test 1
  // const testSample = tf.tensor2d([38, 1, 2, 150, 10.0], [1, 5]);
  // const prediction = await model.predict(testSample).data();
  // console.log("Prediction", prediction);
});
