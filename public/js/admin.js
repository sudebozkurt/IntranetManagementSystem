function showSection(section) {
    const content = document.getElementById('admin-content');
    if (section === 'users') {
        content.innerHTML = `
            <h2>Kullanıcı Yönetimi</h2>
            <button class="btn btn-primary mb-3" onclick="addUser()">Yeni Kullanıcı Ekle</button>
            <div id="users-list" class="list-group"></div>
        `;
        loadUsers();
    } else if (section === 'announcements') {
        content.innerHTML = `
        <h2>Duyuru Yönetimi</h2>
        <button class="btn btn-primary mb-3" onclick="addAnnouncement()">Yeni Duyuru Ekle</button>
        <div id="announcements-list" class="list-group"></div>
        `;
        loadAnnouncements();
    } else if (section === 'leaves') {
        content.innerHTML = `
            <h2>İzin Talepleri</h2>
            <div id="leaves-list" class="list-group"></div>
        `;
        loadLeaves();
    } else if (section === 'salaries') {
        content.innerHTML = `
            <h2>Maaş Bilgileri</h2>
            <button class="btn btn-primary mb-3" onclick="addSalary()">Maaş Bilgisi Ekle</button>
            <div id="salaries-list" class="list-group"></div>
        `;
        loadSalaries();
    } else if (section === 'events') {
        content.innerHTML = `
            <h2>Etkinlik Yönetimi</h2>
            <button class="btn btn-primary mb-3" onclick="addEvent()">Yeni Etkinlik Ekle</button>
            <div id="events-list" class="list-group"></div>
        `;
        loadEvents();
    }
}


let userId = null; // Global değişken

// Kullanıcının user_id'sini al
(async function fetchUserId() {
    try {
        const response = await fetch('/api/auth/user-id', {
            method: 'GET',
            credentials: 'include', // Çerezleri dahil et
        });

        if (response.ok) {
            const data = await response.json();
            userId = data.user_id; // user_id'yi global değişkene atayın
            console.log('Kullanıcı ID:', userId); // Kontrol için
        } else {
            console.error('Kullanıcı ID alınamadı.');
        }
    } catch (error) {
        console.error('Hata:', error);
    }
})();
(async function fetchUserInfo() {
    try {
        const response = await fetch('/api/auth/user-info', {
            method: 'GET',
            credentials: 'include', // Çerezleri dahil et
        });
        
        if (response.ok) {
            const data = await response.json();
            document.querySelector('h1').textContent = `Hoş Geldin, ${data.name}`;
        } else {
            console.error('Kullanıcı bilgileri alınamadı.');
            document.querySelector('h1').textContent = 'Hoş Geldiniz';
        }
    } catch (error) {
        console.error('Hata:', error);
        document.querySelector('h1').textContent = 'Hoş Geldiniz';
    }
})();


async function logout() {
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include', // Çerezleri dahil et
        });

        if (response.ok) {
            alert('Başarıyla çıkış yaptınız.');
            localStorage.removeItem('sessionToken'); // Eğer localStorage kullanıyorsanız
            window.location.href = '/';
        } else {
            const errorData = await response.json();
            alert(errorData.message || 'Çıkış sırasında bir hata oluştu.');
        }
    } catch (error) {
        console.error('Hata:', error);
        alert('Sunucu hatası. Çıkış yapılamadı.');
    }
}
let users = [];

