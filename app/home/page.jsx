"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import CharacterCard from "../../components/CharacterCard";
import styles from "./Home.module.css";

export default function Home() {
    const [search, setSearch] = useState("");
    const [character, setCharacters] = useState([]);
    const [notFound, setNotFound] = useState(false);

    const fetchCharacters = async (name = "") => {
        try {
            const response = await axios.get(`https://rickandmortyapi.com/api/character/?name=${name}`);
            setCharacters(response.data.results);
            setNotFound(false);
        } catch (error) {
            console.error("Erro ao buscar personagem:", error);
            setNotFound(true);
            setCharacters([]);
        }
    };
    useEffect(() => {

        fetchCharacters(search);
    }, [search]);

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

            {notFound && <h1 className={styles.notFound}>Personagem não encontrado 🫠</h1>}
            <div className={styles.grid}>
                {character.map((char) => (
                    <CharacterCard
                        key={char.id}
                        character={char}
                        onClick={() => handleCharacterClick(char.name)}
                    />
                ))}
            </div>
        </div>
    );
}