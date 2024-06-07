import { Anime } from "../interfaces/anime.interface"

const filterDeletedAnimes = (animes: Anime[]) => {
 return animes.filter((anime: Anime) => !anime.isDeleted)
}

export default filterDeletedAnimes