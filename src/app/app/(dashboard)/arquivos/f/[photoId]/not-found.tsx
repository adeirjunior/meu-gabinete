import Image from "next/image";

export default function NotFoundPost() {
  return (
    <div className="mt-20 flex flex-col items-center space-x-4">
      <h1 className="font-cal text-4xl">404</h1>
      <Image
        alt="missing site"
        src="https://illustrations.popsy.co/gray/falling.svg"
        width={400}
        height={400}
      />
      <p className="text-lg text-stone-500">
        Esta imagem não existe, ou você não tem permissão para edita-lo.
      </p>
    </div>
  );
}
