const contactBox = document.querySelector('#contactBox');
const loadUsersBox = document.querySelector('#loadUsersBox');
const loadUsersBtn = document.querySelector('#loadUsersBtn');

const usersNumber = document.querySelector('#usersNumber')

const userList = document.querySelector('#userList')
const cardSkeleton = document.querySelector('#cardSkeleton')

const cardTemplate = document.querySelector('#cardTemplate')

loadUsersBtn.addEventListener('click', getUsersData)
userList.addEventListener('click', filterEvent)

function filterEvent(event) {
    if (event.target.className.includes('cardBtn')) {
        const parentNode = event.target.parentNode;
        const user = JSON.parse(parentNode.getAttribute('data-user'))
        showModalData(user)
    }
}

function showModalData(user) {
    const {
        avatar,
        email,
        first_name,
        id,
        last_name
    } = user

    Swal.fire({
        titleText: `#${id} - ${first_name} ${last_name}`,
        text: `${email}`,
        imageUrl: `${avatar}`,
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: `avatar of: ${first_name} `,
        confirmButtonColor: '#9edefd'
    })
}

function getUsersData() {
    toogleContactBox()
    printSkeleton(6);
    asyncFetching()
        .then((data) => {
            printNumber(data)
            userList.innerHTML = ''
            printUserData(data)
        })
        .catch((err) => {
            console.error(err)
            showToastWithError(err)
        })
}

function showToastWithError(error) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'bottom',
        iconColor: 'white',
        customClass: {
            popup: 'colored-toast',
        },
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
    });

    Toast.fire({
        icon: 'error',
        title: `${error}`,
    });
}

function printUserData(data) {
    data.forEach(user => {
        const {
            avatar,
            email,
            first_name,
            id,
            last_name
        } = user

        const cardContent = cardTemplate.content.cloneNode(true)
        cardContent.querySelector('div').setAttribute('data-user', JSON.stringify(user))
        const avatarImg = cardContent.querySelector('#avatarImg')
        avatarImg.src = avatar
        const firstName = cardContent.querySelector('#firstName')
        firstName.textContent = first_name
        const lastName = cardContent.querySelector('#lastName')
        lastName.textContent = last_name
        userList.appendChild(cardContent)
    })
}

function printSkeleton(numberOfSkeleton) {
    const skeletonArray = [...Array(numberOfSkeleton).keys()]
    skeletonArray.forEach(() => {
        const skeletonContent = cardSkeleton.content.cloneNode(true);
        userList.appendChild(skeletonContent);
    });
}

function printNumber(data) {
    usersNumber.innerHTML = `${data.length}`
}

function toogleContactBox() {
    contactBox.classList.toggle('hidden');
    loadUsersBox.classList.toggle('hidden');
}

const asyncFetching = async () => {
    const res = await fetch('https://reqres.in/api/users?delay=2');
    if (res.status !== 200) {
        throw new Error('Unable to fetch data')
    }
    const { data, ...rest } = await res.json()
    return (data)
}


