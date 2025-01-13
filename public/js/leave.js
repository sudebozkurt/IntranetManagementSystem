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



// İzin talebi oluşturma
document.getElementById('openLeaveForm').addEventListener('click', () => {
    const formContainer = document.getElementById('leaveFormContainer');
    formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';

    formContainer.innerHTML = `
        <h3>Yeni İzin Talebi</h3>
        <form id="leaveForm">
            <div class="mb-3">
                <label for="startDate" class="form-label">Başlangıç Tarihi</label>
                <input type="date" class="form-control" id="startDate" required>
            </div>
            <div class="mb-3">
                <label for="endDate" class="form-label">Bitiş Tarihi</label>
                <input type="date" class="form-control" id="endDate" required>
            </div>
            <div class="mb-3">
                <label for="reason" class="form-label">Gerekçe</label>
                <textarea class="form-control" id="reason" rows="3" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Talep Et</button>
        </form>
    `;

    // İzin talebi gönderim
document.getElementById('leaveForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!userId) {
        alert('Kullanıcı ID alınamadı. Lütfen tekrar giriş yapın.');
        return;
    }

    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const reason = document.getElementById('reason').value;

    try {
        const response = await fetch('/api/leaves', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId, // user_id burada kullanılıyor
                start_date: startDate,
                end_date: endDate,
                reason: reason,
            }),
        });

        if (response.ok) {
            alert('İzin talebi başarıyla gönderildi.');
            document.getElementById('leaveFormContainer').style.display = 'none';
            loadLeaveRequests();
        } else {
            alert('İzin talebi gönderilemedi.');
        }
    } catch (error) {
        console.error('Hata:', error);
        alert('Sunucu hatası. Talep gönderilemedi.');
    }
});
});

// İzin taleplerini yükle
async function loadLeaveRequests() {
    const container = document.getElementById('leave-requests');
    try {
        const response = await fetch('/api/leaves');
        if (response.ok) {
            const leaves = await response.json();
            container.innerHTML = leaves.map(leave => `
                <div class="list-group-item">
                    <h5>${leave.user_name}</h5>
                    <p>Başlangıç: ${leave.start_date} | Bitiş: ${leave.end_date}</p>
                    <p>Gerekçe: ${leave.reason}</p>
                    <p>Durum: <strong>${leave.status}</strong></p>
                    <div class="d-flex gap-2">
                        <button class="btn btn-warning btn-sm" onclick="openEditForm(${leave.leave_id}, '${leave.start_date}', '${leave.end_date}', '${leave.reason}')">Düzenle</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteLeave(${leave.leave_id})">Sil</button>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p>İzin talepleri yüklenemedi.</p>';
        }
    } catch (error) {
        console.error('Hata:', error);
        container.innerHTML = '<p>Sunucu hatası. Talepler yüklenemedi.</p>';
    }
}

function openEditForm(leaveId, startDate, endDate, reason) {
    const formContainer = document.getElementById('leaveFormContainer');
    formContainer.style.display = 'block';

    formContainer.innerHTML = `
        <h3>İzin Talebi Güncelle</h3>
        <form id="editLeaveForm">
            <div class="mb-3">
                <label for="editStartDate" class="form-label">Başlangıç Tarihi</label>
                <input type="date" class="form-control" id="editStartDate" value="${startDate}" required>
            </div>
            <div class="mb-3">
                <label for="editEndDate" class="form-label">Bitiş Tarihi</label>
                <input type="date" class="form-control" id="editEndDate" value="${endDate}" required>
            </div>
            <div class="mb-3">
                <label for="editReason" class="form-label">Gerekçe</label>
                <textarea class="form-control" id="editReason" rows="3" required>${reason}</textarea>
            </div>
            <button type="submit" class="btn btn-primary">Güncelle</button>
        </form>
    `;

    document.getElementById('editLeaveForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const updatedStartDate = document.getElementById('editStartDate').value;
        const updatedEndDate = document.getElementById('editEndDate').value;
        const updatedReason = document.getElementById('editReason').value;

        try {
            const response = await fetch(`/api/leaves/${leaveId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    start_date: updatedStartDate,
                    end_date: updatedEndDate,
                    reason: updatedReason,
                }),
            });

            if (response.ok) {
                alert('İzin talebi başarıyla güncellendi.');
                formContainer.style.display = 'none';
                loadLeaveRequests();
            } else {
                alert('İzin talebi güncellenemedi.');
            }
        } catch (error) {
            console.error('Hata:', error);
            alert('Sunucu hatası. Güncelleme başarısız oldu.');
        }
    });
}
async function deleteLeave(leaveId) {
    if (!confirm('Bu izin talebini silmek istediğinizden emin misiniz?')) return;

    try {
        const response = await fetch(`/api/leaves/${leaveId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('İzin talebi başarıyla silindi.');
            loadLeaveRequests();
        } else {
            alert('İzin talebi silinemedi.');
        }
    } catch (error) {
        console.error('Hata:', error);
        alert('Sunucu hatası. Silme başarısız oldu.');
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
// Sayfa yüklendiğinde izin taleplerini yükle
loadLeaveRequests();