async function loadUsers() {
    const container = document.getElementById('users-list');
    try {
        const response = await fetch('/api/users');
        if (response.ok) {
            users = await response.json();
            container.innerHTML = users.map(u => `
                <div class="list-group-item">
                    <h5>${u.name} (${u.role})</h5>
                    <p>Email: ${u.email}</p>
                    <button class="btn btn-sm btn-warning" onclick="updateUser(${u.user_id})">Güncelle</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteUser(${u.user_id})">Sil</button>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p>Kullanıcılar alınamadı.</p>';
        }
    } catch (error) {
        console.error('Hata:', error);
        container.innerHTML = '<p>Sunucu hatası. Kullanıcılar alınamadı.</p>';
    }
}

let announcements = [];
async function loadAnnouncements() {
    const container = document.getElementById('announcements-list');

    try {
        const response = await fetch('/api/announcements');
        if (response.ok) {
            announcements = await response.json();
            container.innerHTML = announcements.map(a => `
                <div class="list-group-item">
                    <h5>${a.title}</h5>
                    <p>${a.description}</p>
                    <button class="btn btn-sm btn-warning" onclick="updateAnnouncement(${a.announcement_id})">Güncelle</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteAnnouncement(${a.announcement_id})">Sil</button>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p>Duyurular alınamadı.</p>';
        }
    } catch (error) {
        console.error('Hata:', error);
        container.innerHTML = '<p>Sunucu hatası. Duyurular alınamadı.</p>';
    }
}


async function loadLeaves() {
    const container = document.getElementById('leaves-list');
    try {
        const response = await fetch('/api/leaves');
        if (response.ok) {
            const leaves = await response.json();
            container.innerHTML = leaves.map(leave => `
                <div class="list-group-item">
                    <h5>Kullanıcı: ${leave.user_name}</h5>
                    <p>Başlangıç: ${leave.start_date} | Bitiş: ${leave.end_date}</p>
                    <p>Gerekçe: ${leave.reason}</p>
                    <p>Durum: <strong>${leave.status}</strong></p>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-success" onclick="changeLeaveStatus(${leave.leave_id}, 'Approved')">Onayla</button>
                        <button class="btn btn-sm btn-danger" onclick="changeLeaveStatus(${leave.leave_id}, 'Rejected')">Reddet</button>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p>İzin talepleri alınamadı.</p>';
        }
    } catch (error) {
        console.error('Hata:', error);
        container.innerHTML = '<p>Sunucu hatası. İzin talepleri alınamadı.</p>';
    }
}



let salaries = [];

async function loadSalaries() {
    const container = document.getElementById('salaries-list');
    try {
        const response = await fetch('/api/salaries');
        if (response.ok) {
            const salaries = await response.json();
            container.innerHTML = salaries.map(s => `
                <div class="list-group-item">
                    <h5>Kullanıcı: ${s.user_name || 'Bilinmiyor'}</h5>
                    <p>Maaş: ${s.salary_amount ? `${parseFloat(s.salary_amount).toLocaleString('tr-TR')} ₺` : 'Bilinmiyor'} | 
                    Ödeme Tarihi: ${s.payment_date ? new Date(s.payment_date).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}</p>
                    <button class="btn btn-sm btn-success" onclick="updateSalaryPercentage(${s.salary_id}, ${s.salary_amount})">Yüzdelik Zam Yap</button>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p>Maaş bilgileri alınamadı.</p>';
        }
    } catch (error) {
        console.error('Hata:', error);
        container.innerHTML = '<p>Sunucu hatası. Maaş bilgileri alınamadı.</p>';
    }
}

let events = [];

async function loadEvents() {
    const container = document.getElementById('events-list');
    try {
        const response = await fetch('/api/events');
        if (response.ok) {
            events = await response.json();
            container.innerHTML = events.map(e => `
                <div class="list-group-item">
                    <h5>${e.title}</h5>
                    <p>${e.date} | ${e.description}</p>
                    <button class="btn btn-sm btn-warning" onclick="updateEvent(${e.event_id})">Güncelle</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteEvent(${e.event_id})">Sil</button>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p>Etkinlikler alınamadı.</p>';
        }
    } catch (error) {
        console.error('Hata:', error);
        container.innerHTML = '<p>Sunucu hatası. Etkinlikler alınamadı.</p>';
    }
}

function addUser() {
    const formHTML = `
        <h2>Yeni Kullanıcı Ekle</h2>
        <form id="addUserForm">
            <div class="mb-3">
                <label for="name" class="form-label">Ad Soyad</label>
                <input type="text" class="form-control" id="name" required>
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">E-Posta</label>
                <input type="email" class="form-control" id="email" required>
            </div>
            <div class="mb-3">
                <label for="role" class="form-label">Rol</label>
                <select class="form-select" id="role" required>
                    <option value="Admin">Yönetici</option>
                    <option value="Employee">Çalışan</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Şifre</label>
                <input type="password" class="form-control" id="password" required>
            </div>
            <button type="submit" class="btn btn-primary">Ekle</button>
        </form>
    `;
    const content = document.getElementById('admin-content');
    content.innerHTML = formHTML;

    document.getElementById('addUserForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const role = document.getElementById('role').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/users/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, role, password })
            });
            if (response.ok) {
                alert('Kullanıcı başarıyla eklendi.');
                showSection('users');
            } else {
                alert('Kullanıcı eklenemedi.');
            }
        } catch (error) {
            console.error('Hata:', error);
            alert('Sunucu hatası.');
        }
    });
}

function updateUser(userId) {
    const user = users.find(u => u.user_id === userId);
    if (!user) return alert('Kullanıcı bulunamadı.');

    const formHTML = `
        <h2>Kullanıcı Güncelle</h2>
        <form id="updateUserForm">
            <div class="mb-3">
                <label for="name" class="form-label">Ad Soyad</label>
                <input type="text" class="form-control" id="name" value="${user.name}" required>
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">E-Posta</label>
                <input type="email" class="form-control" id="email" value="${user.email}" required>
            </div>
            <div class="mb-3">
                <label for="role" class="form-label">Rol</label>
                <select class="form-select" id="role" required>
                    <option value="Admin" ${user.role === 'Admin' ? 'selected' : ''}>Yönetici</option>
                    <option value="Employee" ${user.role === 'Employee' ? 'selected' : ''}>Çalışan</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary">Güncelle</button>
        </form>
    `;
    const content = document.getElementById('admin-content');
    content.innerHTML = formHTML;

    document.getElementById('updateUserForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const role = document.getElementById('role').value;

        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, role }),
            });
            if (response.ok) {
                alert('Kullanıcı başarıyla güncellendi.');
                showSection('users'); // Kullanıcı listesini yeniden yükler
            } else {
                alert('Kullanıcı güncellenemedi.');
            }
        } catch (error) {
            console.error('Hata:', error);
            alert('Sunucu hatası.');
        }
    });
}

async function deleteUser(userId) {
    if (!confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) return;

    try {
        const response = await fetch(`/api/users/${userId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Kullanıcı başarıyla silindi.');
            showSection('users'); // Kullanıcı listesini yeniden yükler
        } else {
            alert('Kullanıcı silinemedi.');
        }
    } catch (error) {
        console.error('Hata:', error);
        alert('Sunucu hatası.');
    }
}

function addAnnouncement() {
    const formHTML = `
        <h2>Yeni Duyuru Ekle</h2>
        <form id="addAnnouncementForm">
            <div class="mb-3">
                <label for="title" class="form-label">Başlık</label>
                <input type="text" class="form-control" id="title" required>
            </div>
            <div class="mb-3">
                <label for="description" class="form-label">Açıklama</label>
                <textarea class="form-control" id="description" rows="4" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Ekle</button>
        </form>
    `;
    const content = document.getElementById('admin-content');
    content.innerHTML = formHTML;

    document.getElementById('addAnnouncementForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;

        try {
            const response = await fetch('/api/announcements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    title,
                    description,
                    created_by: userId // Mevcut kullanıcının ID'si
                })
            });
            if (response.ok) {
                alert('Duyuru başarıyla eklendi.');
                showSection('announcements'); // Duyuru listesini güncelle
            } else {
                alert('Duyuru eklenemedi.');
            }
        } catch (error) {
            console.error('Hata:', error);
            alert('Sunucu hatası.');
        }
    });
}
function updateAnnouncement(announcement_id) {
    const announcement = announcements.find(a => a.announcement_id === announcement_id);
    if (!announcement) return alert('Duyuru bulunamadı.');

    const formHTML = `
        <h2>Duyuru Güncelle</h2>
        <form id="updateAnnouncementForm">
            <div class="mb-3">
                <label for="title" class="form-label">Başlık</label>
                <input type="text" class="form-control" id="title" value="${announcement.title}" required>
            </div>
            <div class="mb-3">
                <label for="description" class="form-label">Açıklama</label>
                <textarea class="form-control" id="description" rows="4" required>${announcement.description}</textarea>
            </div>
            <button type="submit" class="btn btn-primary">Güncelle</button>
        </form>
    `;
    const content = document.getElementById('admin-content');
    content.innerHTML = formHTML;

    document.getElementById('updateAnnouncementForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;

        try {
            const response = await fetch(`/api/announcements/${announcement_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description })
            });

            if (response.ok) {
                alert('Duyuru başarıyla güncellendi.');
                showSection('announcements');
            } else {
                alert('Duyuru güncellenemedi.');
            }
        } catch (error) {
            console.error('Hata:', error);
            alert('Sunucu hatası.');
        }
    });
}
async function deleteAnnouncement(announcement_id) {
    if (!confirm('Bu duyuruyu silmek istediğinizden emin misiniz?')) return;

    try {
        const response = await fetch(`/api/announcements/${announcement_id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Duyuru başarıyla silindi.');
            showSection('announcements'); // Listeyi yeniden yükler
        } else {
            alert('Duyuru silinemedi.');
        }
    } catch (error) {
        console.error('Hata:', error);
        alert('Sunucu hatası.');
    }
}
async function changeLeaveStatus(leaveId, status) {
    try {
        const response = await fetch(`/api/leaves/${leaveId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });

        if (response.ok) {
            alert('İzin talebi durumu güncellendi.');
            loadLeaves(); // İzin taleplerini yeniden yükle
        } else {
            alert('Durum güncellenemedi.');
        }
    } catch (error) {
        console.error('Hata:', error);
        alert('Sunucu hatası. Durum güncellenemedi.');
    }
}

async function addSalary() {
    const content = document.getElementById('admin-content');
    let users = [];

    try {
        const response = await fetch('/api/users');
        if (response.ok) {
            users = await response.json();
        } else {
            alert('Kullanıcılar alınamadı.');
            return;
        }
    } catch (error) {
        console.error('Hata:', error);
        alert('Sunucu hatası. Kullanıcılar alınamadı.');
        return;
    }

    const userOptions = users.map(user => 
        `<option value="${user.user_id}">${user.name} (${user.email})</option>`
    ).join('');

    content.innerHTML = `
        <h2>Yeni Maaş Bilgisi Ekle</h2>
        <form id="addSalaryForm">
            <div class="mb-3">
                <label for="user_id" class="form-label">Kullanıcı Seçin</label>
                <select class="form-select" id="user_id" required>
                    <option value="">Kullanıcı Seçin</option>
                    ${userOptions}
                </select>
            </div>
            <div class="mb-3">
                <label for="salaryAmount" class="form-label">Maaş Miktarı</label>
                <input type="number" class="form-control" id="salaryAmount" required>
            </div>
            <div class="mb-3">
                <label for="paymentDate" class="form-label">Ödeme Tarihi</label>
                <input type="date" class="form-control" id="paymentDate" required>
            </div>
            <button type="submit" class="btn btn-primary">Ekle</button>
        </form>
    `;

    document.getElementById('addSalaryForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const user_id = document.getElementById('user_id').value;
        const salaryAmount = document.getElementById('salaryAmount').value;
        const paymentDate = document.getElementById('paymentDate').value;

        try {
            const response = await fetch('/api/salaries/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id, salaryAmount, paymentDate }),
            });

            if (response.ok) {
                alert('Maaş bilgisi başarıyla eklendi.');
                showSection('salaries');
            } else {
                alert('Maaş bilgisi eklenemedi.');
            }
        } catch (error) {
            console.error('Hata:', error);
            alert('Sunucu hatası.');
        }
    });
}
function updateSalaryPercentage(salary_id, currentSalary) {
    const content = document.getElementById('admin-content');
    content.innerHTML = `
        <h2>Yüzdelik Zam Yap</h2>
        <form id="updateSalaryForm">
            <div class="mb-3">
                <label for="percentage" class="form-label">Zam Oranı (%)</label>
                <input type="number" class="form-control" id="percentage" placeholder="Örn: 10" required>
            </div>
            <p>Mevcut Maaş: <strong>${parseFloat(currentSalary).toLocaleString('tr-TR')} ₺</strong></p>
            <button type="submit" class="btn btn-primary">Zam Yap</button>
        </form>
    `;

    document.getElementById('updateSalaryForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const percentage = document.getElementById('percentage').value;
        const newSalary = parseFloat(currentSalary) * (1 + parseFloat(percentage) / 100);

        try {
            const response = await fetch(`/api/salaries/${salary_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ salary_amount: newSalary.toFixed(2) }),
            });

            if (response.ok) {
                alert('Maaş başarıyla güncellendi.');
                showSection('salaries'); // Maaş listesini yeniden yükle
            } else {
                alert('Maaş güncellenemedi.');
            }
        } catch (error) {
            console.error('Hata:', error);
            alert('Sunucu hatası. Maaş güncellenemedi.');
        }
    });
}

