import { CatsService } from "../components/CatsService.js";


/// Objects and elements
const $cardsContainer = document.querySelector('[data-wr]');
const $popupWr = document.querySelector('[data-popupWr]'); //обращаемся к попапу
const $popupContentTemplate = document.querySelector('#popup-content-template').content;


const ACTIONS = {
    DETAIL: 'detail',
    DELETE: 'delete',
    EDIT: 'edit'
}

const base_url = 'https://cats.petiteweb.dev/api/single/Serenity0506';
const catsService = new CatsService(base_url);

//код добавления содержимого попапа
const getCreateCatHTMLElement = () => {
    return $popupContentTemplate.cloneNode(true).firstElementChild;
}

//код добавления карточки кота
const getCatHTML = (cat) => {
    return `
    <div data-cat-id=${cat.id} class="card">
    <div class="card__img_container">
        <img data-action=${ACTIONS.DELETE} class="card__delete" src="./images/trash-icon.png" alt="Удалить">
        <img class="card__img" src="${cat.image}" onerror="this.src='./images/fallback-img.jpg'"
            alt="${cat.name}"></div>
        <div class="card__footer">
            <h4 class="card__title">${cat.favorite ? '😻' : '🙀'} ${cat.name}</h4>
            <p class="card__text">${'⭐'.repeat(cat.rate)}</p>
            <p class="card__text">${cat.description}</p>
            
            <div class="card__button">
                <button data-action=${ACTIONS.DETAIL} type="button" class="card__button_detail">Детали</button>
            </div>
        </div>
    </div>
    `
}

/// Functions
//отображение всех котов из базы
catsService.getAllCats().then((cats) => {
    $cardsContainer.insertAdjacentHTML('afterbegin', cats.map(cat => getCatHTML(cat)).join(''))
    //обращаемся к контейнеру &wr, ставим в начало, обращаемся к cat(тк массив), 
    //методом map делаем из массива объектов - массив строк и записываем в пустую строку методом .join
})

//создание кота
const createCatCard = (e) => {
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
    catsService.addCat(popupDataObject)
        .then((isOk) => {
            if (isOk) {
                return $cardsContainer.insertAdjacentHTML(
                    'afterbegin',
                    getCatHTML(popupDataObject)
                ) //обращаемся к контейнеру &wr, ставим в начало, добавляем кота 
            }
            throw Error('Ошибка при создании кота') //показывается, если были ответы не 200, но тоже валидные
        }).catch(alert) //показывается, если фетч сломался
}

//удаление карточки кота путем делегирования
$cardsContainer.addEventListener('click', (e) => {
    const ds = e.target.dataset;

    if (ds.action) {
        const $catWr = e.target.closest('[data-cat-id]') //обращаемся к кнопке, а потом к ее родителю
        const catId = $catWr.dataset.catId //записали айди кота в переменную

        if (ds.action == ACTIONS.DELETE) {
            deleteCatCard(catId, $catWr);
        }
        else if (ds.action == ACTIONS.DETAIL) {
            openCatCard(catId);
        }
    }
})

function deleteCatCard(catId, cardElement) {
    catsService.deleteCat(catId)
        .then(isOk => { //вызвали метод делит из сервиса, взяли результат промиса isOk
            if (isOk) {
                return cardElement.remove() //если тру, то ретерн зааершит ф-цию
            }

            alert(`Удаление кота с id = ${catId} не удалось`) //или выведет алерт
        });
}

function openCatCard(catId) {
    $popupWr.innerHTML = ''
    $popupWr.addEventListener('click', closePopupOnBackgroundClick)
    $popupWr.prepend(getCreateCatHTMLElement())

    const cat = catsService.getCatFromStorage(catId)

    for (let inputName in cat) {
        let inputElement = document.forms.popup.elements.namedItem(inputName);
        inputElement.value = cat[inputName];

        if (inputElement.name == 'id' || inputElement.name == 'name') {
            inputElement.disabled = 'disabled'
        }
    }

    $popupWr.classList.remove('popup__invisible')
    const $popup = document.forms.popup;
    $popup.addEventListener('submit', updateCatCard) //добавили обработчик событий

}

const updateCatCard = (e) => {
    e.preventDefault()

    let catData = {}

    for (let el of document.forms.popup.elements) {
        if (el.tagName == 'INPUT' || el.tagName == 'TEXTAREA') {
            catData[el.name] = el.value
        }
    }

    catsService.editCat(catData)
        .then((isOk) => {
            if (isOk) {
                // нашли карточку, которую редактировали
                const editedCardElement = document.querySelector(`[data-cat-id="${catData.id}"]`)

                // Добавили карту с отредактированным котом перед существующей
                editedCardElement.insertAdjacentHTML(
                    'beforebegin',
                    getCatHTML(catData)
                )

                // удалили существующую карту
                editedCardElement.remove()

                $popupWr.classList.add('popup__invisible')
                $popupWr.removeEventListener('click', closePopupOnBackgroundClick)

                return
            }
            throw Error('Ошибка при создании кота') //показывается, если были ответы не 200, но тоже валидные
        }).catch(alert) //показывается, если фетч сломался
}

//закрытие попап кликом по фону
const closePopupOnBackgroundClick = (e) => {
    if (e.target === $popupWr) {
        $popupWr.classList.add('popup__invisible')
        $popupWr.removeEventListener('click', closePopupOnBackgroundClick)
        // $popup.removeEventListener('submit', submitPopupHandler) //удалили обработчик событий    }
    }
}

//закрытие попап кликом по крестику
const closePopupByCloseButton = (e) => {
    const closeButton = $popupWr.querySelector('.card__delete');
    if (e.target === closeButton) {
        $popupWr.classList.add('popup__invisible')
    }
}
$popupWr.addEventListener('click', closePopupByCloseButton);

//закрытие попап по клавише esc
document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        $popupWr.classList.add('popup__invisible')
        $popupWr.removeEventListener('click', closePopupOnBackgroundClick)
    }
}
);

//открытие попап
const openPopupHendler = (e) => { //добавляем обработчик события по клику на документ, чтобы открывать модалки
    const targetPopupName = e.target.dataset.openpopup;

    if (targetPopupName === 'createCat') {
        $popupWr.innerHTML = ''
        $popupWr.addEventListener('click', closePopupOnBackgroundClick)
        $popupWr.prepend(getCreateCatHTMLElement())
        $popupWr.classList.remove('popup__invisible')
        const $popup = document.forms.popup; //обращаемся к форме открытой
        $popup.addEventListener('submit', createCatCard) //добавили обработчик событий
    }
} //ф-ция открытия модалки

document.addEventListener('click', openPopupHendler) //по клику попап открыт
