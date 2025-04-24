"use client";

import styles from "./Home.module.css";
import { useEffect, useState, useRef } from "react";
import CharacterCard from "../../components/CharacterCard";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
    const [characters, setCharacters] = useState([]);
    const [notFound, setNotFound] = useState(false);
    const cacheRef = useRef(new Map());
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1); // controla página atual
    const [totalPages, setTotalPages] = useState(1); // total de páginas que a API tem

    const fetchCharacters = async (name = "", pageNumber = 1) => {
        setLoading(true);
        const cache = cacheRef.current;
        const cacheKey = `${name}_${pageNumber}`;
        const nextPageNumber = pageNumber + 1;
        const nextCacheKey = `${name}_${nextPageNumber}`;

        const cleanCacheIfNeeded = () => {
            while (cache.size > 5) {
                const oldestKey = cache.keys().next().value;
                cache.delete(oldestKey);
                console.log(`Cache size exceeded 5. Removed ${oldestKey}`);
            }
        };

        console.log("\n============== inicio da busca ==============");
        console.log(`Cache anterior: ${cache.size} páginas`);

        let total = totalPages;

        if (cache.has(cacheKey)) {
            const cached = cache.get(cacheKey);
            setCharacters(cached.results);
            setTotalPages(cached.totalPages);
            total = cached.totalPages;
            setNotFound(false);
            setLoading(false);
            console.log(`Usando cache: ${cacheKey}`);
        } else {
            try {
                const { data } = await axios.get(`https://rickandmortyapi.com/api/character/?page=${pageNumber}&name=${name}`);

                cleanCacheIfNeeded();
                cache.set(cacheKey, {
                    results: data.results,
                    totalPages: data.info.pages,
                });

                setCharacters(data.results);
                setTotalPages(data.info.pages);
                total = data.info.pages;
                setNotFound(false);
                console.log(`Salvo no cache: ${cacheKey}`);
            } catch {
                setCharacters([]);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        }

        if (nextPageNumber <= total && !cache.has(nextCacheKey)) {
            try {
                const res = await axios.get(`https://rickandmortyapi.com/api/character/?page=${nextPageNumber}&name=${name}`);
                cleanCacheIfNeeded();
                cache.set(nextCacheKey, {
                    results: res.data.results,
                    totalPages: res.data.info.pages,
                });
                console.log(`Prefetch salvo: ${nextCacheKey}`);
            } catch (err) {
                console.log(`Prefetch falhou: ${nextCacheKey}`, err);
            }
        } else {
            console.log("Prefetch ignorado: já no cache ou fora do limite");
        }

        console.log(`Cache final: ${cache.size} páginas`);
        for (const [key, val] of cache.entries()) {
            console.log(`${key}: ${val.results.length} personagens`);
        }
        console.log("============== busca finalizada ==============\n");
    };

    useEffect(() => {
        fetchCharacters();
    }, []);

    // ---------------------------------------------
    // filtrar o nome
    // ---------------------------------------------

    const [search, setSearch] = useState("");
    const handleSearch = () => {
        setPage(1);
        fetchCharacters(search, 1);
    };
    const handleReset = () => {
        setSearch("");
        setPage(1);
        fetchCharacters("", 1);
        toast.success("Filtro foi resetado", { position: "top-left" });
    };




    const handleCardClick = (char) => {
        toast.info(`Você clicou em ${char.name} que está ${char.status}`);
    };

    useEffect(() => {
        fetchCharacters(search.trim(), page);
    }, [page]);

    return (
        <div className={styles.container}>
            <ToastContainer position="top-right" autoClose={7500} theme="light" />
            <h1 className={styles.title}>Rick and Morty Characters</h1>

            <input
                type="text"
                placeholder="Pesquisar"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.input}
            />
            <button
                onClick={() => fetchCharacters(search.trim())}
                className={styles.button}
            >
                Buscar
            </button>
            <button
                    onClick={() => {
                        setSearch("");
                        fetchCharacters();
                    }}
                    className={styles.buttonRed}
                >
                    🗑
                </button>

            <div className={styles.navControls}>
                <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1} className={styles.buttonNav}>
                    Página anterior
                </button>

                <span className={styles.pageIndicator}>
                    Página {page} de {totalPages}
                </span>

                <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages} className={styles.buttonNav}>
                    Próxima página
                </button>
                
            </div>
            <div className={styles.grid}>
                {notFound ? (
                    <p>Character not found</p>
                ) : (
                    characters.map((char) => (
                        <CharacterCard
                            key={char.id}
                            character={char}
                            onClick={() => handleCardClick(char)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}