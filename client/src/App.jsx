import { useState } from "react";
import FileUpload from "./components/FileUpload/FileUpload";
import "./App.css";
import { AiOutlineCloudUpload } from "react-icons/ai";
import LinksToCopy from "./components/LinksToCopy/LinksToCopy";
import Progress from "./components/progress/Progress";
import ContextStates from "./context/ContextStates";
import { ReactComponent as Logo } from "./icons/rackhosting-logo.svg";
import { ReactComponent as RackhostingIcon } from "./icons/rackhosting-icon.svg";

export default function App() {
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [fileLinks, setFileLinks] = useState([]);

  return (
    <ContextStates.Provider
      value={{ setUploadPercentage, uploadPercentage, fileLinks, setFileLinks }}
    >
      <Logo className="logo" />
      <div className="wrapper">
        <div className="heading-wrapper">
          <AiOutlineCloudUpload className="upload-icon" />
          <h1 className="heading">Upload your file(s)</h1>
        </div>

        <FileUpload />
        <LinksToCopy />
        <Progress percentage={uploadPercentage} />
      </div>
      <RackhostingIcon className="rackhosting-icon" />
    </ContextStates.Provider>
  );
}
