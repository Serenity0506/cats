const $wr = document.querySelector('[data-wr]');

const ACTIONS = {
    DETAIL: 'detail',
    DELETE: 'delete',
    EDIT: 'edit'
}

const getCatHTML = (cat) => {
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

fetch('https://cats.petiteweb.dev/api/single/Serenity0506/show/')
    .then((res) => res.json()) //получаем от сервера тело ответа (промис тоже) через обр.к json
    .then((data) => {
        $wr.insertAdjacentHTML('afterbegin', data.map(cat => getCatHTML(cat)).join('')) //обращаемся к контейнеру &wr, ставим в начало, обращаемся к data(тк массив), методом map делаем из массива объектов - массив строк и записываем в пустую строку методом .join
        
        
        console.log({data})
    })

    $wr.addEventListener('click', (e) => {
        if (e.target.dataset.action === ACTIONS.DELETE){
            console.log(e.target)

            const $catWr = e.target.closest('[data-cat-id]') //обращаемся к кнопке, а потом к ее родителю
            const catId = $catWr.dataset.catId //записали айди кота в переменную

            console.log({ catId })

            fetch(`https://cats.petiteweb.dev/api/single/Serenity0506/delete/${catId}`, { //делаем запрос на сервер на удаление
                method: 'DELETE',
            })
            .then(res => {
                if(res.status === 200) {
                    return $catWr.remove() //если тру, то ретерн зааершит ф-цию
                }

                alert(`Удаление кота с id = ${cat.id} не удалось`) //или выведет алерт
            })
        }
    })