"use client";

import { CldUploadButton } from "next-cloudinary";
import { useState } from "react";

export default function UploadPage() {
  const [publicId, setPublicId] = useState<string | null>(null);

  return (
    <div className="p-4">
      <CldUploadButton
        uploadPreset="my_unsigned_preset"
        onUpload={(result: any) => {
          setPublicId(result?.info?.public_id);
        }}
      />

      {publicId && (
        <img
          src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`}
          alt="Uploaded"
          className="mt-4 max-w-xs rounded"
        />
      )}
    </div>
  );
}
