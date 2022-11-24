import React, { Fragment, useEffect, useState, useContext } from "react";
import Message from "../Message";
import Progress from "../progress/Progress";
import axios from "axios";
import "./fileupload.css";
import ContextStates from "../../context/ContextStates";
import { AiFillFile } from "react-icons/ai";

const FileUpload = () => {
  // const [fileNames, setFileNames] = useState([]);
  // const [uploadedFiles, setUploadedFiles] = useState({});
  const [files, setFiles] = useState({});
  const [message, setMessage] = useState("");
  const [filesInInput, setFilesInInput] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  // const [fileLink, setFileLink] = useState([]);
  const { setUploadPercentage, setFileLinks } = useContext(ContextStates);

  console.log(submitted);

  const onChange = (e) => {
    setFiles(e.target.files);
  };

  useEffect(() => {
    if (files.length > 0) {
      console.log("files uploaded");
      setFilesInInput(true);
    } else {
      console.log("no files in input");
      setFilesInInput(false);
    }
  }, [files]);

  console.log(typeof files, files);
  Object.entries(files).map((entry) => {
    return console.log(entry[1].name);
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    // formData.append("file", file);
    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
    }
    setSubmitted(true);
    try {
      const res = await axios.post("http://localhost:3020/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          setUploadPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          );
        },
      });

      console.log(res);
      // Clear percentage
      setTimeout(() => setUploadPercentage(0), 500);
      setFilesInInput(false);
      e.target.reset();
      setFileLinks((fileLink) => [...fileLink, res.data.link]);
      setSubmitted(false);

      // const { fileName, filePath } = res.data;

      // setUploadedFiles({ fileName, filePath });

      // setMessage("File Uploaded");
    } catch (err) {
      console.log(err);
      if (err.response.status === 500) {
        setMessage("There was a problem with the server");
      } else {
        setMessage(err.response.data.msg);
      }
      setUploadPercentage(0);
    }

    console.log("test222222222222222222");
  };

  return (
    <Fragment>
      {/* {message ? <Message msg={message} /> : null} */}
      <form onSubmit={onSubmit} className="form">
        {/* <div> */}
        <input
          type="file"
          id="files"
          onChange={onChange}
          multiple
          required
          className="input"
        />
        {/* <label htmlFor="files">{filenames}</label> */}
        {/* </div> */}
        {filesInInput && !submitted ? (
          <>
            {/* <Progress percentage={uploadPercentage} /> */}
            <input
              type="submit"
              value="Upload file(s)"
              className="submitBtn"
              // onClick={() => setSubmitted(true)}
            />
          </>
        ) : null}
        <h2 className="heading2">
          Drag & Drop your file(s) here or{" "}
          <span className="click-to-browse-dummyBtn">Click</span> to browse
        </h2>
      </form>
      {/* <button id="submit" style="grid-column: span 2" type="submit">
        Share
      </button> */}
      {/* {uploadedFiles ? (
        <div>
          <div>
            <h3>{uploadedFiles.fileName}</h3>
            <img
              style={{ width: "100%" }}
              src={uploadedFiles.filePath}
              alt=""
            />
          </div>
        </div>
      ) : null} */}

      {filesInInput ? (
        <div className="files-to-upload">
          <div className="file-to-upload-inner-wrapper">
            {Object.entries(files).map((item, index) => {
              return (
                <div
                  className="files-to-upload__file"
                  key={item[1].name + index}
                >
                  <AiFillFile className="file-icon" />
                  {item[1].name}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </Fragment>
  );
};

export default FileUpload;
