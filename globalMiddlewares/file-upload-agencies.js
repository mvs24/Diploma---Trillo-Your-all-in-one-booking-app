const multer = require('multer');
const uniqid = require('uniqid');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const path = require('path');

const s3 = new aws.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY_ID,
  Bucket: 'mariusfirstbucket',
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'mariusfirstbucket',
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(
        null,
        path.basename(file.originalname, path.extname(file.originalname)) +
          '-' +
          Date.now() +
          path.extname(file.originalname)
      );
    },
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
    },
  }),
});

function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

////////////////////////////////DEVELOPMENT/////////////////////////
// const MIME_TYPE_MAP = {
//   'image/png': 'png',
//   'image/jpeg': 'jpeg',
//   'image/jpg': 'jpg',
// };

// const fileUpload = multer({
//   limits: 500000,
//   storage: multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, 'public/img/agencies');
//     },
//     filename: (req, file, cb) => {
//       const ext = MIME_TYPE_MAP[file.mimetype];
//       cb(null, uniqid() + '.' + ext);
//     },
//   }),
//   fileFilter: (req, file, cb) => {
//     const isValid = !!MIME_TYPE_MAP[file.mimetype];
//     let error = isValid ? null : new Error('Invalid mime type!');
//     cb(error, isValid);
//   },
// });

module.exports = upload;
