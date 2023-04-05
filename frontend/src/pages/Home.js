import { useEffect, useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import formatBytes from "../util/formatBytes";
import download from "downloadjs";
import Page from "./Page";
import formatDate from "../util/formatDate";
import {
  ArrowDownTrayIcon,
  ArrowUpOnSquareIcon,
  ShareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFileActions } from "../actions/file";
import { useUserActions } from "../actions/user";

export default function Home() {
  const [entities, setEntities] = useState([]);
  const [email, setEmail] = useState();
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState();
  const { accessToken } = useAuth();
  const hiddenFileInput = useRef(null);
  const file = useFileActions();
  const user = useUserActions();

  useEffect(() => {
    if (accessToken === "loading") return;

    setLoading(true);
    fetchData();
  }, [accessToken]);

  async function fetchData() {
    // fetch entities
    const files = await file.getAllMetadata();
    files.map((entity) => {
      entity.name = entity.name.split("/").slice(1).join("/");
      return entity;
    });
    setEntities(files);

    // fetch email
    const userData = await user.getData();
    if (!userData.error) {
      setEmail(userData.email);
    } else {
      console.log(userData.error);
    }

    setLoading(false);
  }

  async function downloadFile() {
    const blob = await file.get(focused);
    download(blob, focused);
  }

  async function deleteFile(event) {
    event.preventDefault();

    await toast.promise(
      file.remove(focused),
      {
        pending: "Deleting file...",
        success: "File deleted successfully!",
        error: "Sorry, we ran into an error",
      },
      {
        position: toast.POSITION.BOTTOM_RIGHT,
        hideProgressBar: true,
      }
    );
    setFocused(null);
    fetchData();
  }

  async function shareFile(event) {
    event.preventDefault();

    await toast.promise(
      file.share(focused),
      {
        pending: "Sharing file...",
        success: "File URL copied to clipboard!",
        error: "Sorry, we ran into an error",
      },
      {
        position: toast.POSITION.BOTTOM_RIGHT,
        hideProgressBar: true,
      }
    );

    const filtered = entities.filter((entity) => entity.name === focused);
    const fileId = filtered[0].metadata.id;
    navigator.clipboard.writeText(window.location.href + "files/" + fileId);
  }

  function handleUpload(event) {
    hiddenFileInput.current.click();
  }

  async function handleFileChange(event) {
    const uploadedFile = event.target.files[0];

    await toast.promise(
      file.upload(uploadedFile),
      {
        pending: "Uploading file...",
        success: "File uploaded successfully!",
        error: "Sorry, we ran into an error",
      },
      {
        position: toast.POSITION.BOTTOM_RIGHT,
        hideProgressBar: true,
      }
    );
    fetchData();
  }

  async function handleFocus(name) {
    setFocused(name);
  }

  async function handleBlur(name) {
    setFocused(null);
  }

  return (
    <Page name="Files" loading={loading} authenticated={true}>
      <ToastContainer bodyClassName="toast" />
      <div className="mb-4 text-lg">
        Signed in as <span className="text-indigo-500">{email}</span>
      </div>
      <div className="flex">
        <input
          type="file"
          id="upload"
          ref={hiddenFileInput}
          onChange={handleFileChange}
          hidden
        />
        <button
          className="group relative flex align-middle inline-block justify-center mb-4 mr-2 py-2 pl-3 pr-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={handleUpload}
        >
          <ArrowUpOnSquareIcon
            className="block h-6 w-6 mr-2"
            aria-hidden="true"
          />
          <div className="mt-0.5 font-bold">Upload</div>
        </button>
        {focused && (
          <button
            className="group relative flex align-middle inline-block mr-2 justify-center mb-4 py-2 pl-3 pr-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
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
        {focused && (
          <button
            className="group relative flex align-middle justify-center mr-2 mb-4 py-2 pl-3 pr-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={deleteFile}
            onMouseDown={(event) => event.preventDefault()}
          >
            <TrashIcon className="block h-6 w-6 mr-2" aria-hidden="true" />
            <div className="mt-0.5 font-bold">Delete</div>
          </button>
        )}
        {focused && (
          <button
            className="group relative flex align-middle justify-center mb-4 py-2 pl-3 pr-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={shareFile}
            onMouseDown={(event) => event.preventDefault()}
          >
            <ShareIcon className="block h-6 w-6 mr-2" aria-hidden="true" />
            <div className="mt-0.5 font-bold">Share</div>
          </button>
        )}
      </div>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Last Modified
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Size
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {entities.map((entity) => (
                    <tr
                      key={entity.id}
                      tabIndex={0}
                      onFocus={() => handleFocus(entity.name)}
                      onBlur={() => handleBlur(entity.name)}
                      className="hover:bg-gray-100 bg-white focus:outline-none focus:bg-indigo-100 cursor-pointer"
                    >
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {entity.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(new Date(entity.updated))}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatBytes(Math.ceil(entity.size))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
