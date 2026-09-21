"use client";

import { useEffect, useState } from "react";

// A file input that shows a preview of the image(s) you picked before saving.
// It's a Client Component because previews use browser-only APIs (URL.createObjectURL).
export default function ImagePicker({
  id,
  name,
  multiple = false,
  currentUrl,
}: {
  id: string;
  name: string;
  multiple?: boolean;
  // The image already saved (edit forms), shown until a new file is chosen.
  currentUrl?: string | null;
}) {
  const [previews, setPreviews] = useState<string[]>([]);

  // Free the temporary preview URLs when they're replaced or the form closes.
  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  return (
    <div className="mt-1">
      <input
        id={id}
        name={name}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple={multiple}
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          setPreviews(files.map((file) => URL.createObjectURL(file)));
        }}
        className="block w-full text-sm text-zinc-700 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-200 file:px-3 file:py-2 file:text-sm file:font-medium file:text-zinc-800 hover:file:bg-zinc-300"
      />

      {(previews.length > 0 || currentUrl) && (
        <div className="mt-3 flex flex-wrap gap-3">
          {previews.length > 0
            ? previews.map((url) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={url}
                  src={url}
                  alt="Selected file preview"
                  className="h-24 w-32 rounded-md object-cover"
                />
              ))
            : currentUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentUrl}
                  alt="Current image"
                  className="h-24 w-32 rounded-md object-cover"
                />
              )}
        </div>
      )}
    </div>
  );
}
