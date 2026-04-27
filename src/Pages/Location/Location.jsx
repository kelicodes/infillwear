import "./Location.css";
import { MapPin, Navigation, Phone, Globe } from "lucide-react";

const Location = () => {
  return (
    <section className="location-page section">

      <div className="container">

        {/* HERO SECTION */}
        <div className="location-hero animate-fade-up">
          <h1 className="text-display text-gradient">
            Our Physical Location
          </h1>

          <p>
            We are based in Komarok, Nairobi — right at the roundabout.
            Easy to find, easy to access, and always open for you.
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="location-grid">

          {/* LEFT INFO CARD */}
          <div className="location-card glass animate-fade-up delay-1">

            <div className="location-badge">
              <MapPin size={16} />
              Komarok, Nairobi
            </div>

            <h2>Visit Us Today</h2>

            <p>
              Our store is located at Komarok Roundabout, Nairobi.
              You can easily find us by following the main road into Komarok.
            </p>

            <div className="location-details">

              <div className="detail">
                <Navigation size={16} />
                <span>Right at Komarok Roundabout</span>
              </div>

              <div className="detail">
                <Globe size={16} />
                <span>Nairobi, Kenya</span>
              </div>

              <div className="detail">
                <Phone size={16} />
                <span>WhatsApp available for directions</span>
              </div>

            </div>

            <a
              href="https://www.google.com/maps?q=-1.264572536977348,36.90866378269982"
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary glow"
            >
              Get Directions
            </a>

          </div>

          {/* RIGHT MAP CARD */}
          <div className="map-card glass animate-fade-up delay-2">

           
<iframe src="https://www.google.com/maps/embed?pb=!4v1775956041267!6m8!1m7!1s72cSY0v3xHMyJ303H1V4AA!2m2!1d-1.264572536977348!2d36.90866378269982!3f82.4545325577274!4f2.3987774782194577!5f0.7820865974627469"
 className="map-iframe"
 loading="lazy" referrerpolicy="no-referrer-when-downgrade"  allowFullScreen/>
          </div>

        </div>

        {/* CTA SECTION */}
        <div className="location-cta glass-elevated animate-fade-up delay-3">

          <h3>Need Help Finding Us?</h3>

          <p>
            Chat with us on WhatsApp and we will guide you directly to our store.
          </p>

          <div className="cta-buttons">

            <a
              href="https://wa.me/254700000000"
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
            >
              WhatsApp Us
            </a>

            <a
              href="/collection"
              className="btn btn-secondary"
            >
              View Products
            </a>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Location;