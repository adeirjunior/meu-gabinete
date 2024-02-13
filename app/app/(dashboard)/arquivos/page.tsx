import UploadButton from "./upload-button";
import GalleryGrid from "./gallery-grid";
import { SearchForm } from "./search-form";
import { SearchResult } from "@/lib/types/types";
import cloudinary from "@/lib/configs/cloudinary";
import { getSession } from "@/lib/auth/get-session";
import { getWebsiteByUserId } from "@/lib/fetchers/site";
import { redirect } from "next/navigation";



export default async function GalleryPage({
  searchParams: { search },
}: {
  searchParams: {
    search: string;
  };
}) {
  const session = await getSession()
  
  if(!session) {
    redirect("/login")
  }

  const website = await getWebsiteByUserId(session.user.id)

  const results = (await cloudinary.v2.search
    .expression(`folder="${website.cloudinaryDir}/*"${search ? ` AND tags=${search}` : ""}`)
    .sort_by("created_at", "desc")
    .with_field("tags")
    .max_results(30)
    .execute()) as { resources: SearchResult[] };

  return (
    <section>
      <div className="flex flex-col gap-8">
        <div className="flex justify-between">
          <h1 className="text-4xl font-bold">Galeria</h1>
          <UploadButton websiteCloudinaryDir={website.cloudinaryDir}/>
        </div>

        <SearchForm initialSearch={search} />

        <GalleryGrid websiteCloudinaryDir={website.cloudinaryDir} images={results.resources} />
      </div>
    </section>
  );
}
