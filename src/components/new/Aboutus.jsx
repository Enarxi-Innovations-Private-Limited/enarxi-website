import { motion } from 'framer-motion';
import aboutUs1 from '../../assets/aboutus1.png';
import aboutUsEye from '../../assets/aboutusEye.png';
import ayazCEO from '../../assets/ayazCEO.jpg';
import syedCTO from '../../assets/syedCTO.jpg';
import mission from '@assets/aboutus/mission.png';
import vision from '@assets/aboutus/vision.png';
import innovation from '@assets/aboutus/innovation.png';
import excellence from '@assets/aboutus/excellence.png';
import collabration from '@assets/aboutus/collabration.png';
import curiosity from '@assets/aboutus/curiosity.png';
import staffsData from '../../staffs.json';
import proMen1 from '@assets/aboutus/pro-men.jpg';
import proMen2 from '@assets/aboutus/pro-men2.jpg';
import proMen3 from '@assets/aboutus/pro-men3.jpg';
import proMen4 from '@assets/aboutus/pro-men4.jpg';
import proMen5 from '@assets/aboutus/pro-men5.jpg';
import proMen6 from '@assets/aboutus/pro-men6jpg.jpg';
import proMen7 from '@assets/aboutus/pro-men-7.jpg';
import proMen8 from '@assets/aboutus/pro-men8.jpg';
import proMen9 from '@assets/aboutus/pro-men9.jpg';
import proMen10 from '@assets/aboutus/pro-men10.jpg';


