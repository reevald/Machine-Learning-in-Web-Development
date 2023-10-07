document.addEventListener("DOMContentLoaded", async () => {
  const predictBtnElem = document.getElementById("predictBtn");
  const predictResultElem = document.getElementById("predictResultBox");
  const loadModelBtnElem = document.getElementById("loadModelBtn");
  const modelInfoElem = document.getElementById("modelInfoBox");

  const age = document.getElementById("age");
  const gender = document.getElementById("gender");
  const eduLevel = document.getElementById("eduLevel");
  const jobTitle = document.getElementById("jobTitle");
  const yearExp = document.getElementById("yearExp");

  const dictCategory = {
    Gender: gender,
    "Education Level": eduLevel,
    "Job Title": jobTitle,
  };

  const pathDataOption =
    "https://aneechan.github.io/assets/data/salary-prediction-dataset/data-helper.json";
  const dataOption = await fetch(pathDataOption).then((data) => data.json());

  Object.keys(dictCategory).forEach((category) => {
    dataOption[category].forEach((data, idx) => {
      dictCategory[
        category
      ].innerHTML += `<option value="${idx}">${data}</option>`;
    });
  });

  let model;

  loadModelBtnElem.addEventListener("click", async () => {
    const pathModel = "./model/model.json";
    model = await tf.loadLayersModel(pathModel);
    modelInfoElem.innerText = "Good! the model already loaded";
  });

  predictBtnElem.addEventListener("click", async (event) => {
    event.preventDefault();

    if (model == undefined) {
      alert("Please load model first!");
      return;
    }

    const inputModel = tf.tensor2d(
      [
        Number(age.value),
        Number(gender.value),
        Number(eduLevel.value),
        Number(jobTitle.value),
        Number(yearExp.value),
      ],
      [1, 5]
    );

    const prediction = await model.predict(inputModel).data();
    predictResultElem.innerHTML = `
      Prediction:
      <span style="font-weight: 600; font-size: larger">
        $${Math.round(prediction)}
      </span> / year
    `;
  });
});
