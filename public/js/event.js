async function loadEvents() {
    const container = document.getElementById('events');
    try {
        const response = await fetch('/api/events');
        if (response.ok) {
            const events = await response.json();
            container.innerHTML = events.map(event => `
                <div class="list-group-item">
                    <h5>${event.title}</h5>
                    <p>${event.date} | ${event.description}</p>
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

// Sayfa yüklendiğinde etkinlikleri yükle
loadEvents();
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