export default function AboutUs() {
  // Enhanced animation variants with more interactivity
  const fadeInUp = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 }
  };

  const slideInLeft = {
    initial: { opacity: 0, x: -80 },
    animate: { opacity: 1, x: 0 }
  };

  const slideInRight = {
    initial: { opacity: 0, x: 80 },
    animate: { opacity: 1, x: 0 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const fadeInScale = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 }
  };

  const hoverScale = {
    scale: 1.05,
    transition: { type: "spring", stiffness: 300, damping: 15 }
  };

  const teamMemberVariants = {
    initial: { opacity: 0, y: 50, rotateY: -15 },
    animate: { 
      opacity: 1, 
      y: 0, 
      rotateY: 0
    }
  };

  const valueCardVariants = {
    initial: { opacity: 0, y: 60, scale: 0.8 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1
    }
  };

  // Team member images array
  const teamImages = [proMen1, proMen2, proMen3, proMen4, proMen5, proMen6, proMen7, proMen8, proMen9, proMen10];

  const values = [
    { title: "Innovation",icon: innovation, description: "We constantly push boundaries and explore new technologies to deliver cutting-edge solutions." },
    { title: "Excellence",icon: excellence, description: "Quality is at the heart of everything we do, ensuring exceptional results for our clients." },
    { title: "Collaboration",icon: collabration, description: "We believe in the power of teamwork and fostering strong partnerships." },
    { title: "Curiosity",icon: curiosity, description: "Curiosity drives our innovation. We constantly explore new technologies and methods to bring better solutions for our clients." }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-poppins">
      {/* Hero Section */}
      <section className="py-24 text-center relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/10"
        />
        <motion.h1 
          className="text-4xl md:text-6xl lg:text-7xl font-bold font-oswald mb-6 relative z-10"
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 1.2, 
            ease: "easeOut",
            type: "spring",
            stiffness: 100
          }}
          whileHover={{ scale: 1.02 }}
        >
          About Enarxi
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Innovating the Future, One Solution at a Time
        </motion.p>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: "easeOut", type: "spring", stiffness: 80 }}
            whileHover={{ x: 10 }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold font-oswald mb-8 text-primary"
              whileHover={{ scale: 1.02 }}
            >
              Our Story
            </motion.h2>
            <motion.div 
              className="text-muted-foreground leading-relaxed space-y-6 text-base md:text-lg"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <motion.p variants={fadeInUp}>
                Enarxi Innovations Pvt Ltd was established in the year 2021, but the plan for the same was from late 2017. It was founded by <strong className="text-foreground font-semibold">Mr. Syed Sameeullah</strong> and <strong className="text-foreground font-semibold">Mr. Ayaz Shaik</strong>. Two different people with two different mindsets have come together with a common passion of initiating a technology startup.
              </motion.p>
              <motion.p variants={fadeInUp}>
                The idea of starting a company is because notion between a senior and junior and the gap has never changed since their college days which is to create a environment of innovation and be the best in the field of Electronic product design Enarxi's founders are well aware and understand of technology, who knows and believes in the fact that advanced technology is indistinguishable from magic when sufficient. Enarxi's multidisciplinary approach creates a culture where we ardently convert our hopes and visions into tangible achievements.
              </motion.p>
              <motion.p variants={fadeInUp} className="text-primary font-semibold text-lg">
                Enarxi is a team of dreamers who accomplish and grow. We know no limits.
              </motion.p>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 80, scale: 0.8 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: "easeOut", type: "spring", stiffness: 80 }}
            className="flex justify-center"
            whileHover={{ scale: 1.05, rotate: 2 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-2xl"></div>
              <img 
                src={aboutUs1} 
                alt="About Enarxi Innovation" 
                className="relative max-w-full h-auto rounded-2xl shadow-2xl border border-border/50"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission and Vision Section */}
      <section className="py-20 bg-gradient-to-br from-secondary/50 to-primary/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold font-oswald text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          >
            Our Mission & Vision
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-stretch">
            {/* Mission */}
            <motion.div
              className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-xl border border-border/50 hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, x: -60, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 80 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <motion.div
                className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 mx-auto"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-8 h-8 bg-white rounded-lg">
                <img src={mission} alt='mission' className='w-8 h-8'/>
                </div>
              </motion.div>
              <motion.h3 
                className="text-2xl md:text-3xl font-bold font-oswald mb-6 text-center text-primary"
                whileHover={{ scale: 1.05 }}
              >
                Our Mission
              </motion.h3>
              <motion.p 
                className="text-base md:text-lg leading-relaxed text-center text-muted-foreground"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                To Empower Businesses Of All Sizes To Maximize Their Growth Potential And Revenue By Adapting Quickly And Increasing Customer Loyalty Through Innovative Technology Solutions.
              </motion.p>
            </motion.div>

            {/* Vision */}
            <motion.div
              className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-xl border border-border/50 hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 80, delay: 0.2 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <motion.div
                className="w-16 h-16 bg-secondary/20 rounded-2xl flex items-center justify-center mb-6 mx-auto"
                whileHover={{ rotate: -360 }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-8 h-8 bg-secondary rounded-lg">
                  <img src={vision} alt='vision' className='w-8 h-8'/>
                </div>
              </motion.div>
              <motion.h3 
                className="text-2xl md:text-3xl font-bold font-oswald mb-6 text-center text-secondary-foreground"
                whileHover={{ scale: 1.05 }}
              >
                Our Vision
              </motion.h3>
              <motion.p 
                className="text-base md:text-lg leading-relaxed text-center text-muted-foreground"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                To Be The Leading Technology Partner That Transforms Ideas Into Revolutionary Products, Creating A World Where Innovation Knows No Boundaries.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}

      {/* Our Leadership Team Section */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <motion.h2 
          className="text-3xl md:text-4xl lg:text-5xl font-bold font-oswald text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.02 }}
        >
          Our Leadership Team
        </motion.h2>
        
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-2 gap-16 justify-center max-w-4xl mx-auto"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {/* Ayaz Shaik - CEO */}
          <motion.div
            className="text-center group"
            initial={{ opacity: 0, y: 50, rotateY: -15 }}
            whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 12 }}
            whileHover={{ scale: 1.05, y: -10 }}
          >
            <motion.div 
              className="relative mb-8 mx-auto w-fit"
              whileHover={{ rotate: 5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-300"></div>
              <img 
                src={ayazCEO} 
                alt="Mr. Ayaz Shaik - CEO & Founder" 
                className="relative w-56 h-56 md:w-64 md:h-64 object-cover rounded-3xl shadow-2xl border-4 border-background transition-all duration-300 group-hover:border-primary/50"
              />
            </motion.div>
            <motion.h3 
              className="text-xl md:text-2xl font-bold font-oswald mb-3 text-primary"
              whileHover={{ scale: 1.1 }}
            >
              Mr. Ayaz Shaik
            </motion.h3>
            <motion.p 
              className="text-muted-foreground text-lg font-medium"
              whileHover={{ color: "hsl(var(--primary))" }}
            >
              CEO & Founder
            </motion.p>
          </motion.div>

          {/* Syed - CTO */}
          <motion.div
            className="text-center group"
            initial={{ opacity: 0, y: 50, rotateY: -15 }}
            whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.2 }}
            whileHover={{ scale: 1.05, y: -10 }}
          >
            <motion.div 
              className="relative mb-8 mx-auto w-fit"
              whileHover={{ rotate: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-secondary/30 to-primary/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-300"></div>
              <img 
                src={syedCTO} 
                alt="Mr. Syed - CTO & Founder" 
                className="relative w-56 h-56 md:w-64 md:h-64 object-cover rounded-3xl shadow-2xl border-4 border-background transition-all duration-300 group-hover:border-secondary/50"
              />
            </motion.div>
            <motion.h3 
              className="text-xl md:text-2xl font-bold font-oswald mb-3 text-secondary-foreground"
              whileHover={{ scale: 1.1 }}
            >
              Mr. Syed Sameeullah
            </motion.h3>
            <motion.p 
              className="text-muted-foreground text-lg font-medium"
              whileHover={{ color: "hsl(var(--secondary-foreground))" }}
            >
              CTO & Founder
            </motion.p>
          </motion.div>
        </motion.div>
      </section>

      {/* Our Team Section */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto bg-gradient-to-br from-secondary/30 to-primary/5">
        <motion.h2 
          className="text-3xl md:text-4xl lg:text-5xl font-bold font-oswald text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.02 }}
        >
          Our Team
        </motion.h2>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {staffsData.staffs.map((staff, index) => (
            <motion.div
              key={index}
              className="text-center group"
              initial={{ opacity: 0, y: 50, rotateY: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ 
                type: "spring", 
                stiffness: 100, 
                damping: 12,
                delay: index * 0.1 
              }}
              whileHover={{ scale: 1.05, y: -10 }}
            >
              <motion.div 
                className="relative mb-6 mx-auto w-fit"
                whileHover={{ rotate: index % 2 === 0 ? 5 : -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <img 
                  src={teamImages[index % teamImages.length]} 
                  alt={`${staff.name} - ${staff.designation}`} 
                  className="relative w-40 h-40 md:w-48 md:h-48 object-cover rounded-3xl shadow-xl border-4 border-background transition-all duration-300 group-hover:border-primary/50"
                />
              </motion.div>
              <motion.h3 
                className="text-lg md:text-xl font-bold font-oswald mb-2 text-primary capitalize"
                whileHover={{ scale: 1.08 }}
              >
                {staff.name}
              </motion.h3>
              <motion.p 
                className="text-muted-foreground text-sm md:text-base font-medium capitalize"
                whileHover={{ color: "hsl(var(--primary))" }}
              >
                {staff.designation}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <motion.h2 
          className="text-3xl md:text-4xl lg:text-5xl font-bold font-oswald text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.02 }}
        >
          Our Values
        </motion.h2>
        
        <motion.div 
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {values.map((value, index) => (
            <motion.div
              key={index}
              className="relative text-center group bg-card/50 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-border/50 hover:shadow-2xl transition-all duration-300 overflow-hidden"
              initial={{ opacity: 0, y: 60, scale: 0.8, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ 
                type: "spring", 
                stiffness: 150, 
                damping: 20,
                delay: index * 0.15
              }}
              whileHover={{ 
                scale: 1.08, 
                y: -15,
                rotateY: 5,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
              }}
            >
              {/* Animated background gradient on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                initial={{ scale: 0, rotate: 0 }}
                whileHover={{ scale: 1.5, rotate: 180 }}
                transition={{ duration: 0.8 }}
              />
              
              <div className="relative z-10">
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl mx-auto mb-6 flex items-center justify-center group-hover:from-primary/40 group-hover:to-secondary/40 transition-all duration-300"
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: index * 0.2
                  }}
                  whileHover={{ 
                    rotate: 360, 
                    scale: 1.15,
                    boxShadow: "0 0 30px rgba(var(--primary), 0.5)"
                  }}
                >
                  <motion.img 
                    src={`${value.icon}`} 
                    alt={`${value.title} icon`} 
                    className="w-12 h-12 rounded-2xl"
                    whileHover={{ scale: 1.1 }}
                  />
                </motion.div>
                
                <motion.h3 
                  className="text-xl md:text-2xl font-bold font-oswald mb-4 text-primary group-hover:text-secondary-foreground transition-colors duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {value.title}
                </motion.h3>
                
                <motion.p 
                  className="text-muted-foreground text-sm md:text-base leading-relaxed"
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {value.description}
                </motion.p>
              </div>
              
              {/* Animated border effect */}
              <motion.div
                className="absolute inset-0 rounded-3xl border-2 border-primary/0 group-hover:border-primary/50"
                initial={{ scale: 0.95, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};
