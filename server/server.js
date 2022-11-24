const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
// const admz = require("adm-zip");
const hostname = "0.0.0.0"; // listen on all ports
const port = 3020;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(
  fileUpload({
    createParentPath: true, // enabling "express-fileupload middleware". createParentPath will let express-fileupload create the dir path for "mv" method when said dir doesn't exist
  })
);

let currentRandomFolderName;

function randomizeString(characters) {
  let result = "";
  charactersLength = characters.length;

  for (var i = 0; i < charactersLength; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  currentRandomFolderName = result;
  return result;
}

// Upload Endpoint
app.post("/upload", (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }

  const file = req.files.file;
  console.log("File(s) uploaded:", file);

  if (file.length === undefined) {
    const uploaded_files_folder =
      __dirname +
      "/uploads/" +
      `/${randomizeString("abcdefg1234567")}/` +
      file.name;

    file.mv(uploaded_files_folder, (err) => {
      if (err) {
        return res.status(500).send(err);
      }
      // return res.render("index", {
      //   fileLink: `${req.headers.origin}/uploads/${currentRandomFolderName}/${file.name}`,
      // });

      return res.json({
        name: file.name,
        path: `/uploads/${file.name}`,
        link: `${req.get("host")}/uploads/${currentRandomFolderName}/${
          file.name
        }`,
      });
    });
  } else {
    const randomFolderName = randomizeString("abcdefg1234567") + "-multiple";

    file.forEach((item) => {
      item.mv(
        __dirname + "/uploads/" + `/${randomFolderName}/` + item.name,
        (err) => {
          if (err) {
            return res.status(500).send(err);
          }
        }
      );
    });

    const to_zip = fs.readdirSync(__dirname + "/uploads/" + randomFolderName);

    return res.json({
      name: randomFolderName,
      path: `/uploads/${randomFolderName}`,
      link: `${req.get("host")}/uploads/${randomFolderName}`,
    });

    let currentDirOfMultipleFiles = "example_dir";

    // console.log(randomFolderName);
    // let filenames = fs.readdirSync(
    //   __dirname + "/uploads/" + `/${randomFolderName}`
    // );

    // console.log("filenames in directory:");
    // filenames.forEach((file) => {
    //   console.log("File:", file);
    // });

    // return res.render("index", {
    //   fileLink: `${req.headers.origin}/uploads/${randomFolderName}`,
    // });
  }
});

app.route("/uploads/:folder/:file").get(handleDownload).post(handleDownload);

// app
//   .route("/uploads/:folder")
//   .get(handleDownloadFolder)
//   .post(handleDownloadFolder);

// async function handleDownloadFolder(req, res) {
//   console.log(req.params);
//   // download zipped folder of files  (express-zip)
//   res.zip([{ path: `./uploads/${req.params.folder}`, name: "files" }]);
// }

async function handleDownload(req, res) {
  console.log(
    "File requested:",
    "/" + req.params.folder + "/" + req.params.file
  );
  res.download(`uploads/${req.params.folder}/${req.params.file}`);
}

app.listen(process.env.PORT || port, () =>
  console.log(`listening at http://${hostname}:${port}/`)
);
