import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "renovatecalc_field_photos";

  function FieldPhoto({ onBack, onHome }) {
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [photos, setPhotos] = useState([]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");


  // ============================================================
  // LOAD SAVED PHOTOS
  // ============================================================

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        setPhotos(JSON.parse(saved));
      }
    } catch (error) {
      console.error(
        "Could not load field photos:",
        error
      );
    }
  }, []);


  // ============================================================
  // CLEANUP CAMERA WHEN PAGE CLOSES
  // ============================================================

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);


  // ============================================================
  // CONNECT CAMERA STREAM TO VIDEO
  // ============================================================

  useEffect(() => {
    if (
      cameraOpen &&
      videoRef.current &&
      streamRef.current
    ) {
      videoRef.current.srcObject =
        streamRef.current;

      videoRef.current.play().catch(() => {});
    }
  }, [cameraOpen]);


  // ============================================================
  // OPEN FILE / PHONE CAMERA
  // ============================================================

  const openFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };


  // ============================================================
  // FILE SELECTED
  // ============================================================

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    stopCamera();

    setSelectedFile(file);

    const objectUrl =
      URL.createObjectURL(file);

    setPreview(objectUrl);

    setTitle("");
    setNote("");

    // Allow selecting the same file again later
    event.target.value = "";
  };


  // ============================================================
  // START CAMERA
  // ============================================================

  const startCamera = async () => {
    setCameraError("");

    try {
      if (
        !navigator.mediaDevices?.getUserMedia
      ) {
        setCameraError(
          "Camera access is not supported by this browser. Please use Choose Photo instead."
        );

        return;
      }

      stopCamera();

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: {
              ideal: "environment",
            },

            width: {
              ideal: 1280,
            },

            height: {
              ideal: 720,
            },
          },

          audio: false,
        });

      streamRef.current = stream;

      setCameraOpen(true);
    } catch (error) {
      console.error(
        "Camera error:",
        error
      );

      if (
        error?.name === "NotAllowedError"
      ) {
        setCameraError(
          "Camera permission was denied. Please allow camera access in your browser and try again."
        );
      } else if (
        error?.name === "NotFoundError"
      ) {
        setCameraError(
          "No camera was found on this device."
        );
      } else if (
        error?.name === "NotReadableError"
      ) {
        setCameraError(
          "The camera is already being used by another application."
        );
      } else {
        setCameraError(
          "Unable to open the camera. Please check camera permissions or use Choose Photo."
        );
      }
    }
  };


  // ============================================================
  // STOP CAMERA
  // ============================================================

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraOpen(false);
  };


  // ============================================================
  // DATA URL → FILE
  // ============================================================

  const dataUrlToFile = (
    dataUrl,
    fileName
  ) => {
    const parts = dataUrl.split(",");

    const mimeMatch =
      parts[0].match(/:(.*?);/);

    const mime = mimeMatch
      ? mimeMatch[1]
      : "image/jpeg";

    const binary = atob(parts[1]);

    const length = binary.length;

    const bytes =
      new Uint8Array(length);

    for (
      let i = 0;
      i < length;
      i++
    ) {
      bytes[i] =
        binary.charCodeAt(i);
    }

    return new File(
      [bytes],
      fileName,
      {
        type: mime,
      }
    );
  };


  // ============================================================
  // CAPTURE PHOTO FROM CAMERA
  // ============================================================

  const capturePhoto = () => {
    const video =
      videoRef.current;

    const canvas =
      canvasRef.current;

    if (!video || !canvas) {
      return;
    }

    if (
      !video.videoWidth ||
      !video.videoHeight
    ) {
      setCameraError(
        "Camera is still starting. Please wait a moment and try again."
      );

      return;
    }

    canvas.width =
      video.videoWidth;

    canvas.height =
      video.videoHeight;

    const context =
      canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const dataUrl =
      canvas.toDataURL(
        "image/jpeg",
        0.85
      );

    const file =
      dataUrlToFile(
        dataUrl,
        `renovatecalc-${Date.now()}.jpg`
      );

    setSelectedFile(file);

    setPreview(dataUrl);

    setTitle("");
    setNote("");

    stopCamera();
  };


  // ============================================================
  // SAVE PHOTO
  // ============================================================

  const savePhoto = () => {
    if (
      !selectedFile ||
      !preview
    ) {
      alert(
        "Please take or select a photo first."
      );

      return;
    }

    const reader =
      new FileReader();

    reader.onloadend = () => {
      const base64Image =
        reader.result;

      const newPhoto = {
        id: Date.now(),

        title:
          title.trim() ||
          "Site Photo",

        note:
          note.trim(),

        image:
          base64Image,

        createdAt:
          new Date().toISOString(),
      };

      const updatedPhotos = [
        newPhoto,
        ...photos,
      ];

      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(
            updatedPhotos
          )
        );

        setPhotos(
          updatedPhotos
        );

        setSelectedFile(null);
        setPreview("");
        setTitle("");
        setNote("");

        alert(
          "Photo saved successfully."
        );
      } catch (error) {
        console.error(
          "Could not save photo:",
          error
        );

        alert(
          "Photo could not be saved. Your browser storage may be full."
        );
      }
    };

    reader.readAsDataURL(
      selectedFile
    );
  };


  // ============================================================
  // DELETE PHOTO
  // ============================================================

  const deletePhoto = (id) => {
    const confirmDelete =
      window.confirm(
        "Delete this photo?"
      );

    if (!confirmDelete) {
      return;
    }

    const updatedPhotos =
      photos.filter(
        (photo) =>
          photo.id !== id
      );

    setPhotos(
      updatedPhotos
    );

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        updatedPhotos
      )
    );
  };


  // ============================================================
  // CLEAR ALL PHOTOS
  // ============================================================

  const clearAllPhotos = () => {
    if (photos.length === 0) {
      return;
    }

    const confirmClear =
      window.confirm(
        "Delete all saved site photos?"
      );

    if (!confirmClear) {
      return;
    }

    setPhotos([]);

    localStorage.removeItem(
      STORAGE_KEY
    );
  };


  // ============================================================
  // CANCEL CURRENT PHOTO
  // ============================================================

  const cancelCurrentPhoto = () => {
    stopCamera();

    setSelectedFile(null);
    setPreview("");
    setTitle("");
    setNote("");
    setCameraError("");
  };


  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (date) => {
    try {
      return new Date(
        date
      ).toLocaleString();
    } catch {
      return "";
    }
  };


  // ============================================================
  // BACK
  // ============================================================

  const handleBack = () => {
    stopCamera();
    onBack();
  };


  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-50 pb-8">

      {/* ======================================================
          HEADER
          ====================================================== */}

      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm">

        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">

          <div>
            <div className="text-lg font-extrabold text-blue-900">
              RenovateCalc
            </div>

            <div className="text-xs font-semibold text-slate-500">
              Site Field Mode
            </div>
          </div>


          {/* BACK BUTTON */}

          <button
            type="button"
            onClick={handleBack}
            className="rounded-xl bg-blue-800 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-900"
          >
            ← Back
          </button>

          <button
            type="button"
            onClick={() => {
            stopCamera();
            onHome();
          }}
            className="rounded-xl bg-blue-800 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-900"
          >
            ⌂ Home
          </button>

        </div>

      </div>


      {/* ======================================================
          MAIN
          ====================================================== */}

      <main className="mx-auto max-w-2xl px-4 py-5">

        {/* PAGE TITLE */}

        <div className="mb-5">

          <h1 className="text-2xl font-extrabold text-slate-900">
            Site Photos
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Take photos of rooms, walls, materials and site work.
          </p>

        </div>


        {/* ====================================================
            CAMERA / PHOTO ACTIONS
            ==================================================== */}

        {!preview &&
          !cameraOpen && (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

              <div className="mb-4">

                <div className="text-sm font-extrabold text-slate-900">
                  Add Site Photo
                </div>

                <div className="mt-1 text-xs text-slate-500">
                  Use your camera or select an existing photo.
                </div>

              </div>


              <div className="grid gap-3 sm:grid-cols-2">

                {/* CAMERA BUTTON */}

                <button
                  type="button"
                  onClick={
                    startCamera
                  }
                  className="flex min-h-[110px] flex-col items-center justify-center rounded-2xl border-2 border-blue-200 bg-blue-50 px-4 py-5 text-center transition hover:border-blue-400 hover:bg-blue-100 active:scale-[0.98]"
                >

                  <span className="text-4xl">
                    📷
                  </span>

                  <span className="mt-2 text-sm font-extrabold text-blue-900">
                    Use Camera
                  </span>

                  <span className="mt-1 text-xs text-blue-700">
                    Open device camera
                  </span>

                </button>


                {/* FILE BUTTON */}

                <button
                  type="button"
                  onClick={
                    openFilePicker
                  }
                  className="flex min-h-[110px] flex-col items-center justify-center rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-5 text-center transition hover:border-blue-300 hover:bg-blue-50 active:scale-[0.98]"
                >

                  <span className="text-4xl">
                    🖼️
                  </span>

                  <span className="mt-2 text-sm font-extrabold text-slate-800">
                    Choose Photo
                  </span>

                  <span className="mt-1 text-xs text-slate-500">
                    Gallery or files
                  </span>

                </button>

              </div>


              {/* CAMERA ERROR */}

              {cameraError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
                  {cameraError}
                </div>
              )}

            </div>
          )}


        {/* ====================================================
            HIDDEN FILE INPUT
            ==================================================== */}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={
            handleFileChange
          }
          className="hidden"
        />


        {/* ====================================================
            CAMERA VIEW
            ==================================================== */}

        {cameraOpen && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-sm">

            <div className="relative aspect-[4/3] w-full bg-black">

              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover"
              />

            </div>


            <div className="bg-white p-4">

              <div className="mb-3 text-center text-sm font-bold text-slate-700">
                Position the camera and take the photo
              </div>


              <div className="grid grid-cols-2 gap-3">

                {/* CANCEL CAMERA */}

                <button
                  type="button"
                  onClick={
                    stopCamera
                  }
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700"
                >
                  Cancel
                </button>


                {/* CAPTURE */}

                <button
                  type="button"
                  onClick={
                    capturePhoto
                  }
                  className="rounded-xl bg-blue-800 px-4 py-3 text-sm font-extrabold text-white shadow-sm hover:bg-blue-900"
                >
                  📸 Capture
                </button>

              </div>


              {cameraError && (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
                  {cameraError}
                </div>
              )}

            </div>

          </div>
        )}


        {/* ====================================================
            HIDDEN CANVAS
            ==================================================== */}

        <canvas
          ref={canvasRef}
          className="hidden"
        />


        {/* ====================================================
            PHOTO PREVIEW
            ==================================================== */}

        {preview &&
          !cameraOpen && (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              {/* IMAGE */}

              <div className="bg-slate-100 p-3">

                <img
                  src={preview}
                  alt="Site preview"
                  className="max-h-[420px] w-full rounded-xl object-contain"
                />

              </div>


              {/* DETAILS */}

              <div className="space-y-4 p-4">

                {/* TITLE */}

                <div>

                  <label className="mb-1.5 block text-sm font-bold text-slate-700">
                    Photo Title
                  </label>

                  <input
                    type="text"
                    value={title}
                    onChange={(
                      event
                    ) =>
                      setTitle(
                        event.target.value
                      )
                    }
                    placeholder="Example: Living room wall"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />

                </div>


                {/* NOTE */}

                <div>

                  <label className="mb-1.5 block text-sm font-bold text-slate-700">
                    Note
                  </label>

                  <textarea
                    value={note}
                    onChange={(
                      event
                    ) =>
                      setNote(
                        event.target.value
                      )
                    }
                    rows={3}
                    placeholder="Example: Wall needs plaster repair before painting."
                    className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />

                </div>


                {/* ACTION BUTTONS */}

                <div className="grid grid-cols-2 gap-3">

                  <button
                    type="button"
                    onClick={
                      cancelCurrentPhoto
                    }
                    className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={
                      savePhoto
                    }
                    className="rounded-xl bg-blue-800 px-4 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-blue-900"
                  >
                    💾 Save Photo
                  </button>

                </div>

              </div>

            </div>
          )}


        {/* ====================================================
            SAVED PHOTOS
            ==================================================== */}

        <div className="mt-6">

          <div className="mb-3 flex items-center justify-between">

            <div>

              <h2 className="text-lg font-extrabold text-slate-900">
                Saved Photos
              </h2>

              <p className="text-xs text-slate-500">
                {photos.length} photo
                {photos.length === 1
                  ? ""
                  : "s"}{" "}
                saved
              </p>

            </div>


            {photos.length > 0 && (
              <button
                type="button"
                onClick={
                  clearAllPhotos
                }
                className="rounded-lg px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
              >
                Clear All
              </button>
            )}

          </div>


          {/* NO PHOTOS */}

          {photos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">

              <div className="text-4xl">
                📷
              </div>

              <div className="mt-3 text-sm font-bold text-slate-700">
                No site photos yet
              </div>

              <div className="mt-1 text-xs text-slate-500">
                Take your first site photo above.
              </div>

            </div>
          ) : (

            /* PHOTO LIST */

            <div className="space-y-4">

              {photos.map(
                (photo) => (
                  <div
                    key={photo.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >

                    {/* PHOTO */}

                    <img
                      src={
                        photo.image
                      }
                      alt={
                        photo.title
                      }
                      className="max-h-[400px] w-full object-cover"
                    />


                    {/* PHOTO DETAILS */}

                    <div className="p-4">

                      <div className="flex items-start justify-between gap-3">

                        <div className="min-w-0">

                          <div className="break-words text-sm font-extrabold text-slate-900">
                            {
                              photo.title
                            }
                          </div>

                          {photo.note && (
                            <div className="mt-1 break-words text-sm text-slate-600">
                              {
                                photo.note
                              }
                            </div>
                          )}

                          <div className="mt-2 text-xs text-slate-400">
                            {formatDate(
                              photo.createdAt
                            )}
                          </div>

                        </div>


                        {/* DELETE */}

                        <button
                          type="button"
                          onClick={() =>
                            deletePhoto(
                              photo.id
                            )
                          }
                          className="shrink-0 rounded-lg px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </div>

      </main>

    </div>
  );
}

export default FieldPhoto;