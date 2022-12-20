const $wr = document.querySelector('[data-wr]');
const $popup = document.forms.popup; //обращаемся к форме открытой
const $popupWr = document.querySelector('[data-popupWr]'); //обращаемся к попапу
const $popupContent = document.querySelector('[data-popupContent]');

const ACTIONS = {
    DETAIL: 'detail',
    DELETE: 'delete',
    EDIT: 'edit'
}

const getCatHTML = (cat) => { //код добавления карточки кота
    return `
    <div data-cat-id=${cat.id} class="card">
    <div class="card__img_container">
        <img data-action=${ACTIONS.DELETE} class="card__delete" src="./images/trash-icon.png" alt="Удалить">
        <img class="card__img" src="${cat.image}"
            alt=${cat.name}></div>
        <div class="card__footer">
            <h4 class="card__title">${cat.name}</h4>
            <p class="card__text">${cat.description}</p>
            <div class="card__button">
                <button data-action=${ACTIONS.DETAIL} type="button" class="card__button_detail">Детали</button>
                <button data-action=${ACTIONS.EDIT} type="button" class="card__button_edit">Изменить</button>
            </div>
        </div>
    </div>
    `
}

fetch('https://cats.petiteweb.dev/api/single/Serenity0506/show/') // отображение всех котов из базы
    .then((res) => res.json()) //получаем от сервера тело ответа (промис тоже) через обр.к json
    .then((data) => {
        $wr.insertAdjacentHTML('afterbegin', data.map(cat => getCatHTML(cat)).join('')) //обращаемся к контейнеру &wr, ставим в начало, обращаемся к data(тк массив), методом map делаем из массива объектов - массив строк и записываем в пустую строку методом .join
    })

$wr.addEventListener('click', (e) => { //удаление путем делегирования 
    if (e.target.dataset.action === ACTIONS.DELETE) {
        console.log(e.target)

        const $catWr = e.target.closest('[data-cat-id]') //обращаемся к кнопке, а потом к ее родителю
        const catId = $catWr.dataset.catId //записали айди кота в переменную

        console.log({ catId })

        fetch(`https://cats.petiteweb.dev/api/single/Serenity0506/delete/${catId}`, { //делаем запрос на сервер на удаление
            method: 'DELETE',
        })
            .then(res => {
                if (res.status === 200) {
                    return $catWr.remove() //если тру, то ретерн зааершит ф-цию
                }

                alert(`Удаление кота с id = ${catId.id} не удалось`) //или выведет алерт
            })
    }
})


const submitPopupHandler = (e) => {
    e.preventDefault()

    let popupDataObject = Object.fromEntries(new FormData(e.target).entries());

    popupDataObject = { //будем преобразовывать полученные строки в инпутах в числа
        ...popupDataObject,
        id: +popupDataObject.id, //строка в намбер
        rate: +popupDataObject.rate,
        age: +popupDataObject.age,
        favorite: !!popupDataObject.favorite, //строка в булеан
    }

    //запрос на сервер на отправку данных на создание кота
    fetch('https://cats.petiteweb.dev/api/single/Serenity0506/add/', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json' //этим загловком мы сообщаем серверу, что отсылаем данные в формате json
        },
        body: JSON.stringify(popupDataObject) //тело запроса - превращаем объект в строку, чтобы ее передать по http в формате json
    })
        .then((res) => {
            if (res.status === 200) {
                return $wr.insertAdjacentHTML(
                    'afterbegin',
                    getCatHTML(popupDataObject)
                ) //обращаемся к контейнеру &wr, ставим в начало, добавляем кота 
            }
            throw Error('Ошибка при создании кота') //показывается, если были ответы не 200, но тоже валидные
        }).catch(alert) //показывается, если фетч сломался
}
//нужно сделать валидацию данных (1:12 тайминг)

const clickPopupWrHandler = (e) => {
    if (e.target === $popupWr) {
        $popupWr.classList.add('popup__invisible')
        $popupWr.removeEventListener('click', clickPopupWrHandler)
        $popup.removeEventListener('submit', submitPopupHandler) //удалили обработчик событий    }
    }
}

const openPopupHendler = (e) => { //добавляем обработчик события по клику на документ, чтобы открывать модалки
    const targetPopupName = e.target.dataset.openpopup;

    if (targetPopupName === 'createCat') {
        $popupWr.classList.remove('popup__invisible')
        $popupWr.addEventListener('click', clickPopupWrHandler)
        $popup.addEventListener('submit', submitPopupHandler) //добавили обработчик событий
    }
} //ф-ция открытия модалки

document.addEventListener('click', openPopupHendler) //по клику попап открыт

document.addEventListener('keydown', (e) => {
    console.log(e)

    if (e.key === "Escape") {
        $popupWr.classList.add('popup__invisible')
        $popupWr.removeEventListener('click', clickPopupWrHandler)
        $popup.removeEventListener('submit', submitPopupHandler) //удалили обработчик событий
    }
}
);

function handlePopupCloseButton(e) {
    const closeButton = $popup.querySelector('.card__delete');
    if (e.target === closeButton) {
        $popupWr.classList.add('popup__invisible')
    }
}
$popupWr.addEventListener('click', handlePopupCloseButton);
