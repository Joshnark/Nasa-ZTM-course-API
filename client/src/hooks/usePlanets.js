import { useCallback, useEffect, useState } from "react";

import { httpGetPlanets } from "./requests";

function usePlanets() {
  const [planets, savePlanets] = useState([]);

  const getPlanets = useCallback(async () => {
    const fetchedPlanets = await httpGetPlanets();
    const planetList = fetchedPlanets.map((planet) => {
      return {
        kepler_name: planet.keplerName
      }
    })
    savePlanets(planetList);
  }, []);

  useEffect(() => {
    getPlanets();
  }, [getPlanets]);

  return planets;
}

export default usePlanets;
