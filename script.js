// ✅ Klasa z dodatkowym polem 'status'
class Booking {
    constructor(id, name, date, type, guests) {
        this.id = id;
        this.name = name;
        this.date = date;
        this.type = type;
        this.guests = parseInt(guests);
        this.status = "Nowa"; // Domyślny status
    }
}

const btnAdd = document.querySelector('#btnDodaj');
const grid = document.getElementById('listaRez');
const searchInput = document.getElementById('search');
const btnReset = document.getElementById('btnReset');

let db = JSON.parse(localStorage.getItem('restaurant_db_pro')) || [];

// ✅ Złożona funkcja: Liczenie statystyk (Dodatkowe wymaganie)
function updateStats() {
    const totalRez = db.length;
    const totalGuests = db.reduce((sum, item) => sum + item.guests, 0);
    
    document.getElementById('countRez').innerText = totalRez;
    document.getElementById('countGosci').innerText = totalGuests;
    document.getElementById('currentDate').innerText = new Date().toLocaleDateString();
}

// ✅ Dynamiczne tworzenie widoku z kolorowymi statusami
function render(data = db) {
    grid.innerHTML = '';
    
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        // Dynamiczna zmiana stylu w zależności od liczby osób
        if(item.guests >= 6) card.style.borderLeftColor = "#f1c40f"; 

        card.innerHTML = `
            <div class="card-header">
                <h3>${item.name}</h3>
                <span class="badge">${item.status}</span>
            </div>
            <p>📅 <strong>Data:</strong> ${item.date}</p>
            <p>📍 <strong>Miejsce:</strong> ${item.type}</p>
            <p>👥 <strong>Osoby:</strong> ${item.guests}</p>
            <div class="card-actions">
                <button class="btn-status" onclick="changeStatus(${item.id})">Zmień status</button>
                <button class="btn-del" onclick="remove(${item.id})">Usuń</button>
            </div>
        `;
        grid.appendChild(card);
    });
    updateStats();
}

// ✅ Rozbudowana Walidacja (Dodatkowe wymaganie)
btnAdd.addEventListener('click', () => {
    const name = document.getElementById('inpKlient').value;
    const date = document.getElementById('inpData').value;
    const type = document.getElementById('inpStolik').value;
    const guests = document.getElementById('inpOsoby').value;

    const today = new Date().toISOString().split('T')[0];

    if(name.length < 3) {
        showMsg("❌ Imię za krótkie!", "red");
        return;
    }
    if(!date || date < today) {
        showMsg("❌ Wybierz poprawną datę (nie z przeszłości)!", "red");
        return;
    }
    if(guests < 1 || guests > 20) {
        showMsg("❌ Liczba osób: 1-20", "red");
        return;
    }

    const newBooking = new Booking(Date.now(), name, date, type, guests);
    db.push(newBooking);
    
    updateStorage();
    showMsg("✅ Rezerwacja dodana!", "green");
    clearForm();
});

// ✅ Zmiana statusu (Logika aplikacji)
window.changeStatus = (id) => {
    const index = db.findIndex(item => item.id === id);
    const statuses = ["Nowa", "Potwierdzona", "W realizacji", "Zakończona"];
    let currentPos = statuses.indexOf(db[index].status);
    db[index].status = statuses[(currentPos + 1) % statuses.length];
    updateStorage();
};

function showMsg(text, color) {
    const statusDiv = document.getElementById('status');
    statusDiv.innerText = text;
    statusDiv.style.color = color;
}

function clearForm() {
    document.getElementById('inpKlient').value = "";
    document.getElementById('inpData').value = "";
}

// Filtrowanie (bez zmian)
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = db.filter(b => b.name.toLowerCase().includes(term));
    render(filtered);
});

window.remove = (id) => {
    db = db.filter(b => b.id !== id);
    updateStorage();
};

// Reset bazy
btnReset.addEventListener('click', () => {
    if(confirm("Czy na pewno usunąć WSZYSTKIE rezerwacje?")) {
        db = [];
        updateStorage();
    }
});

function updateStorage() {
    localStorage.setItem('restaurant_db_pro', JSON.stringify(db));
    render();
}

render();