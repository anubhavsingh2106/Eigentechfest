"use client";

import { FadeImage } from "@/components/fade-image";

const features = [
  {
    title: "Hackathon",
    description: "Innovation",
    image: "/images/d18fe616-5596-4559-90f5-a90f5397d0d8.png",
  },
  {
    title: "Squid Games",
    description: "Performance",
    image: "/images/e26fa9c3-966d-4966-94a4-954a1e511c1c.png",
  },
  {
    title: "Byte Break",
    description: "Durability",
    image: "/images/car.jpg",
  },
  {
    title: "DJ Night",
    description: "Navigation",
    image: "/images/204cee22-9e85-49e8-9303-1d309af626b0.png",
  },
  {
    title: "Botanical Bid",
    description: "Visibility",
    image: "/images/led-flashlight-bottle.png",
  },
  {
    title: "Latent",
    description: "Comfort",
    image: "/images/heating-campfire.png",
  },
];

export function FeaturedProductsSection() {
  return (
    <section id="technology" className="bg-background">
      {/* Section Title */}
      <div className="px-6 py-20 text-center md:px-12 md:py-28 lg:px-20 lg:py-32 lg:pb-20">
        <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl lg:text-5xl">
          Our Events
        </h2>
        <p className="mx-auto mt-6 max-w-md text-sm text-muted-foreground">
          Events
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 gap-4 px-6 pb-20 md:grid-cols-3 md:px-12 lg:px-20">
        {features.map((feature) => (
          <div key={feature.title} className="group">
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <FadeImage
                src={feature.image || "/placeholder.svg"}
                alt={feature.title}
                fill
                className="object-cover group-hover:scale-105"
              />
            </div>

            {/* Content */}
            <div className="py-6">
              <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
                {feature.description}
              </p>
              <h3 className="text-foreground text-xl font-semibold">
                {feature.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Link */}
      <div className="flex justify-center px-6 pb-28 md:px-12 lg:px-20">
        
      </div>
    </section>
  );
}
