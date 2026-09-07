import Navbar from "./components/layout/Navbar";

import Hero from "./sections/Hero";
import Problem from "./sections/Problem";
import Solution from "./sections/Solution";
import Includes from "./sections/Includes";
import Services from "./sections/Services";
import Team from "./sections/Team";
import Contact from "./sections/Contact";

function App() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Problem />
        <Solution />
        <Includes />
        <Services />
        <Team />
        <Contact />
      </main>
    </>
  );
}

export default App;