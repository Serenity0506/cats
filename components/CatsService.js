class CatsService {
    constructor(base_url) {
        this.base_url = base_url;
        this.ls = window.localStorage;
    }

    getAllCats = async () => { //функция возвращает промис
        const resp = await fetch(this.base_url + '/show/');
        const cats = await resp.json();

        cats.forEach(cat => {
            this.ls.setItem(
                `cat-${cat.id}`,
                JSON.stringify(cat)
            ) //cat - элемент массива с инф о коте
        });

        return cats; //вернули массив с объектами котов
    }

    getCatFromStorage = (catId) => {
        return JSON.parse(
            this.ls.getItem(`cat-${catId}`)
        )
    }

    addCat = async (cat) => {
        const resp = await fetch(this.base_url + '/add/', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json' //этим загловком мы сообщаем серверу, что отсылаем данные в формате json
            },
            body: JSON.stringify(cat),
        })
        const isOk = resp.status === 200;
        return isOk;
    }

    deleteCat = async (catId) => {
        const resp = await fetch( //делаем запрос на сервер на удаление
            this.base_url + `/delete/${catId}`,
            { method: 'DELETE' }
        );

        const isOk = resp.status === 200;
        return isOk;
    }


    editCat = async (catData) => {
        let catId = catData.id

        let catDataСastrated = {
            ...catData
        }

        delete catDataСastrated.id
        delete catDataСastrated.name

        const resp = await fetch(this.base_url + `/update/${catId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json' //этим загловком мы сообщаем серверу, что отсылаем данные в формате json
            },
            body: JSON.stringify(catDataСastrated),
        }
        );

        const isOk = resp.status === 200;
        return isOk;
    }
}


export { CatsService }