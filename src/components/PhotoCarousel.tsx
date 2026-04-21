import { useEffect, useState } from "react";
import { RoomPhoto } from "../types";

type PhotoCarouselProps = {
  photos: RoomPhoto[];
  title: string;
};

function PhotoCarousel({ photos, title }: PhotoCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [title]);

  if (!photos.length) {
    return null;
  }

  const activePhoto = photos[activeIndex] ?? photos[0];

  function move(direction: "previous" | "next") {
    setActiveIndex((current) => {
      if (direction === "previous") {
        return current === 0 ? photos.length - 1 : current - 1;
      }

      return current === photos.length - 1 ? 0 : current + 1;
    });
  }

  return (
    <section className="summary-panel detail-carousel-panel">
      <div className="panel-headline">
        <div>
          <p className="panel-kicker">House photos</p>
          <h2>{title}</h2>
        </div>
        <div className="carousel-controls">
          <button type="button" className="secondary-button carousel-button" onClick={() => move("previous")}>
            Previous
          </button>
          <button type="button" className="secondary-button carousel-button" onClick={() => move("next")}>
            Next
          </button>
        </div>
      </div>

      <figure className="detail-carousel-figure">
        <img className="detail-hero-image" src={activePhoto.src} alt={activePhoto.alt} loading="lazy" />
        <figcaption className="listing-subcopy">
          Photo {activeIndex + 1} of {photos.length}
        </figcaption>
      </figure>

      <div className="detail-gallery detail-gallery-thumbnails" role="tablist" aria-label={`${title} photo gallery`}>
        {photos.map((photo, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={photo.alt}
              type="button"
              className={isActive ? "detail-gallery-thumb active" : "detail-gallery-thumb"}
              onClick={() => setActiveIndex(index)}
              role="tab"
              aria-selected={isActive}
              aria-label={`Show photo ${index + 1}`}
            >
              <img className="detail-gallery-image" src={photo.src} alt={photo.alt} loading="lazy" />
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default PhotoCarousel;
