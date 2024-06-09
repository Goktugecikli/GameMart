const inventories = [
    { id: 1, name: "Minecraft", price: 10 },
    { id: 2, name: "Gta V", price: 70 },
    { id: 3, name: "GTA IV", price: 40 },
    { id: 4, name: "Cyberpunk 2077", price: 65 },
    { id: 5, name: "Kingdomecome Deliverince", price: 25 },
];

class User {
    constructor(username, password, balance, inventories) {
        this.username = username;
        this.password = password;
        this.balance = balance;
        this.inventories = inventories || [];
    }

    addToInventory(baseInventories, inventory) {
        let game = baseInventories.find(item => item.id === inventory.id);

        if (!game) {
            console.error(`Geçersiz oyun ID'si: ${inventory.id}`);
            return;
        }

        let isExist = this.inventories.some(item => item.id === inventory.id);

        if (isExist) {
            alert(`Bu oyuna zaten sahipsiniz: ${inventory.name}`);
            return;
        }
        if (inventory.price > this.balance) {
            console.error("Yetersiz Bakiye");
            return;
        }
        this.inventories.push(inventory);
        this.balance -= inventory.price; // Kullanıcının bakiyesinden ürün fiyatını düş

        // Kullanıcı envanterini güncelle
        this.updateUserInUsersArray();
        // alert(`Oyun Key: ${generateRandomSID(50 )}`);
    }

    updateUserInUsersArray() {
        // Kullanıcının envanterini güncelle
        const index = users.findIndex(user => user.username === this.username);
        if (index !== -1) {
            users[index].inventories = this.inventories;
            users[index].balance = this.balance;
        } else {
            console.error(`Kullanıcı bulunamadı: ${this.username}`);
        }
    }
}

let currentUser = new User();

let users = [
    new User('admin', '1', 1000),
    new User('Beyza', '12', 1000),
    new User('Kemal', '123', 1000)
];

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function clearCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
}

function updateUserBalanceAtHtml() {
    if (currentUser) {
        document.getElementById("balance").textContent = `$ ${currentUser.balance}`;
        document.getElementById('name').textContent = currentUser.username;
    } else {
        document.getElementById("balance").textContent = "Balance: $0";
    }
}

function Logout() {
    let test = clearCookie('username');
    currentUser = null;

}
function getCurrentDateTime() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero based
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}


function transferInventoryItem(sender, recipient, inventoryItem) {
    // Seçilen oyunu gönderen kullanıcının envanterinden kaldır
    sender.inventories = sender.inventories.filter(item => item.id !== inventoryItem.id);

    // Seçilen oyunu alan kullanıcının envanterine ekle
    recipient.inventories.push(inventoryItem);

    // Kullanıcı envanterlerini güncelle
    sender.updateUserInUsersArray();
    recipient.updateUserInUsersArray();
    alert(`${inventoryItem.name} oyunu ${getCurrentDateTime()} tarihinde, '${recipient.username}' kullanıcısına başarıyla gönderildi.`);
    // Kullanıcıların bakiyelerini ve envanterlerini güncelle
    updateUserBalanceAtHtml();
    showInventory(); // Envantarı yeniden göster
}

