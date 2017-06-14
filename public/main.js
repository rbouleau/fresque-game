// Initialize material component
snackbar = mdc.snackbar.MDCSnackbar.attachTo(document.querySelector('.mdc-snackbar'));
dialog = mdc.dialog.MDCDialog.attachTo(document.querySelector('#my-mdc-dialog'));

// Init Firebase database
var database = firebase.database();

// Move from contact form to game page
function nextStep() {
  var step1 = document.getElementById('step1'),
      step2 = document.getElementById('step2');

  step1.classList.add('invisible');
  step2.classList.remove('invisible');

  document.querySelector('.footer_button').remove();
  document.querySelector('.caption').remove();
  document.querySelector('textarea').focus();

  // Start countdown
   countdown();
}


// INSERT new candidate in database
function registerCandidate(json) {
  var newCandidateRef = database.ref('candidates/').push();
  newCandidateRef.set(json);

  // UI notification
  snackbar.show({
    message: 'Candidature envoyée, Merci !',
    multiline: true,
    timeout: 4000,
  });

  // Reload web app after submission
  setTimeout(() => {
    window.location.reload();
  }, 2000);

}


// Called when user click contact form button
submitCandidate = function () {
   document.body.classList.add('touched');

   var firstname = document.querySelector('#firstname');
   var lastname = document.querySelector('#lastname');
   var email = document.querySelector('#email');
   var phone = document.querySelector('#phone');
   var candidate = document.querySelector('#candidate');

   var validity =
      firstname.validity.valid && lastname.validity.valid && email.validity.valid && phone.validity.valid;

   var msg;

   if (!phone.validity.valid) {
     msg = 'Veuillez saisir un numéro de téléphone valide';
   }

   if (!email.validity.valid) {
     msg = 'Veuillez saisir une adresse email valide\n\n';
   }

   if (!lastname.validity.valid) {
     msg = 'Veuillez saisir votre nom\n\n';
   }

   if (!firstname.validity.valid) {
     msg = 'Veuillez saisir votre prénom\n\n';
   }

   if (!validity) {
     snackbar.show({
       message: msg,
       multiline: true,
       timeout: 1800,
     });
     return false;
   }

   dialog.show();
 };

 function countdown() {
 let el = document.querySelector('.counter');
 let val = 45;
 setTimeout(() => {
   el.remove();
   document.getElementById('answer').setAttribute('disabled', true)

  var payload = {
    type: 'candidate',
    firstname: firstname.value.toLowerCase(),
    lastname: lastname.value.toLowerCase(),
    email: email.value,
    phone: phone.value,
    candidate: candidate.checked,
    score: getScore()
  };

  registerCandidate(payload);

}, 45000);

 setInterval(() => {
   val--;
   el.innerText = val;
 }, 1000);
}

dialog.listen('MDCDialog:accept', () => {
  nextStep();
});

getScore = () => {
  let answer = document.getElementById('answer').value.split(/,| |\n/);
  answer = answer.map(x => x.trim());
  let score = _.intersection(answer, gold).length;

  if (answer.indexOf('axolotl') > -1) {
    score += 5;
  }

  return score;
};
