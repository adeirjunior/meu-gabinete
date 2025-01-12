import EventCard from "@/components/card/event-card";
import { EventWithSite } from "@/components/editor/event-editor";
import { getEventsForSite } from "@/lib/fetchers/event";
import { Image } from "@nextui-org/react";
import { Grid } from "@tremor/react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eventos",
};

export default async function page({ params }: { params: { domain: string } }) {
  const domain = decodeURIComponent(params.domain);

  const [events] = await Promise.all([getEventsForSite(domain)]);

 
  return (
    <div className="container space-y-8 p-6">
      <section>
        <h2 className="mb-4 text-xl font-bold">Próximos Eventos</h2>
        {events.length > 0 ? (
          <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-2">
            {events.map((event, index) =>
              index <= 2 ? <EventCard key={index} data={event} /> : null,
            )}
          </Grid>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <Image
              alt="missing post"
              src="https://illustrations.popsy.co/gray/success.svg"
              width={400}
              height={400}
              className="dark:hidden"
            />
            <Image
              alt="missing post"
              src="https://illustrations.popsy.co/white/success.svg"
              width={400}
              height={400}
              className="hidden dark:block"
            />
            <p className="font-title text-2xl text-stone-600 dark:text-stone-400">
              Sem eventos ainda.
            </p>
          </div>
        )}
      </section>
      <section>
        <h2 className="mb-4 text-xl font-bold">Eventos Antigos</h2>
        {events.length > 0 ? (
          <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-2">
            {events.map((event, index) =>
              index > 2 ? <EventCard key={index} data={event} /> : null,
            )}
          </Grid>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <Image
              alt="missing post"
              src="https://illustrations.popsy.co/gray/success.svg"
              width={400}
              height={400}
              className="dark:hidden"
            />
            <Image
              alt="missing post"
              src="https://illustrations.popsy.co/white/success.svg"
              width={400}
              height={400}
              className="hidden dark:block"
            />
            <p className="font-title text-2xl text-stone-600 dark:text-stone-400">
              Sem eventos ainda.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
