import { motion } from "framer-motion";

const CtaSection = () => {
  return (
    <section id="download" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center space-y-8"
        >

          <h2 className="font-display text-4xl md:text-5xl font-bold">
            Start Saving on <span className="text-primary">Every Ride</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Join lakhs of smart riders across India. Use Swaft X and never overpay for a ride again.
          </p>  

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span>✓ 100% free</span>
            <span>✓ No data stored</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
