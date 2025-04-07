// Konfigurasi Airtable
const AIRTABLE_API_KEY = 'keyYourAPIKeyHere';
const AIRTABLE_BASE_ID = 'appYourBaseIDHere';
const SALES_TABLE_NAME = 'Penjualan';
const CASHFLOW_TABLE_NAME = 'Kas';
const REPORTS_TABLE_NAME = 'Laporan';

// Inisialisasi Airtable
const base = new Airtable({apiKey: AIRTABLE_API_KEY}).base(AIRTABLE_BASE_ID);

// Fungsi untuk mengambil data penjualan
async function fetchSalesData() {
    try {
        const records = await base(SALES_TABLE_NAME).select({
            view: 'Grid view',
            sort: [{field: 'Tanggal', direction: 'desc'}]
        }).all();
        
        return records.map(record => ({
            id: record.id,
            date: record.get('Tanggal'),
            product: record.get('Produk'),
            quantity: record.get('Jumlah'),
            unitPrice: record.get('Harga Satuan'),
            total: record.get('Total'),
            notes: record.get('Keterangan') || '-'
        }));
    } catch (error) {
        console.error('Error fetching sales data:', error);
        return [];
    }
}

// Fungsi untuk menambahkan data penjualan baru
async function addSalesRecord(data) {
    try {
        const record = await base(SALES_TABLE_NAME).create([
            {
                "fields": {
                    "Tanggal": data.date,
                    "Produk": data.product,
                    "Jumlah": data.quantity,
                    "Harga Satuan": data.unitPrice,
                    "Total": data.total,
                    "Keterangan": data.notes
                }
            }
        ]);
        return record;
    } catch (error) {
        console.error('Error adding sales record:', error);
        return null;
    }
}

// Fungsi untuk menghapus data penjualan
async function deleteSalesRecord(recordId) {
    try {
        await base(SALES_TABLE_NAME).destroy(recordId);
        return true;
    } catch (error) {
        console.error('Error deleting record:', error);
        return false;
    }
}

// Ekspor fungsi yang diperlukan
export { 
    fetchSalesData, 
    addSalesRecord,
    deleteSalesRecord
};
