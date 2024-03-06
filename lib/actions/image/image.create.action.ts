"use server";

import { getSession } from "@/lib/auth/get-session";
import cloudinary from "@/lib/configs/cloudinary";
import { getWebsiteByUserId } from "@/lib/fetchers/site";
import { SearchResult } from "@/lib/types/types";
import { randomUUID } from "crypto";
import { redirect } from "next/navigation";

type CreateImageHandleSubmit = (
  userId: string,
  filename: string,
) =>
  | Promise<{ folderPath: string; filePath: string }>
  | { folderPath: string; filePath: string };

export async function create(
  formData: FormData,
  handleSubmit: CreateImageHandleSubmit,
  key: string,
  tags?: string[],
) {
  try {
    const session = await getSession();

    if (!session) {
      throw new Error("Erro");
    }

    const file = formData.get(key) as File;

    const imageReader = file.stream().getReader();
    const imageDataU8: any[] = [];

    while (true) {
      const { done, value } = await imageReader.read();
      if (done) break;

      imageDataU8.push(...value);
    }

    const imageBinary = Buffer.from(imageDataU8 as any, "binary");

    const filename = randomUUID();

    const upload = async () =>
      await new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload_stream(
          {
            tags: tags ? [...tags] : [],
            folder: folderPath,
            public_id: filename,
            unique_filename: true,
            discard_original_filename: true,
          },
          function (error: any, result: unknown) {
            if (error) {
              reject(JSON.stringify(error));
              return;
            }
            resolve(result);
          },
        ).end(imageBinary);
      });

    const { folderPath, filePath } = await handleSubmit(session.user.id, filename);

    await upload();
    return filePath;
  } catch (error) {
    console.error("Erro na função 'create':", error);
    throw error;
  }
}


function excludeCommonPath(basePath: string, excludePath: string): string {
  const remainingPath = excludePath.substring(basePath.length);

  return remainingPath;
}

export const createWebsiteFolder = async (id: string) => {
  await cloudinary.v2.api.create_folder(`E-Gab/Websites/Website ${id}`);
};

export async function setAsFavoriteAction(
  publicId: string,
  isFavorite: boolean,
) {
  if (isFavorite) {
    await cloudinary.v2.uploader.add_tag("favorite", [publicId]);
  } else {
    await cloudinary.v2.uploader.remove_tag("favorite", [publicId]);
  }
}

export async function addImageToAlbum(image: SearchResult, album: string) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
    return {
      error: "Você não está logado.",
    };
  }

  const website = await getWebsiteByUserId(session.user.id);

  if (!website) {
    return {
      error: "Site não foi encontrado.",
    };
  }

  const websiteCloudinaryDir = website.cloudinaryDir;

  await cloudinary.v2.api.create_folder(`${websiteCloudinaryDir}/${album}`);

  let parts = image.public_id.split("/");
  if (parts.length > 1) {
    parts = parts.slice(1);
  }
  const publicId = parts.join("/");

  await cloudinary.v2.uploader.rename(
    image.public_id,
    `${websiteCloudinaryDir}/${album}/${excludeCommonPath(
      websiteCloudinaryDir,
      publicId,
    )}`,
  );
}
