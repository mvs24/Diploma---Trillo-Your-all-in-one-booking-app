export const checkValidity = (value, requirements) => {
  let isValid = true;

  if (requirements.required) {
    isValid = isValid && value.trim().length !== 0;
  }
  if (requirements.minlength) {
    isValid = isValid && value.trim().length >= requirements.minlength;
  }
  if (requirements.isEmail) {
    isValid = isValid && /\S+@\S+\.\S+/.test(value);
  }
  if (requirements.min) {
    isValid = isValid && value.trim().length >= requirements.min;
  }
  if (requirements.moreThan) {
    isValid = isValid && new Date(value).getTime() > new Date().getTime();
  }
  if (requirements.minValue) {
    isValid = isValid && +value >= requirements.minValue;
  }
  if (requirements.maxValue) {
    isValid = isValid && +value <= requirements.maxValue;
  }

  return isValid;
};
