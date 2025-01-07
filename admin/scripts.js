document.getElementById("tambahMahasiswaBtn").addEventListener("click", function() {
    const popupTambahMahasiswa = document.getElementById("popupTambahMahasiswa");
    const pemilihForm = document.getElementById("pemilihForm");

    if (pemilihForm) {
        pemilihForm.style.display = "none";
    }

    if (popupTambahMahasiswa.style.display === "none" || popupTambahMahasiswa.style.display === "") {
        popupTambahMahasiswa.style.display = "block";
    } else {
        popupTambahMahasiswa.style.display = "none";
    }
});

document.getElementById("createKandidat").addEventListener("click", function() {
        const popupTambahKandidat = document.getElementById("popupTambahKandidat");
        const kandidatContent = document.getElementById("kandidatContent");

        if (kandidatContent) {
            kandidatContent.style.display = "none";
        }

        if (popupTambahKandidat.style.display === "none" || popupTambahKandidat.style.display === "") {
            popupTambahKandidat.style.display = "block";
        } else {
            popupTambahKandidat.style.display = "none";
        }
    });

function closeForm() {
    const eventForm = document.getElementById('eventForm');
    const eventContent = document.getElementById('eventContent');

    eventForm.style.display = 'none';
    eventContent.style.display = 'block';
}

document.addEventListener("DOMContentLoaded", function () {
    const editButtons = document.querySelectorAll(".edit-btn");
    const editForm = document.getElementById("editMahasiswaForm");

    editButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const nim = this.dataset.nim;

            // Fetch data mahasiswa
            fetch(`get_mahasiswa.php?nim=${nim}`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        // Populate form fields
                        document.getElementById("editNama").value = data.mahasiswa.nama;
                        document.getElementById("editNim").value = data.mahasiswa.nim;
                        document.getElementById("editEmail").value = data.mahasiswa.email;
                        document.getElementById("editJurusan").value = data.mahasiswa.jurusan;
                        document.getElementById("editProdi").value = data.mahasiswa.prodi;
                        document.getElementById("editAngkatan").value = data.mahasiswa.angkatan;
                    } else {
                        alert("Gagal mendapatkan data mahasiswa.");
                    }
                });
        });
    });

    // Handle form submit
    editForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const formData = new FormData(editForm);

        fetch("edit_mahasiswa.php", {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    alert("Data berhasil diperbarui!");
                    location.reload(); // Reload the page to reflect changes
                } else {
                    alert("Gagal memperbarui data.");
                }
            });
    });
});

document.getElementById('applyFilter').addEventListener('click', function() {
    const field = document.getElementById('filterField').value;
    const order = document.getElementById('filterOrder').value;

    // Buat objek XMLHttpRequest
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'filter_mahasiswa.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function() {
        if (xhr.status === 200) {
            // Perbarui isi tabel dengan data yang diurutkan
            document.getElementById('mahasiswaTableBody').innerHTML = xhr.responseText;
        } else {
            console.error('Error:', xhr.statusText);
        }
    };

    // Kirim permintaan dengan parameter filter
    xhr.send('field=' + encodeURIComponent(field) + '&order=' + encodeURIComponent(order));
});

// Get unique values for the desired columns

// {2 : ["M", "F"], 3 : ["RnD", "Engineering", "Design"], 4 : [], 5 : []}

function getUniqueValuesFromColumn() {

    var unique_col_values_dict = {}

    allFilters = document.querySelectorAll(".table-filter")
    allFilters.forEach((filter_i) => {
        col_index = filter_i.parentElement.getAttribute("col-index");
        // alert(col_index)
        const rows = document.querySelectorAll("#emp-table > tbody > tr")

        rows.forEach((row) => {
            cell_value = row.querySelector("td:nth-child("+col_index+")").innerHTML;
            // if the col index is already present in the dict
            if (col_index in unique_col_values_dict) {

                // if the cell value is already present in the array
                if (unique_col_values_dict[col_index].includes(cell_value)) {
                    // alert(cell_value + " is already present in the array : " + unique_col_values_dict[col_index])

                } else {
                    unique_col_values_dict[col_index].push(cell_value)
                    // alert("Array after adding the cell value : " + unique_col_values_dict[col_index])

                }


            } else {
                unique_col_values_dict[col_index] = new Array(cell_value)
            }
        });

        
    });

    for(i in unique_col_values_dict) {
        alert("Column index : " + i + " has Unique values : \n" + unique_col_values_dict[i]);
    }

    updateSelectOptions(unique_col_values_dict)

};

// Add <option> tags to the desired columns based on the unique values

