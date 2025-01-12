import GalleryGrid from "./gallery-grid";
import { SearchForm } from "./search-form";
import { SearchResult } from "@/lib/types/types";
import cloudinary from "@/lib/configs/cloudinary";
import { getSession } from "@/lib/auth/get-session";
import { getWebsiteByUserId } from "@/lib/fetchers/site";
import { redirect } from "next/navigation";
import UploadImageFormModal from "./upload-image-form-modal";
import { getGalleryImages } from "@/lib/fetchers/image";

export default async function GalleryPage({
  searchParams: { search },
}: {
  searchParams: {
    search: string;
  };
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const website = await getWebsiteByUserId(session.user.id);

  if (!website) {
   return null
  }

  const results = await getGalleryImages(website.cloudinaryDir)

  return (
      <div className="flex flex-col gap-8 p-6">
        <header className="flex justify-between">
          <h1 className="text-4xl font-bold">Galeria</h1>
          <UploadImageFormModal />
        </header>

        <SearchForm initialSearch={search} />

        <GalleryGrid
          websiteCloudinaryDir={website.cloudinaryDir}
          images={results.resources}
        />
      </div>
  );
}
