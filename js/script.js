let originalData = null;

async function loadData() {
    const response = await fetch('package.json');
    const data = await response.json();
    originalData = data;

    const allItemsList = document.getElementById("item-list");
    const movieZone = document.getElementById("movie-zone");
    const sitcomZone = document.getElementById("sitcom-zone");

    allItemsList.innerHTML = '';
    movieZone.innerHTML = '';
    sitcomZone.innerHTML = '';

    const allItems = [...data.movies, ...data.sitcoms].sort(() => Math.random() - 0.5);
    console.log("Shuffled list:", allItems.map(i => i.name));

    console.log(allItems);

    allItems.forEach(item => {
        allItemsList.appendChild(createDraggableItem(item));
    });


}


function createDraggableItem(item) {
    const div = document.createElement('div');
    div.className = 'item';
    div.textContent = item.name;
    div.setAttribute('draggable', 'true');
    div.dataset.category = item.category;
    div.dataset.id = item.id;

    div.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', JSON.stringify(item));
    });

    return div;
}

function setupDropZone(zoneId, expectedCategory) {
    const oldZone = document.getElementById(zoneId);
    const newZone = oldZone.cloneNode(true);
    oldZone.replaceWith(newZone);

    newZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        newZone.classList.add('over');
    });

    newZone.addEventListener('dragleave', () => {
        newZone.classList.remove('over');
    });

    newZone.addEventListener('drop', (e) => {
        e.preventDefault();
        newZone.classList.remove('over');

        const item = JSON.parse(e.dataTransfer.getData('text/plain'));

        if (item.category.toLowerCase() === expectedCategory.toLowerCase()) {
            const newItem = createDraggableItem(item);
            newZone.appendChild(newItem);


            const originalItem = document.querySelector(`.item[data-id='${item.id}']`);
            if (originalItem && originalItem.parentElement !== newZone) {
                originalItem.remove();
            }

        } else {
            alert(`Only ${expectedCategory}s are allowed in this zone.`);
        }
    });
}

setupDropZone("movie-zone", 'movie');
setupDropZone("sitcom-zone", 'sitcom');


document.getElementById('reset-btn').addEventListener('click', () => {
    if (originalData) {
        loadData();
    }
});


loadData();