const examplesContainer = document.querySelector('.examples');

const crusades = [{
  label: 'First Crusade',
  start: 1096,
  end: 1099
}, {
  label: 'Second Crusade',
  start: 1147,
  end: 1149
}, {
  label: 'Third Crusade',
  start: 1189,
  end: 1192
}, {
  label: 'Fourth Crusade',
  start: 1202,
  end: 1204
}, {
  label: 'Saladin',
  start: 1137,
  end: 1193 
}, {
  label: 'Richard the Lionheart',
  start: 1157,
  end: 1199
}];

const crusadesButton = document.createElement('button');
crusadesButton.textContent = 'Crusades';
crusadesButton.onclick = function () {
  draw(container, crusades);
};
examplesContainer.appendChild(crusadesButton);
