document.addEventListener("DOMContentLoaded", async () => {
  const predictBtnElem = document.getElementById("predictBtn");
  const predictResultElem = document.getElementById("predictResultBox");

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

  predictBtnElem.addEventListener("click", async (event) => {
    event.preventDefault();

    const endpoint = "http://127.0.0.1:9000/predict";
    const rawResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        age: Number(age.value),
        gender: Number(gender.value),
        eduLevel: Number(eduLevel.value),
        jobTitle: Number(jobTitle.value),
        yearExp: Number(yearExp.value),
      }),
    });

    if (rawResponse.ok) {
      const resp = await rawResponse.json();
      predictResultElem.innerHTML = `
        Prediction:
        <span style="font-weight: 600; font-size: larger">
          $${Math.round(resp?.prediction)}
        </span> / year
      `;
    } else {
      alert("Model not ready, or something error :(");
    }
  });
});
