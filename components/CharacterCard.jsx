import styles from "./../styles/CharacterCard.module.css";

export default function CharacterCard( {character}) {
    return (
        <div className={styles.card}>
        <img src={character.image} 
        alt={character.name}
        className={styles.avatar}
        />
            <h3 className={styles.title}>{character.name}</h3>
            <p>{character.status}</p>
            <p>{character.especies}</p>
            <p>{character.type || "Sem Tipo"}</p>
            <p>{character.gender}</p>
        </div>
    );
}