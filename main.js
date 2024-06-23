const resultEl = document.querySelector("#result");
const clipboardEl = document.querySelector("#clipboard");
const pwdLengthEl = document.querySelector("#pwdLength");
const pwdUpperEl = document.querySelector("#pwdUpperCase");
const pwdLowerEl = document.querySelector("#pwdLowerCase");
const pwdNumsEl = document.querySelector("#pwdNumbers");
const pwdSymbolsEl = document.querySelector("#pwdSymbols");
const genBtn = document.querySelector("#generate");

const randomFunc = {
  lower: getRandomLower,
  upper: getRandomUpper,
  number: getRandomNumber,
  symbol: getRandomSymbol
};

genBtn.addEventListener("click", () => {
  const len = +pwdLengthEl.value; //or parseInt(pwdLengthEl.value)
  const hasUpper = pwdUpperEl.checked;
  const hasLower = pwdLowerEl.checked;
  const hasNums = pwdNumsEl.checked;
  const hasSymbols = pwdSymbolsEl.checked;

  resultEl.textContent = generatePwd(
    len,
    hasUpper,
    hasLower,
    hasNums,
    hasSymbols
  );
});

clipboardEl.addEventListener("click", async () => {
  const toCopy = resultEl.textContent;
  let toastMsg = "";
  let toastMsgType = "";
  if(toCopy != ""){
    try {
      await navigator.clipboard.writeText(toCopy);
      toastMsg = "Copied !";
      toastMsgType = "success";
    } catch (err) {
      toastMsg = "Error !";
      toastMsgType = "error";
    }
    createToast(toastMsg, toastMsgType);
  }
});

/*random functions*/
function getRandomLower() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}
function getRandomUpper() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}
function getRandomNumber() {
  return String.fromCharCode(Math.floor(Math.random() * 10) + 48);
}
function getRandomSymbol() {
  const symbols = "!@#$%^&*(){}[]=<>/,.";
  return symbols[Math.floor(Math.random() * symbols.length)];
}

function generatePwd(len, upper, lower, number, symbol) {
  const typeCount = upper + lower + number + symbol;
  if(!typeCount){
    createToast("No checkboxes checked !", "error");
    return ;
  }
  const typesArr = [{ lower }, { upper }, { number }, { symbol }].filter(
    (type) => Object.values(type)[0]
  );
  console.log(typeCount, typesArr);

  let generatedPassword = "";
  for (let i = 0; i < len; i += typeCount) {
    for (let j = 0; j < typesArr.length; j++) {
      const randomFnIndex = Math.floor(Math.random() * typesArr.length);
      const randomFnName = Object.keys(typesArr[randomFnIndex])[0];
      // const fnRandom = Object.keys(randomFunc[randomFnName])[0];
      const fnRandom = randomFunc[randomFnName];
      // generatedPassword += window[fnRandom]();
      generatedPassword += fnRandom();
    }
  }

  return generatedPassword.slice(0, len);
}

function createToast(message, type="success"){
  if(message){
    const toast = document.createElement("div");
    toast.classList.add("toast");
    toast.classList.add(type);
    toast.textContent = message;
    
    document.body.append(toast);
    setTimeout(() => toast.remove(), 3000);
  }
}