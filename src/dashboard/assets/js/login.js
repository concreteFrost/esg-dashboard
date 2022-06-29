/*
 =========================================================
 esg:one Dashboard Application
 =========================================================
 @license Copyright 2021 Beathamm Ltd (https://esg-one.co)
 @author  22 Digital Ltd (https://22digital.ltd)
 @author  Justin Hartman <code@22digital.ltd>
*/
const form = document.getElementById('form');
const button = document.getElementById('form-submit');
const error = document.getElementById('error-msg');
// const frmeml = document.getElementById('validate-frmeml');
// const frmpwd = document.getElementById('validate-frmpwd');

button.addEventListener('click', (e) => {
  e.preventDefault();
  const eml = form.frmeml.value;
  const pwd = form.frmpwd.value;
  const loc = '/dashboard/home.html';
  const lem = 'steve@esg-one.co';
  const lpw = 'WNRv~6Wsx=XsNZp';

  if (eml === lem && pwd === lpw) {
    location.href = loc;
  } else {
    // error.classList.remove('d-none');
    error.className = error.className.replace(/(?:^|\s)d-none(?!\S)/g, '');
    // frmeml.className += ' d-block p-2 m-0 rounded bg-white';
    // frmpwd.className += ' d-block p-2 m-0 rounded bg-white';
  }
});
