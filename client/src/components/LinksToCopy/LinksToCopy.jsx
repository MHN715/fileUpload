import { useState, useContext, useEffect } from "react";
import "./LinksToCopy.css";
import ContextStates from "../../context/ContextStates";

export default function LinksToCopy() {
  const { fileLinks } = useContext(ContextStates);

  async function copyToClipBoard(e) {
    const copiedMessage = e.target.nextElementSibling;
    const currentLink = e.target.attributes[0].value;

    if (!navigator.clipboard) {
      console.log("Clipboard API not available");
      return;
    }
    try {
      await navigator.clipboard.writeText(currentLink);
      copiedMessage.classList.add("copiedToClipbardMsg_anim");
      copiedMessage.addEventListener("animationend", () => {
        copiedMessage.classList.remove("copiedToClipbardMsg_anim");
      });
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  }

  useEffect(() => {
    if (fileLinks.length < 1) return;
    console.log("links received");
  }, [fileLinks]);

  return (
    <div
      className="links-to-copy"
      onLoadedData={() => {
        console.log("blur");
      }}
    >
      <h3>Your links:</h3>
      {fileLinks?.map((link, index) => {
        return (
          <div className="link-wrapper" key={index}>
            <p className="link">{link}</p>
            <div className="btn-copyText-wrapper">
              {" "}
              <button
                data-msg={link}
                onClick={copyToClipBoard}
                className="copy-btn"
              >
                Copy link
              </button>
              <div className="copiedToClipbardMsg">Copied to clipboard</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
