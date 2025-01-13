let userId = null;

// Kullanıcı ID'sini çek
(async function fetchUserId() {
    try {
        const response = await fetch('/api/auth/user-id', {
            method: 'GET',
            credentials: 'include',
        });

        if (response.ok) {
            const data = await response.json();
            userId = data.user_id;
            loadSalaryInfo(); // Maaş bilgisini çek
        } else {
            console.error('Kullanıcı ID alınamadı.');
        }
    } catch (error) {
        console.error('Hata:', error);
    }
})();

// Maaş bilgisini yükle
async function loadSalaryInfo() {
    if (!userId) return;

    try {
        const response = await fetch(`/api/salaries/${userId}`);
        if (response.ok) {
            const salary = await response.json();
            document.getElementById('salaries').innerHTML = `
                <div class="list-group-item">
                    <h5>Maaş Bilgileri</h5>
                    <p>Maaş: ${salary.salary_amount} ₺</p>
                    <p>Ödeme Tarihi: ${salary.payment_date}</p>
                </div>
            `;
        } else {
            document.getElementById('salaries').innerHTML = '<p>Maaş bilgisi alınamadı.</p>';
        }
    } catch (error) {
        console.error('Hata:', error);
        document.getElementById('salaries').innerHTML = '<p>Sunucu hatası. Maaş bilgisi yüklenemedi.</p>';
    }
}
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