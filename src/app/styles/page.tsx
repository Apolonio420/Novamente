const styles = [
  { image: '/style1.png', prompt: 'Un bosque mágico con niebla al amanecer' },
  { image: '/style2.png', prompt: 'Una ciudad futurista con luces de neón' },
];

export default function StylesPage() {
  return (
    <div className="bg-background text-textLight p-6">
      <h1 className="text-primary text-3xl mb-4">Inspírate con nuestros estilos</h1>
      <div className="grid grid-cols-2 gap-4">
        {styles.map((style, index) => (
          <div key={index} className="p-4 bg-secondary rounded">
            <img src={style.image} alt={`Estilo ${index + 1}`} />
            <p className="mt-2">{style.prompt}</p>
            <button
              className="bg-accent text-white p-2 mt-2 rounded"
              onClick={() => navigator.clipboard.writeText(style.prompt)}
            >
              Copiar prompt
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 