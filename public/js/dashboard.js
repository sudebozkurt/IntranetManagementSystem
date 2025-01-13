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
