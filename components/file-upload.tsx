"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import React from "react";
import { FileIcon, X } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
  endpoint: "messageFile" | "serverImage";
  value: string;
  onChange: (url?: string) => void;
}
export const FileUpload: React.FC<FileUploadProps> = ({
  endpoint,
  onChange,
  value,
}) => {
  const fileType = value?.split(".").pop();
  if (value && fileType !== "pdf") {
    return (
      <div className="relative h-20 w-20">
        <Image src={value} fill alt="upload" className="rounded-full" />
        <button
          title="Remove"
          onClick={() => onChange("")}
          className="bg-rose-500 text-white absolute top-0 right-0 shadow-sm p-1 rounded-full"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }
  console.log(value && fileType === "pdf");
  if (value && fileType === "pdf") {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={value}
          target="__blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
        >
          {value}
        </a>
        <button
          title="Remove"
          onClick={() => onChange("")}
          className="bg-rose-500 text-white absolute -top-2 -right-2 shadow-sm p-1 rounded-full"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
    />
  );
};
