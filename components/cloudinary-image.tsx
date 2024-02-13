"use client";

import { SearchResult } from "@/lib/types/types";
import CldImage from "./demo/cloudinary-image";
import { CldImageProps } from "next-cloudinary";
import { useState, useTransition } from "react";
import { FullHeart } from "./icons/full-heart";
import { setAsFavoriteAction } from "@/lib/actions/image/image.create.action";
import { Heart } from "./icons/heart";
import { ImageMenu } from "./image-menu";

export function CloudinaryImage(
  props: {
    websiteCloudinaryDir: string;
    imageData: SearchResult;
    onUnheart?: (unheartedResource: SearchResult) => void;
  } & Omit<CldImageProps, "src">,
) {
  const [transition, startTransition] = useTransition();

  const { imageData, onUnheart, websiteCloudinaryDir } = props;

  const [isFavorited, setIsFavorited] = useState(
    imageData.tags.includes("favorite"),
  );

  return (
    <div className="relative">
      <CldImage {...props} src={imageData.public_id} />
      {isFavorited ? (
        <FullHeart
          onClick={() => {
            onUnheart?.(imageData);
            setIsFavorited(false);
            startTransition(() => {
              setAsFavoriteAction(imageData.public_id, false);
            });
          }}
          className="absolute left-2 top-2 cursor-pointer text-red-500 hover:text-white"
        />
      ) : (
        <Heart
          onClick={() => {
            setIsFavorited(true);
            startTransition(() => {
              setAsFavoriteAction(imageData.public_id, true);
            });
          }}
          className="absolute left-2 top-2 cursor-pointer hover:text-red-500"
        />
      )}
      <ImageMenu
        image={imageData}
        websiteCloudinaryDir={websiteCloudinaryDir}
      />
    </div>
  );
}
