const $wr = document.querySelector('[data-wr]');

const getCatHTML = (cat) => {
    return `
    <div class="card">
    <div class="card__img_container">
        <img class="card__delete" src="./images/trash-icon.png" alt="Удалить">
        <img class="card__img" src="${cat.image}"
            alt=${cat.name}></div>
        <div class="card__footer">
            <h4 class="card__title">${cat.name}</h4>
            <p class="card__text">${cat.description}</p>
            <div class="card__button">
                <button data-action="detail" type="button" class="card__button_detail">Детали</button>
                <button data-action="delete" type="button" class="card__button_edit">Изменить</button>
            </div>
        </div>
    </div>
    `
}

fetch('https://cats.petiteweb.dev/api/single/Serenity0506/show/')
    .then((res) => res.json()) //получаем от сервера тело ответа (промис тоже) через обр.к json
    .then((data) => {
        $wr.insertAdjacentHTML('afterbegin', data.map(cat => getCatHTML(cat)).join('')) //обращаемся к контейнеру &wr, ставим в начало, обращаемся к data(тк массив), методом map делаем из массива объектов - массив строк и записываем в пустую строку методом .join
        
        
        console.log({data})
    })