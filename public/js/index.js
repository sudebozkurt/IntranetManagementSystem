document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Login API çağrısı
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();

            // Oturum bilgisini localStorage'a kaydet
            localStorage.setItem('sessionToken', data.sessionToken);

            // Kullanıcıyı role'e göre yönlendir
            window.location.href = data.redirectUrl;
        } else {
            // Hata mesajı göster
            const errorData = await response.json();
            alert(errorData.message);
        }
    } catch (error) {
        console.error('Hata:', error);
        alert('Giriş sırasında bir hata oluştu.');
    }
});

