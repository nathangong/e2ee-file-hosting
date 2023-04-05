import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import download from "downloadjs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFileActions } from "../actions/file";
import Page from "./Page";

export default function SharedFile() {
  const { id } = useParams();
  const file = useFileActions();
  const [fileName, setFileName] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFile();
  });

  async function fetchFile() {
    try {
      const metadata = await file.getSharedMetadata(id);
      setFileName(metadata.metadata.name);
    } catch (e) {}
    setLoading(false);
  }

  async function downloadFile() {
    const blob = await file.getShared(id);
    download(blob, fileName);
  }

  return (
    <Page name="Download Shared File" loading={loading}>
      {fileName ? (
        <div className="mb-4 text-lg">
          You have been shared{" "}
          <span className="text-indigo-500">{fileName}</span>. Download the file
          below:
        </div>
      ) : (
        <div className="mb-4 text-lg">
          The file you have been shared either doesn't exist or has been
          deleted.
        </div>
      )}

      {fileName && (
        <button
          className="group relative flex align-middle inline-block mr-2 justify-center mb-4 py-2 pl-3 pr-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          onClick={downloadFile}
          onMouseDown={(event) => event.preventDefault()}
        >
          <ArrowDownTrayIcon
            className="block h-6 w-6 mr-2"
            aria-hidden="true"
          />
          <div className="mt-0.5 font-bold">Download</div>
        </button>
      )}
    </Page>
  );
}