function showInventory() {
    const currentUserInventory = currentUser ? currentUser.inventories : [];
    const inventoryContainer = document.querySelector('.inventory');
    inventoryContainer.innerHTML = ''; // İçeriği temizle

    // Eğer kullanıcının envanteri boşsa
    if (currentUserInventory.length === 0) {
        const emptyInventoryMessage = document.createElement('div');
        emptyInventoryMessage.classList.add('empty-inventory-message');
        emptyInventoryMessage.textContent = "Mağazaya göz at";

        // Stil ekle
        emptyInventoryMessage.style.fontWeight = 'bold';
        emptyInventoryMessage.style.fontSize = '24px';
        emptyInventoryMessage.style.textAlign = 'center';


        // İçeriği ekle
        inventoryContainer.appendChild(emptyInventoryMessage);
        return;
    }
    // Kullanıcının envanterindeki her bir oyun için bir HTML elementi oluştur

    currentUserInventory.forEach(inventory => {

        const outerSquare = document.createElement('div');
        outerSquare.classList.add('outer-square');

        const gameName = document.createElement('div');
        gameName.classList.add('game-name');
        gameName.textContent = inventory.name;

        const gamePrice = document.createElement('div');


        const transferButton = document.createElement('button');
        transferButton.classList.add('transfer-button');
        transferButton.textContent = 'Transfer';
        transferButton.onclick = () => {
            // Kullanıcı adını al
            const recipientUsername = prompt("Lütfen transfer edilecek kullanıcının adını girin:");
            if (!recipientUsername) {
                console.log("Transfer iptal edildi.");
                return;
            }
            // Belirtilen alıcıyı bul
            const recipientUser = users.find(user => user.username.toLowerCase() === recipientUsername.toLowerCase());

            // Eğer alıcı mevcut değilse
            if (!recipientUser) {
                alert("Yanlış kullanıcı adı.");
                return;
            }
            if (recipientUser.inventories.some(item => item.id === inventory.id)) {
                alert(`'${recipientUser.username}' adlı kullanıcı oyuna sahiptir. Gönderim yapılamaz!`);
                return;
            }
            // Transfer işlemini gerçekleştir
            transferInventoryItem(currentUser, recipientUser, inventory);


        };

        // Oyunu dış kutuya ekle
        outerSquare.appendChild(gameName);
        outerSquare.appendChild(gamePrice);
        outerSquare.appendChild(transferButton);

        // Oyun dış kutusunu oyunlar konteynerine ekle
        inventoryContainer.appendChild(outerSquare);
    });



}

// "Envanter" bağlantısına tıklandığında envanteri göster


function createGameGridForMarket(inventories) {
    const gamesContainer = document.querySelector('.games');
    gamesContainer.innerHTML = '';
    inventories.forEach(inventory => {
        const outerSquare = document.createElement('div');
        outerSquare.classList.add('outer-square');

        const gameName = document.createElement('div');
        gameName.classList.add('game-name');
        gameName.textContent = inventory.name;

        const gamePrice = document.createElement('div');
        gamePrice.classList.add('game-price');
        gamePrice.textContent = `$${inventory.price}`;

        const addButton = document.createElement('button');
        addButton.classList.add('add-button');
        addButton.textContent = 'Buy';
        addButton.onclick = () => {
            if (!currentUser)
                console.error('Geçerli bir kullanıcı yok.');
            if (inventory.price > currentUser.balance) {
                alert("Yetersiz Bakiye");
                return;
            }
            currentUser.addToInventory(inventories, inventory);
            updateUserBalanceAtHtml();
            addButton.disabled = true; // Butonu deaktif et
            addButton.textContent = "Bu oyuna sahipsin"; // Butonu deaktif et

            addButton.style.backgroundColor = 'grey'; // Arka plan rengini mavi yap
        };

        outerSquare.appendChild(gameName);
        outerSquare.appendChild(gamePrice);
        outerSquare.appendChild(addButton);

        gamesContainer.appendChild(outerSquare);
    });
}

function setCurrentUser() {
    let usernameCookie = getCookie("username");
    const userToFind = users.find(user => user.username === usernameCookie);
    if (userToFind) {
        currentUser = new User(userToFind.username, userToFind.password, userToFind.balance, userToFind.inventories);
    } else {
        console.log('User not found');
    }
}
function generateRandomSID(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
document.addEventListener('DOMContentLoaded', function () {
    // users.forEach(userData => new User(userData.username, userData.pa ssword, userData.balance));

    const loginForm = document.querySelector('.login-box form');
    const mainDiv = document.querySelector('.main');
    const inventoryPage = document.querySelector('.inventory');
    const marketPage = document.querySelector('.market');

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        let user = users.find(u => u.username === username && u.password === password);
        if (!user) {
            alert('Kullanıcı adı veya şifre hatalı');
            return;
        }
        setCookie('username', username, 7);
        setCurrentUser();
        updateUserBalanceAtHtml();
        mainDiv.style.display = 'flex';
        document.querySelector('.login-screen').style.display = 'none';
        createGameGridForMarket(inventories);
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    });
    document.querySelector('a[href="#envanter"]').addEventListener('click', function () {
        marketPage.style.display = 'none';
        inventoryPage.style.display = 'flex';
        showInventory();

    });
    document.querySelector('a[href="#market"]').addEventListener('click', function () {
        marketPage.style.display = 'flex';
        inventoryPage.style.display = 'none';
        createGameGridForMarket(inventories);
    });

    document.querySelector('a[href="#logout"]').addEventListener('click', function () {
        mainDiv.style.display = 'none';
        document.querySelector('.login-screen').style.display = 'flex';
        Logout();
    });


});
