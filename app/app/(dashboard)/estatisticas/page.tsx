import { hasSubscription } from "@/lib/helpers/billing";
import OnboardingExample from "@/components/onboarding";
import ButtonC from "./button";
import UploadImageModal from "@/components/modal/upload-image";
import { getSession } from "@/lib/auth/get-session";
import { getWebsiteByUserId } from "@/lib/fetchers/site";
import { redirect } from "next/navigation";
import { SearchResult } from "@/lib/types/types";
import cloudinary from "@/lib/configs/cloudinary";

export default async function page() {
  const hasSub = await hasSubscription()
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const website = await getWebsiteByUserId(session.user.id);

   const results = (await cloudinary.v2.search
    .expression(`folder="${website.cloudinaryDir}/*"`)
    .sort_by("created_at", "desc")
    .with_field("tags")
    .max_results(30)
    .execute()) as { resources: SearchResult[] };

  return (
    <div className="p-8">
      <h1 className="m-0 mb-2 font-cal text-xl font-bold sm:text-3xl dark:text-white">
        Estatísticas
      </h1>
      <OnboardingExample />
      <ButtonC hasSub={hasSub} />
      <UploadImageModal website={website} images={results.resources} />
    </div>
  );
}
