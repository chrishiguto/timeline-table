import { Timeline } from "./components/timeline/timeline";
import { Waves } from "./components/ui/waves-background";
import "./globals.css";

function App() {
  return (
    <main>
      <div className="flex flex-col w-full h-full min-h-screen">
        <Waves
          backgroundColor="transparent"
          className="h-[500px]"
          waveSpeedX={0.02}
          waveSpeedY={0.01}
          waveAmpX={40}
          waveAmpY={20}
          friction={0.9}
          tension={0.01}
          maxCursorMove={120}
          xGap={12}
          yGap={36}
        />

        <div className="w-full pt-32 pb-8">
          <div className="max-w-6xl mx-auto py-10 md:py-14 text-left">
            <h1 className="text-3xl md:text-5xl font-medium tracking-tight leading-tight py-2 font-figree">
              Timeline table
              <br />
              <span>An experimental project to create a timeline table</span>
            </h1>
            <p className="text-lg text-muted-foreground font-light leading-relaxed">
              Explore events chronologically in this interactive timeline view.{" "}
              <br />
              Visualize parallel activities or track project milestones with
              customizable lanes.
            </p>
          </div>
        </div>

        <Timeline />
      </div>
    </main>
  );
}

export default App;
