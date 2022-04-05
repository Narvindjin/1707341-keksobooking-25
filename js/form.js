const form = document.querySelector('.ad-form');
const formFieldsets = form.querySelectorAll('fieldset');
const filters = document.querySelector('.map__filters');
const filtersFieldsets = filters.querySelectorAll('fieldset');
const filtersSelect = filters.querySelectorAll('select');
const formPrice = form.querySelector('#price');

//из модуля 7 задания 2 функции перевода страницы в активное/неактивное состояние
const disablePage = function () {
  form.classList.add('ad-form--disabled');
  filters.classList.add('map__filters--disabled');
  const disableNodeList = function (nodeList) {
    for (let i = 0; i < nodeList.length; i++) {
      nodeList[i].setAttribute('disabled','');
    }
  };
  disableNodeList(formFieldsets);
  disableNodeList(filtersFieldsets);
  disableNodeList(filtersSelect);
};
const enablePage = function () {
  form.classList.remove('ad-form--disabled');
  filters.classList.remove('map__filters--disabled');
  const enableNodeList = function (nodeList) {
    for (let i = 0; i < nodeList.length; i++) {
      nodeList[i].removeAttribute('disabled');
    }
  };
  enableNodeList(formFieldsets);
  enableNodeList(filtersFieldsets);
  enableNodeList(filtersSelect);
};

// проставление всем полям ввода с аттрибутами стандартных сообщений об ошибке
const setInputErrorMessages = function(formWithInputs) {
  const inputs = formWithInputs.querySelectorAll('fieldset input');
  for (let i = 0; i < inputs.length; i++){
    if (inputs[i].hasAttribute('required')) {
      inputs[i].setAttribute('data-pristine-required-message','Обязательное поле');
    }
    if (inputs[i].hasAttribute('minlength')) {
      const inputMinlength = inputs[i].getAttribute('minlength');
      inputs[i].setAttribute('data-pristine-minlength-message',`Минимальная длина ${inputMinlength} символов`);
    }
    if (inputs[i].hasAttribute('maxlength')) {
      const inputMaxlength = inputs[i].getAttribute('maxlength');
      inputs[i].setAttribute('data-pristine-maxlength-message',`Максимальная длина ${inputMaxlength} символов`);
    }
    if (inputs[i].hasAttribute('max')) {
      const inputMax = inputs[i].getAttribute('max');
      inputs[i].setAttribute('data-pristine-max-message',`Максимальное значение ${inputMax}`);
    }
    if (inputs[i].getAttribute('type') === 'number') {
      inputs[i].setAttribute('data-pristine-number-message','Пожалуйста, введите число');
    }
  }
};
setInputErrorMessages(form);

//фикс стандартной ошибки минимального значения для цены
const formPricePlaceholder = formPrice.min;
formPrice.min = Number.NEGATIVE_INFINITY;

// валидатор
const pristine = new Pristine(form, {
  classTo: 'ad-form__element',
  errorTextParent: 'ad-form__element',
  errorTextTag: 'div',
  errorTextClass: 'ad-form__error'
});

//поля типа жилья и цены за ночь
const formType = form.querySelector('#type');
formPrice.min = formPricePlaceholder;
//установление минимальной цены в зависимости от типа жилья
const setMinPrice = function() {
  const type = formType.value;
  let minPrice = 0;
  switch (type) {
    case 'bungalow':
      break;
    case 'flat':
      minPrice = 1000;
      break;
    case 'hotel':
      minPrice = 3000;
      break;
    case 'house':
      minPrice = 5000;
      break;
    case 'palace':
      minPrice = 10000;
      break;
  }
  formPrice.setAttribute('min', minPrice);
  formPrice.setAttribute('placeholder', minPrice);
};

//кастомный валидатор для минимальной цены
pristine.addValidator(formPrice, (value) => {
  const valueNumber = Number(value);
  return valueNumber >= formPrice.min;
}, () => `Минимальное значение ${formPrice.min}`);

formType.addEventListener ('change', () =>{
  setMinPrice();
  pristine.validate(formPrice);
});

//синхронизация времени заезда и выезда
const timeinSelect = form.querySelector('#timein');
const timeoutSelect = form.querySelector('#timeout');

timeinSelect.addEventListener ('change', () => {
  const selectValue = timeinSelect.value;
  timeoutSelect.value = selectValue;
});

timeoutSelect.addEventListener ('change', () => {
  const selectValue = timeoutSelect.value;
  timeinSelect.value = selectValue;
});

//поля количества комнат и количества мест
const formCapacity = form.querySelector('#capacity');
const formRooms = form.querySelector('#room_number');

//кастомный валидатор для количества мест
pristine.addValidator(formCapacity, (value) => {
  const roomsNumber = formRooms.value;
  switch (roomsNumber){
    case '1':
      return (value === '1');
    case '2':
      return (value === '1' || value === '2');
    case '3':
      return (value === '1' || value === '2' || value === '3');
    case '100':
      return (value === '0');
  }
  return false;
}, 'Недопустимое значение');
formRooms.addEventListener ('change', () =>{
  pristine.validate(formCapacity);
});

//отправка формы
form.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const isValid = pristine.validate();
  if (isValid) {
    form.submit();
  }
});

disablePage();
enablePage();
