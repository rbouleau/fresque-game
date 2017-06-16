let database = firebase.database();
let candidates;
let list = document.getElementById('candidates');

firebase.database().ref('candidates').once('value').then(function(snapshot) {
  candidates = Object.values(snapshot.val());
  candidates.sort(function(a, b) {
    return b.score - a.score;
  });

  displayResults();
});

displayResults = () => {
  for (let candidate of candidates) {
    let newElement = document.createElement('li');
    newElement.innerText = `${candidate.firstname} ${candidate.lastname} (${candidate.score})`;
    list.append(newElement);
  }
};

random = () => {
  let index = Math.floor((Math.random() * candidates.length + 1));
  let items = list.children;
  let winner = items[index];

  for (let item of items) {
    item.classList.remove('winner');
  }
  winner.classList.add('winner');
}
