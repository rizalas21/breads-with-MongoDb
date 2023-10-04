-- db for table mongo
-- nampilkan seluruh isi table
db.nama_table.find()

-- bikin isi tabel sekaligus dengan tabel nya satu satu
db.users.insertOne({ name: "rizal", phone: "081321392526" }) db.nama_tabel.insertOne({ name: 'apa', phone: '08' }) -- bikin isi tabel sekaligus dengan tabel nya satu satu
db.nama_table.insertMany([
    { name: nama, phone: number}
    { name: nama, phone: number}
])

-- buat table dengan rows atau isi kosong
db.createCollection("nama_table")

-- nambahin kolom di table
db.nama_tabel.updateMany(
    {"rows": "nama"},
     {$set: {rows: value}}
     );

-- hapus tabel atau kolom
db.nama_tabel.updateMany(
    {"rows": "nama"},
    {$unset: {rows: value}}
    );

-- hapus tabel secara keseluruhan
db.nama_tabel.drop()

-- PERBANDINGAN
-- SQL
INSERT INTO nama_tabel(user_id, rows, rows) VALUES ('value', value, value)
-- MONGODB
db.nama_tabel.insertOne(
    { user_id: 'values', rows: values, rows: values }
    )

    -- LIAT SINI AJALAH BANYAK BET
    https://www.mongodb.com/docs/manual/reference/sql-comparison/