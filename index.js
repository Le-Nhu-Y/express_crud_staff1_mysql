const mysql = require('mysql');
const express=require('express');
const bodyParser=require('body-parser');
const fileUpload = require('express-fileupload')


const app = express();
const PORT=3000;

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'company',
    charset: 'utf8_general_ci'
});
connection.connect(function (err){
    if(err){
        throw err.stack;
    }else{
        console.log(`connect database successfully`)
    }
});

app.use(fileUpload({
    useTempFiles : true
}));

app.use(bodyParser.urlencoded({ extended:false}));
app.use(bodyParser.json());

app.set('view engine','ejs');
app.set('views','./src/views');
app.use(express.static('./public'))


//Tao route hien thi list nhan vien
app.get("/staff", (req, res) => {

    let offset = req.query.offset || 0;

    // tinh trang = all / sosp1trang


    let sql = "SELECT * FROM staff limit 4 offset "+ offset;
    connection.query(sql, function (err, result) {


        if (err) throw err;
        res.render("index", {staff: result});
    });
})


// Tao route create nhan vien
app.get('/staff/create',(req, res)=>{
    res.render('create')
})
app.post('/staff/create',(req, res)=>{
    const{Name}=req.body;
    console.log(req.files)
    let Image = req.files.Image;
    Image.mv('./public/image/'+Image.name, function (err){
        if(err) {
            console.log(err)
        }
    });
    const sqlInsert='INSERT INTO staff(Name,Image)VALUE ?'
    const value = [
        [Name,Image.name]
    ];
    connection.query(sqlInsert,[value],function (err,result) {
        if(err) throw err;
        res.end('BAN DA THEM NHAN VIEN THANH CONG!');
    });
    res.redirect('/staff');
});






// Bước 2: Thêm router và logic xử lý delete NHAN VIEN.
//     Tạo router xử lý request:
//     URL: /staff/{id}/delete
// Method: GET
// id: tham số nhận đầu vào là gía trị id sách cần xoá, giá trị này lấy ra từ params của request

app.get("/staff/:id/delete", (req, res) => {
    const idStaff = req.params.id;
    const sql = "DELETE FROM staff WHERE id = " + idStaff;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        res.redirect('/staff')
    });
})



// Khi click vào Update tức là gửi đi request:
//     URL: /books/{id}/update
// Method: GET
// {id}: Giá trị thay đổi theo id nhan vien
// Tạo router xử lý request này:
//     Lấy giá trị id trên URL
// Truy vấn CSDL lấy nhan vien có id tương ứng
// Hiển thị thông tin nhan vien ra form

app.get("/staff/:id/update", (req, res) => {
    const idStaff = req.params.id;
    const sql = "SELECT * FROM staff WHERE id = " + idStaff;
    connection.query(sql, (err, results) => {
        if (err) throw err;
        res.render('update', {staff: results[0]});
    });
})
app.post("/staff/:id/update", (req, res) => {
    const idStaff = req.params.id;

    let Image = req.files.Image;
    Image.mv('./public/image/'+Image.name, function (err){
        if(err) {
            console.log(err)
        }
    });
    const sql = `UPDATE staff SET Name = ?, Image = ? WHERE id = ?`;
    const { Name } = req.body;
    const value = [Name, Image.name, idStaff];


    connection.query(sql, value, (err, results) => {
        if (err) throw err;
        res.redirect('/staff');
    });
})



app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:3000/staff`)
});





