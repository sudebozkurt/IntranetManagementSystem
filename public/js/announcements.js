(async function loadAnnouncements() {
    const container = document.getElementById('announcements');
    try {
        const response = await fetch('/api/announcements', {
            method: 'GET',
            credentials: 'include', // Çerez doğrulaması için
        });

        if (response.ok) {
            const announcements = await response.json();
            container.innerHTML = announcements.map(announcement => `
                <div class="list-group-item">
                    <h5>${announcement.title}</h5>
                    <p>${announcement.description}</p>
                    <small>${new Date(announcement.created_at).toLocaleString()}</small>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p>Duyurular yüklenemedi.</p>';
        }
    } catch (error) {
        console.error('Hata:', error);
        container.innerHTML = '<p>Sunucu hatası. Duyurular yüklenemedi.</p>';
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