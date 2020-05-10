const multer = require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const path = require('path');

const s3 = new aws.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY_ID,
});

const uploadS3 = multer({
  storage: multerS3({
    s3,
    acl: 'public-read',
    bucket: 'mariusfirstbucket',
    metadata: (req, file, callBack) => {
      callBack(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(
        null,
        path.basename(file.originalname, path.extname(file.originalname)) +
          '-' +
          Date.now() +
          path.extname(file.originalname)
      );
    },
  }),
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
  // shouldTransform: function(req, file, cb) {
  //   cb(null, /^image/i.test(file.mimetype));
  // },
  //    transforms: [
  //   {
  //     id: 'original',
  //     transform: function(req, file, cb) {
  //       //Perform desired transformations
  //       cb(
  //         null,
  //         sharp()
  //           .resize(300, 300)
  //           .max()
  //       );
  //     }
  //   }
  // ]
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

module.exports = uploadS3;
