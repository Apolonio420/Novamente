const styles = [
  { image: '/style1.png', prompt: 'Un bosque mágico con niebla al amanecer' },
  { image: '/style2.png', prompt: 'Una ciudad futurista con luces de neón' },
];

export default function StylesPage() {
  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block text-4xl font-extrabold tracking-tight lg:text-5xl">
            Estilos
          </h1>
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <div className="grid gap-8">
        <ImageUpload />
      </div>
    </div>
  );
} 