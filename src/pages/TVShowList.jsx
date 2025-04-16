import { useEffect, useState } from 'react';

const url = 'https://imdb8.p.rapidapi.com/title/v2/get-popular?first=20&country=US&language=en-US';
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
		'x-rapidapi-host': 'imdb8.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.text();
	console.log(result);
} catch (error) {
	console.error(error);
}

function TVShowList() {
  const [tv, setTv] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/movies', options)
      .then(res => res.json())
      .then(data => {
        console.log('TV Show List:', data);
  
        const edges = data?.data?.tv?.edges || []; // ⚠️ esto es clave
  
        const results = edges.map(edge => {
          const node = edge.node || {};
          return {
            title: node.titleText?.text || 'Sin título',
            image: node.primaryImage?.url || '',
          };
        });

        setTv(results);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al hacer fetch:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen w-[80%] bg-white  p-7 mx-auto items-center justify-center gap-5">
      {/* Movie List*/}
      <div className="pt-10">
        <div className="flex justify-between mb-5 font-semibold">
            <p className="text-xl text-black">TV Shows</p>
        </div>

      {loading ? (
        <p className="text-gray-900">Loading...</p>
      ) : tv.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tv.map((tv, index) => (
            <div key={index} className="p-4">
              {tv.image ? (
                <img
                  src={tv.image}
                  loading="lazy"
                  alt={tv.title}
                  className="w-[80%] h-auto object-cover rounded-2xl"
                />
              ) : (
                <div className="w-full h-64 flex items-center justify-center">
                  <span className="text-gray-400">Sin imagen</span>
                </div>
              )}
              <h2 className="mt-2 text-xl font-semibold">{tv.title}</h2>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-900">No se encontraron resultados.</p>
      )}
    </div>
    </div>
  );
}

export default TVShowList;



