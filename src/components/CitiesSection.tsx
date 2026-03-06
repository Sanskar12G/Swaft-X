import { motion } from "framer-motion";
import cityBanner from "@/assets/city-banner.png";

const cities = [
  "Bengaluru", "Mumbai", "Delhi", "Hyderabad", "Chennai", "Pune", "Kolkata",
  "Jaipur", "Ahmedabad", "Lucknow", "Chandigarh", "Kochi",
];

const CitiesSection = () => {
  return (
    <section id="cities" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <img
          src={cityBanner}
          alt="Indian cities network"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background" />
      </div>

      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Available Across <span className="text-primary">India</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Wherever you ride, Swaft X has you covered.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto"
        >
          {cities.map((city, i) => (
            <motion.span
              key={city}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="px-5 py-2.5 rounded-full glass text-sm font-medium text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all cursor-default"
            >
              {city}
            </motion.span>
          ))}
          <span className="px-5 py-2.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-semibold">
            + 40 more cities
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default CitiesSection;
