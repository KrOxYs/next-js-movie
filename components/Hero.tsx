import { fetchTrending } from "@actions/movieData";
import HeroCard from "./HeroCard";
// Assuming you have a Movie type defined

interface HeroProps {
  trendingMovies: any;
}

const Hero = ({ trendingMovies }: HeroProps) => {
  return (
    <div>
      <HeroCard trendingMovie={trendingMovies} />
    </div>
  );
};

export default Hero;
