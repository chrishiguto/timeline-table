# Timeline Table

I built this React timeline component with drag-and-drop, lane organization, and inline editing. It's a modern take on visualizing time-based data.

## What I like about my implementation

### Modern tech stack

I went with React + TypeScript for the solid type safety and dev experience. Tailwind CSS was awesome for quick styling. dnd-kit handles all the drag-and-drop really smoothly, and shadcn/ui components gave me that clean, accessible interface without reinventing the wheel.

### Accessibility and UX

I tried to keep accessibility in mind from stratch. I wanted interactions to feel natural and intuitive. The inline editing with keyboard support (Enter to save, Escape to cancel) works pretty well. As well as the drag and drop with the keyboard (Tab to focus the event, Enter to select and arrows to move the event, finally Enter to save) I'm also happy with how I handled events that extend beyond the visible range - the visual indicators make it clear what's happening.

### Visual design and performance

I kept the interface minimal and focused on content. The lane assignment algorithm turned out great - it efficiently prevents overlapping events and makes the timeline easy to scan. The layout adapts nicely to different screen sizes, and performance stays smooth even with lots of events.

### Architecture

I'm pretty happy with how modular everything is - each component has a clear purpose. This makes the code readable and maintainable. The whole thing is easily extensible, so adding new features should be straightforward. I spent time on smart state management to keep the UI responsive.

## What I'd change next time

### Build tooling

Parcel wasn't the best choice with Tailwind - it made development cycles slower than I'd like. Next time I'd probably use Vite or Next.js for a snappier experience.

### Feature priorities

I started building a resize feature but scrapped it because of UX concerns. In hindsight, I should've gone with a more MVP approach - launch with core features, get feedback, then iterate. Would've saved some time and maybe delivered a more user-focused experience.

### Interaction improvements

If I had more time, I'd add some subtle animations to make interactions feel more polished. More keyboard shortcuts would be nice for power users. I'd also add more customization options and improve mobile responsiveness.

### Testing

I wish I'd set up testing from the start. A good suite of unit and integration tests would have caught issues earlier. More user testing would've helped validate my UX decisions before getting too far.

## My design process

### Inspiration

Google Calendar was my main reference point. I also browsed Dribbble for visual design ideas, especially color schemes and spacing. I checked out other timelines to identify patterns users would find familiar.

### User-centered thinking

I focused on making something simple and clear that users could understand at a glance. I wanted interactions to feel natural and tried to minimize the learning curve. I made sure everything worked consistently with different types of data.

### Technical choices

I picked dnd-kit specifically for its accessibility and performance. The lane assignment algorithm was fun to design - it maximizes space while keeping things visually clean. date-fns was perfect for handling dates without bloat. I tried to make the component API intuitive for other developers.

## How I'd test with more time

### Unit and integration testing

I'd write tests for the lane assignment algorithm with various edge cases. Date calculations need thorough validation across different scenarios. I'd verify drag-and-drop behaviors and keyboard interactions work as expected.

### Performance checks

I'd test with larger datasets to find optimization opportunities. Reducing unnecessary re-renders would be a priority. Cross-browser testing and memory profiling would help catch any leaks or inefficiencies.

## Wrapping up

I'm generally happy with how this turned out - it's intuitive, accessible, and performs well. There's room for improvement in the tooling and some features, but it's a solid foundation to build on.

I still think the MVP approach is the way to go - ship core functionality, get feedback, then refine based on what users actually need.
