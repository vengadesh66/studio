// In a real app, you would import your static images like this:
// import mercury from '../../public/images/mercury.png';
// import venus from '../../public/images/venus.png';
// etc.

// For now, we are using placeholder URLs.

interface PlanetImage {
    src: string; // This would be of type StaticImageData in a real app
    hint: string;
}

export const planetImages: Record<string, PlanetImage> = {
    mercury: { src: 'https://picsum.photos/seed/mercury/250/250', hint: 'planet mercury' },
    venus: { src: 'https://picsum.photos/seed/venus/250/250', hint: 'planet venus' },
    earth: { src: 'https://picsum.photos/seed/earth/250/250', hint: 'planet earth' },
    mars: { src: 'https://picsum.photos/seed/mars/250/250', hint: 'planet mars' },
    jupiter: { src: 'https://picsum.photos/seed/jupiter/250/250', hint: 'planet jupiter' },
    saturn: { src: 'https://picsum.photos/seed/saturn/250/250', hint: 'planet saturn' },
    uranus: { src: 'https://picsum.photos/seed/uranus/250/250', hint: 'planet uranus' },
    neptune: { src: 'https://picsum.photos/seed/neptune/250/250', hint: 'planet neptune' },
    default: { src: 'https://picsum.photos/seed/planet/250/250', hint: 'cartoon planet' },
};
