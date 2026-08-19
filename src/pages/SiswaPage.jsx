import { useState, useEffect, useCallback } from 'react';
import { getAllSiswa, createSiswa, updateSiswa, deleteSiswa } from '../services/api'; 
import Button from '../components/Button';
import InputField from '../components/InputField';
import Table from '../components/Table'; 

export default function SiswaPage() {
    const [siswaList, setSiswaList] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');

    // State Modal Form (Create / Edit)
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    
    // State Modal Konfirmasi Hapus
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [siswaToDelete, setSiswaToDelete] = useState(null);

    // State system
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // 1. UPDATE: Tambahkan tanggalLahir
    const initialFormState = {
        kodeSiswa: '',
        namaSiswa: '',
        phone: '',
        alamat: '',
        tanggalLahir: '', 
        jurusanId: 1 // Default untuk tampilan select option
    };
    const [form, setForm] = useState(initialFormState);

    const fetchSiswaData = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getAllSiswa(page, limit, search);
            setSiswaList(data.data);
            setTotalPages(data.pagination.totalPages);
        } catch (err) {
            console.error('Gagal memuat data siswa:', err);
            setErrorMsg('Gagal terhubung ke server backend.');
        } finally {
            setLoading(false);
        }
    }, [page, limit, search]);

    useEffect(() => {
        fetchSiswaData();
    }, [fetchSiswaData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ 
            ...form, 
            [name]: name === 'jurusanId' ? parseInt(value) : value 
        });
    };

    const handleOpenAddModal = () => {
        setIsEditMode(false);
        setForm(initialFormState);
        setErrorMsg('');
        setShowModal(true);
    };

    const handleOpenEditModal = (siswa) => {
        setIsEditMode(true);
        setSelectedId(siswa.id);
        
        // 2. UPDATE: Format tanggal lahir dari DB (contoh "2005-12-01T...") menjadi YYYY-MM-DD
        let formattedDate = '';
        if (siswa.tanggalLahir) {
            formattedDate = siswa.tanggalLahir.split('T')[0];
        }

        setForm({
            kodeSiswa: siswa.kodeSiswa,
            namaSiswa: siswa.namaSiswa,
            phone: siswa.phone,
            alamat: siswa.alamat || '',
            tanggalLahir: formattedDate, // Masukkan tanggal yang sudah diformat
            jurusanId: siswa.jurusanId || 1
        });
        setErrorMsg('');
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setErrorMsg('');
            if (isEditMode) {
                await updateSiswa(selectedId, form);
            } else {
                await createSiswa(form);
            }
            setShowModal(false);
            fetchSiswaData(); 
        } catch (err) {
            console.error('Gagal menyimpan data:', err);
            setErrorMsg(err.response?.data?.message || 'Terjadi kesalahan pada server.');
        }
    };

    const handleOpenDeleteModal = (siswa) => {
        setSiswaToDelete(siswa);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!siswaToDelete) return;
        try {
            await deleteSiswa(siswaToDelete.id);
            setShowDeleteModal(false);
            setSiswaToDelete(null);
            fetchSiswaData();
        } catch (err) {
            console.error('Gagal menghapus data:', err);
            alert('Gagal menghapus data dari database.');
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearch(searchInput);
        setPage(1);
    };

    // 3. UPDATE: Tambahkan kolom tanggal lahir ke tabel
    const columns = [
        { header: 'Kode Siswa', accessor: 'kodeSiswa' },
        { header: 'Nama Siswa', accessor: 'namaSiswa' },
        { header: 'Tgl Lahir', accessor: 'tanggalLahir' }, 
        { header: 'No. Telepon', accessor: 'phone' },
        { header: 'Alamat', accessor: 'alamat' },
        { header: 'Jurusan', accessor: 'namaJurusan' }
    ];

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Header & Tombol Tambah */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Manajemen Data Siswa</h1>
                    <p className="text-sm text-gray-500">Uji Kompetensi Keahlian (UJK) BNSP</p>
                </div>
                <div>
                    <Button variant="primary" onClick={handleOpenAddModal}>
                        + Tambah Siswa
                    </Button>
                </div>
            </div>

            {/* Form Pencarian */}
            <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-4">
                <input 
                    type="text" 
                    placeholder="Cari berdasarkan kode atau nama siswa..." 
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="border rounded px-3 py-2 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button variant="secondary" type="submit">Cari</Button>
            </form>

            {/* Tabel Data */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                {loading ? (
                    <p className="p-6 text-center text-gray-500">Memuat data...</p>
                ) : (
                    <Table 
                        columns={columns} 
                        data={siswaList} 
                        // Tambahan opsional: Jika API mengembalikan tanggal utuh, bisa kamu potong di sini (row.tanggalLahir.split('T')[0])
                        onEdit={(row) => handleOpenEditModal(row)} 
                        onDelete={(row) => handleOpenDeleteModal(row)} 
                    />
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-600">
                    Halaman {page} dari {totalPages || 1}
                </span>
                <div className="flex gap-2">
                    <Button 
                        variant="secondary" 
                        disabled={page === 1} 
                        onClick={() => setPage(page - 1)}
                    >
                        Sebelumnya
                    </Button>
                    <Button 
                        variant="secondary" 
                        disabled={page >= totalPages} 
                        onClick={() => setPage(page + 1)}
                    >
                        Selanjutnya
                    </Button>
                </div>
            </div>

            {/* Modal Form Tambah / Edit Siswa */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl overflow-y-auto max-h-screen">
                        <h2 className="text-xl font-bold mb-4">
                            {isEditMode ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
                        </h2>

                        {errorMsg && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded">
                                {errorMsg}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <InputField 
                                label="Kode Siswa" 
                                name="kodeSiswa" 
                                value={form.kodeSiswa} 
                                onChange={handleChange} 
                                required 
                                placeholder="Contoh: SISWA-001"
                            />
                            <InputField 
                                label="Nama Siswa" 
                                name="namaSiswa" 
                                value={form.namaSiswa} 
                                onChange={handleChange} 
                                required 
                                placeholder="Nama lengkap siswa"
                            />
                            
                            {/* 4. UPDATE: Tambahkan Input untuk Tanggal Lahir (type="date") */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
                                <input 
                                    type="date"
                                    name="tanggalLahir"
                                    value={form.tanggalLahir}
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <InputField 
                                label="Nomor Telepon" 
                                name="phone" 
                                value={form.phone} 
                                onChange={handleChange} 
                                required 
                                placeholder="Contoh: 081234567890"
                            />
                            <InputField 
                                label="Alamat" 
                                name="alamat" 
                                value={form.alamat} 
                                onChange={handleChange} 
                                placeholder="Alamat domisili"
                            />
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Jurusan</label>
                                <select 
                                    name="jurusanId" 
                                    value={form.jurusanId} 
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value={1}>Rekayasa Perangkat Lunak</option>
                                    <option value={2}>Teknik Komputer dan Jaringan</option>
                                    <option value={3}>Multimedia</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button 
                                    variant="secondary" 
                                    type="button" 
                                    onClick={() => setShowModal(false)}
                                >
                                    Batal
                                </Button>
                                <Button variant="primary" type="submit">
                                    {isEditMode ? 'Simpan Perubahan' : 'Tambah Siswa'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Hapus Siswa */}
            {/* ... Modal Delete Tetap Sama ... */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl text-center">
                        <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                            !
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Konfirmasi Hapus</h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Apakah Anda yakin ingin menghapus data siswa <span className="font-semibold text-gray-800">{siswaToDelete?.namaSiswa}</span>?
                        </p>
                        <div className="flex justify-center gap-3">
                            <Button 
                                variant="secondary" 
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Batal
                            </Button>
                            <button 
                                onClick={confirmDelete}
                                className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded text-sm transition"
                            >
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}