function updateSelectOptions(unique_col_values_dict) {
    allFilters = document.querySelectorAll(".table-filter")

    allFilters.forEach((filter_i) => {
        col_index = filter_i.parentElement.getAttribute('col-index')

        unique_col_values_dict[col_index].forEach((i) => {
            filter_i.innerHTML = filter_i.innerHTML + `\n<option value="${i}">${i}</option>`
        });

    });
};


// Create filter_rows() function

// filter_value_dict {2 : Value selected, 4:value, 5: value}

function filter_rows() {
    allFilters = document.querySelectorAll(".table-filter")
    var filter_value_dict = {}

    allFilters.forEach((filter_i) => {
        col_index = filter_i.parentElement.getAttribute('col-index')

        value = filter_i.value
        if (value != "all") {
            filter_value_dict[col_index] = value;
        }
    });

    var col_cell_value_dict = {};

    const rows = document.querySelectorAll("#emp-table tbody tr");
    rows.forEach((row) => {
        var display_row = true;

        allFilters.forEach((filter_i) => {
            col_index = filter_i.parentElement.getAttribute('col-index')
            col_cell_value_dict[col_index] = row.querySelector("td:nth-child(" + col_index+ ")").innerHTML
        })

        for (var col_i in filter_value_dict) {
            filter_value = filter_value_dict[col_i]
            row_cell_value = col_cell_value_dict[col_i]
            
            if (row_cell_value.indexOf(filter_value) == -1 && filter_value != "all") {
                display_row = false;
                break;
            }


        }

        if (display_row == true) {
            row.style.display = "table-row"

        } else {
            row.style.display = "none"

        }





    })

}

function updateProdi() {
    const jurusanSelect = document.getElementById("jurusan");
    const prodiSelect = document.getElementById("prodi");

    const idJurusan = jurusanSelect.value;

    prodiSelect.innerHTML = '<option value="" disabled selected>Pilih prodi</option>';

    if (idJurusan) {
        const url = `tambah_event.php?id_jurusan=${idJurusan}`;

        fetch(url)
            .then(response => response.text())
            .then(data => {
                if (data.trim()) {
                    prodiSelect.innerHTML += data;
                } else {
                    prodiSelect.innerHTML = '<option value="" disabled>Tidak ada prodi untuk jurusan ini</option>';
                }
            })
            .catch(error => console.error("Error:", error));
    }
}


function updateProdiMhs() {
    const jurusanSelect = document.getElementById("jurusanMhs"); // Sesuaikan ID
    const prodiSelect = document.getElementById("prodiMhs"); // Sesuaikan ID

    // Ambil ID Jurusan yang dipilih
    const idJurusan = jurusanSelect.value;

    // Reset isi dropdown Prodi
    prodiSelect.innerHTML = '<option value="" disabled selected>-- Pilih Prodi --</option>';

    if (idJurusan) {
        // URL untuk request data ke PHP
        const url = `tambah_mahasiswa.php?id_jurusan=${idJurusan}`;

        // Lakukan fetch request ke PHP
        fetch(url)
            .then(response => response.text())
            .then(data => {
                if (data.trim()) {
                    // Tambahkan opsi ke dropdown Prodi
                    prodiSelect.innerHTML += data;
                } else {
                    prodiSelect.innerHTML = '<option value="" disabled>Tidak ada Prodi untuk Jurusan ini</option>';
                }
            })
            .catch(error => console.error("Error:", error));
    }
}


document.getElementById("closeKandidatForm").addEventListener("click", function() {
    const popupTambahKandidat = document.getElementById("popupTambahKandidat");
    popupTambahKandidat.style.display = "none";
});

document.getElementById("uploadCandidateBtn").addEventListener("click", function() {
    console.log("Tombol di-klik");
    document.getElementById("popup").style.display = "flex";
});

document.getElementById("closePopup").addEventListener("click", function() {
    console.log("Close di-klik");
    document.getElementById("popup").style.display = "none";
});

document.getElementById('closePopupMahasiswa').addEventListener('click', function () {
    document.getElementById('popupTambahMahasiswa').style.display = 'none';
    document.getElementById('pemilihForm').style.display = 'block';
});

let timer;
    
    // Fungsi untuk mereset timer setiap kali ada aktivitas
    function resetTimer() {
        clearTimeout(timer);
        timer = setTimeout(logOut, 50000);
    }

    function logOut() {
        window.location.href = "logout.php";
    }

    document.onclick = resetTimer;
    document.onmousemove = resetTimer;
    document.onkeypress = resetTimer;

    resetTimer();