function addEvent() {
    const formHTML = `
        <h2>Yeni Etkinlik Ekle</h2>
        <form id="addEventForm">
            <div class="mb-3">
                <label for="title" class="form-label">Başlık</label>
                <input type="text" class="form-control" id="title" required>
            </div>
            <div class="mb-3">
                <label for="description" class="form-label">Açıklama</label>
                <textarea class="form-control" id="description" rows="3" required></textarea>
            </div>
            <div class="mb-3">
                <label for="date" class="form-label">Tarih</label>
                <input type="date" class="form-control" id="date" required>
            </div>
            <button type="submit" class="btn btn-primary">Ekle</button>
        </form>
    `;
    document.getElementById('admin-content').innerHTML = formHTML;

    document.getElementById('addEventForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const date = document.getElementById('date').value;

        try {
            const response = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, date }),
            });

            if (response.ok) {
                alert('Etkinlik başarıyla eklendi.');
                showSection('events');
            } else {
                alert('Etkinlik eklenemedi.');
            }
        } catch (error) {
            console.error('Hata:', error);
            alert('Sunucu hatası.');
        }
    });
}

function updateEvent(eventId) {
    const event = events.find(e => e.event_id === eventId);
    if (!event) return alert('Etkinlik bulunamadı.');

    const formHTML = `
        <h2>Etkinlik Güncelle</h2>
        <form id="updateEventForm">
            <div class="mb-3">
                <label for="title" class="form-label">Başlık</label>
                <input type="text" class="form-control" id="title" value="${event.title}" required>
            </div>
            <div class="mb-3">
                <label for="description" class="form-label">Açıklama</label>
                <textarea class="form-control" id="description" rows="3" required>${event.description}</textarea>
            </div>
            <div class="mb-3">
                <label for="date" class="form-label">Tarih</label>
                <input type="date" class="form-control" id="date" value="${event.date.split('T')[0]}" required>
            </div>
            <button type="submit" class="btn btn-primary">Güncelle</button>
        </form>
    `;
    document.getElementById('admin-content').innerHTML = formHTML;

    document.getElementById('updateEventForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const date = document.getElementById('date').value;

        try {
            const response = await fetch(`/api/events/${eventId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, date }),
            });

            if (response.ok) {
                alert('Etkinlik başarıyla güncellendi.');
                showSection('events');
            } else {
                alert('Etkinlik güncellenemedi.');
            }
        } catch (error) {
            console.error('Hata:', error);
            alert('Sunucu hatası.');
        }
    });
}

async function deleteEvent(eventId) {
    if (!confirm('Bu etkinliği silmek istediğinizden emin misiniz?')) return;

    try {
        const response = await fetch(`/api/events/${eventId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Etkinlik başarıyla silindi.');
            showSection('events'); // Etkinlik listesini yeniden yükler
        } else {
            alert('Etkinlik silinemedi.');
        }
    } catch (error) {
        console.error('Hata:', error);
        alert('Sunucu hatası.');
    }
}

showSection('users');