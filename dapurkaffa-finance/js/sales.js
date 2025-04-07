import { fetchSalesData, addSalesRecord, deleteSalesRecord } from './airtable.js';

document.addEventListener('DOMContentLoaded', async function() {
    // Set tanggal default ke hari ini
    document.getElementById('saleDate').valueAsDate = new Date();
    
    // Memuat data penjualan
    await loadSalesData();
    
    // Event listener untuk tombol simpan
    document.getElementById('saveSaleBtn').addEventListener('click', async function() {
        await saveNewSale();
    });
});

async function loadSalesData() {
    const salesData = await fetchSalesData();
    const tableBody = document.getElementById('salesData');
    
    // Kosongkan tabel sebelum mengisi ulang
    tableBody.innerHTML = '';
    
    if (salesData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center">Tidak ada data penjualan</td></tr>';
        return;
    }
    
    // Isi tabel dengan data
    salesData.forEach(sale => {
        const row = document.createElement('tr');
        row.className = 'align-middle';
        row.innerHTML = `
            <td>${formatDate(sale.date)}</td>
            <td>${sale.product}</td>
            <td>${sale.quantity}</td>
            <td>${formatCurrency(sale.unitPrice)}</td>
            <td>${formatCurrency(sale.total)}</td>
            <td>${sale.notes}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-2">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${sale.id}">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Tambahkan event listener untuk tombol hapus
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const recordId = this.getAttribute('data-id');
            if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
                const success = await deleteSalesRecord(recordId);
                if (success) {
                    await loadSalesData();
                    showAlert('Data penjualan berhasil dihapus', 'success');
                } else {
                    showAlert('Gagal menghapus data', 'danger');
                }
            }
        });
    });
}

async function saveNewSale() {
    const date = document.getElementById('saleDate').value;
    const product = document.getElementById('productName').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const unitPrice = parseInt(document.getElementById('unitPrice').value);
    const notes = document.getElementById('notes').value;
    const total = quantity * unitPrice;
    
    if (!date || !product || !quantity || !unitPrice) {
        showAlert('Harap isi semua field yang wajib diisi!', 'warning');
        return;
    }
    
    const newSale = {
        date,
        product,
        quantity,
        unitPrice,
        total,
        notes
    };
    
    const result = await addSalesRecord(newSale);
    
    if (result) {
        // Tutup modal dan reset form
        const modal = bootstrap.Modal.getInstance(document.getElementById('addSaleModal'));
        modal.hide();
        document.getElementById('addSaleForm').reset();
        
        // Set tanggal kembali ke hari ini
        document.getElementById('saleDate').valueAsDate = new Date();
        
        // Muat ulang data
        await loadSalesData();
        
        // Tampilkan notifikasi sukses
        showAlert('Penjualan berhasil ditambahkan!', 'success');
    } else {
        showAlert('Gagal menambahkan penjualan', 'danger');
    }
}
