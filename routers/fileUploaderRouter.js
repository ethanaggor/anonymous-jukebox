const express = require('express');
const fileUpload = require('express-fileupload');
const { File } = require('../models');
const router = express.Router();

router.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));

router.get('/', (req, res) => {
    File.getAll().then(
        (data) => {
            res.render('uploader/uploader', {
                'allFiles' : data,
            });
        }
    )

})

router.post('/upload', (req, res) => {
    File.create(req.files.file).then(
        (data) => {
            res.redirect('/dashboard/uploader');
        }
    )
})

module.exports = router;