const nameList = document.querySelector('#name-list');
const form = document.querySelector('#add-name-form');

// create element & render name
function renderName(doc) {
    let li = document.createElement('li');
    let name = document.createElement('span');
    let position = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    position.textContent = doc.data().position;
    cross.textContent = 'x';

    li.appendChild(name);
    li.appendChild(position);
    li.appendChild(cross);

    nameList.appendChild(li);

    // deleting data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('easilydone').doc(id).delete();
    });
}



// saving data
form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('easilydone').add({
        name: form.name.value,
        position: form.position.value
    });
    form.name.value = '';
    form.position.value = '';
});

// real-time listener
db.collection('easilydone').orderBy('name').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        console.log(change.doc.data());
        if (change.type == 'added') {
            renderName(change.doc);
        } else if (change.type == 'removed') {
            let li = nameList.querySelector('[data-id=' + change.doc.id + ']');
            nameList.removeChild(li);
        }
    });
});

// updating records (console demo)
// db.collection('easilydone').doc('DOgwUvtEQbjZohQNIeMr').update({
//     name: 'mario world'
// });

// db.collection('easilydone').doc('DOgwUvtEQbjZohQNIeMr').update({
//     city: 'hong kong'
// });

// setting data
// db.collection('easilydone').doc('DOgwUvtEQbjZohQNIeMr').set({
//     city: 'hong kong'
// });
