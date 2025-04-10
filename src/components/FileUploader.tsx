import { useCallback } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { FaCloudUploadAlt } from "react-icons/fa";
import { Button } from "./ui/button";

type FileUploaderProps = {
  onChange: (file: File) => void;
  setImgPreview: React.Dispatch<React.SetStateAction<string | null>>;
};
function FileUploader({ onChange, setImgPreview }: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    // TODO: do something with files
    const file = acceptedFiles[0];
    onChange(file);
    setImgPreview(URL.createObjectURL(file));
  }, []);
  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
  });
  return (
    <div
      {...getRootProps()}
      className="flex flex-col items-center justify-center gap-2 rounded-lg border border-zinc-600 bg-zinc-700 px-4 py-8"
    >
      <input {...getInputProps({ multiple: false })} />
      <p className="text-mobp font-semibold text-zinc-100 lg:text-deskp lg:font-semibold">
        Drag Here to Upload Media
      </p>
      <p className="text-mobsmp text-zinc-200 lg:text-desksmp">
        Should be less than 9mb and only png and jpg files
      </p>
      <p className="text-mobxsp font-light text-zinc-300 lg:text-deskxsp lg:font-light">
        Recommended size:
        <br />
        2000px by 2000 px
      </p>
      <FaCloudUploadAlt className="h-auto w-8 fill-zinc-50" />
      <Button
        type="button"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          open();
        }}
      >
        Browse Files
      </Button>
    </div>
  );
}

export default FileUploader;
