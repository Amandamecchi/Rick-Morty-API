"use client";

import styles from "./Home.module.css";
import { useEffect, useState } from "react";
import CharacterCard from "../../components/CharacterCard";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function Home() {
    const [character, setCharacters] = useState([]);
    const [notFound, setNotFound] = useState(false);
    const cacheRef = useRef(new Map());
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1); //controla página atual
    const [totalPages, setTotalPages] = useState(1); //total de páginas q  api tem

    const fetchCharacters = async (name= "", page = 1) => {
        setLoading(true); 
            const response = await axios.get(`https://rickandmortyapi.com/api/character/?name=${name}`);
            setCharacters(response.data.results);
            setTotalPages(data.info.pages);
       
            if (error.response && error.response.status === 404) {
                console.warn("Nenhum personagem encontrado para o nome fornecido.");
                setNotFound(true);
            } else {
                console.error("Erro ao buscar personagens: ", error);
            }
            setCharacters([]);
        
    };

    useEffect(() => {
        fetchCharacters(search.trim(), page);
    }, [page]);

    useEffect(() => {
        fetchCharacters(search);
    }, [search]);

    const handleSearch = () =>{
        const name = search.trim();
        setPage(1);
        fetchCharacters(name, 1);
    };

    const handleReset = () => {
        setSearch("");
        setPage(1);
        fetchCharacters("", 1);
        toast.success("O filtro foi zerado", {position: "top-right"});
    }   

    const handleCharacterClick = (name) => {
        toast.info(`Você clicou em ${name}`);
    };

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
                    setCharacters([]);
                    setNotFound(false);
                }}
                className={styles.buttonRed}
            >
                Resetar
            </button>

            <div className={styles.navControls}>
            <button on click ={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1} className={styles.buttonNav}>
                    Página anterior   
                </button>
                <button on click ={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages} className={styles.buttonNav}>
                    Próxima página
                </button>
                </div>
            <div className={styles.grid}>
                {notFound ? (
                    <p>Chacter not found </p>
                ) : (
                    characters.map((char) => (
                        <CharacterCard
                            key={char.id}
                            character={char}
                            onClick={() => handleCardClick(char.name)}
                        />
                    ))
                )}
            </div>
        </div>
    )};