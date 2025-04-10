"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import CharacterCard from "../../components/CharacterCard";
import styles from "./Home.module.css";

export default function Home() {
    const [character, setCharacters] = useState([]);

    useEffect(() => {
        axios.get("https://rickandmortyapi.com/api/character")
            .then((response) => {
                setCharacters(response.data.results);
            })
            .catch((error) => {
                console.error("Erro ao buscar personagem:", error); 
            });
            }, []); //faz a requisição 1 vez só / p fzr mais de uma vez bota uma variavel
    return (

        <div className={styles.container}>
            <div className={styles.grid}>
            {character.map((char) => (
                <CharacterCard key={char.id} character={char} />
            ))}
            </div>

        </div>
    );
}