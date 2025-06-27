const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Enhanced Yin yoga poses database with professional content from "The Complete Guide to Yin Yoga"
const yinYogaPoses = {
  opening: [
    {
      name: "Centering Breath",
      sanskrit: "Pranayama",
      duration: 3,
      category: "breathing",
      description: "Begin your practice with mindful breathing to center yourself and prepare for the session.",
      instructions: "Sit comfortably with your spine straight. Close your eyes and take slow, deep breaths. Count 4 counts in, hold for 4, exhale for 6.",
      benefits: ["Calms the nervous system", "Increases focus", "Prepares the mind for practice"],
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&auto=format"
    }
  ],

  hipOpeners: [
    {
      name: "Dragon",
      sanskrit: "Dragon",
      duration: 5,
      category: "hip_opener",
      description: "Deep hip opener targeting quadriceps and hip flexors of the back leg, hip socket of the front leg.",
      instructions: "Begin on hands and knees or in Down Dog. Step one foot between hands. Walk front foot forward until knee is over heel. Slide back knee backward as far as comfortable.",
      benefits: ["Stretches hip flexors and quadriceps", "Opens hip sockets", "Improves hip mobility"],
      image: "assets/images/fig3-20.png",
      contraindications: ["Can be uncomfortable for the kneecap or ankle - use padding or support as needed", "Pregnant women may wish to avoid or not go so low due to sacroiliac joint stress"]
    },
    {
      name: "Frog",
      sanskrit: "Frog",
      duration: 5,
      category: "hip_opener",
      description: "Deep hip opener targeting the inner groin and hip sockets.",
      instructions: "Start in Child's Pose and slide hands forward, separate knees while remaining sitting on heels.",
      benefits: ["Opens inner groin and adductors", "Increases hip flexibility", "May provide spinal extension"],
      image: "assets/images/fig3-23.png",
      contraindications: ["If you have back issues, compression may be too much", "Use knee padding if knees complain"]
    },
    {
      name: "Butterfly",
      sanskrit: "Butterfly",
      duration: 4,
      category: "hip_opener",
      description: "Gentle hip opener that opens the groin and inner thighs.",
      instructions: "Sit with soles of feet together, hold feet and gently fold forward from hips.",
      benefits: ["Opens hips and inner thighs", "Stimulates abdominal organs", "Calms the mind"],
      image: "assets/images/fig3-6.png"
    },
    {
      name: "Half-Butterfly",
      sanskrit: "Half-Butterfly",
      duration: 4,
      category: "hip_opener",
      description: "Asymmetrical pose targeting one side at a time for focused hip opening.",
      instructions: "Sit with one leg straight, other foot drawn into inner thigh. Fold forward over straight leg.",
      benefits: ["Focused hip opening", "Hamstring stretch", "Spinal mobility"],
      image: "assets/images/fig3-7.png"
    },
    {
      name: "Square",
      sanskrit: "Square",
      duration: 5,
      category: "hip_opener",
      description: "Intense hip opener working both hips simultaneously.",
      instructions: "Sit with both knees bent at 90 degrees, shins parallel. Fold forward maintaining square shape.",
      benefits: ["Deep hip opening", "External rotation", "Prepares for lotus variations"],
      image: "assets/images/fig3-39.png"
    }
  ],

  forwardFolds: [
    {
      name: "Child's Pose",
      sanskrit: "Child's Pose",
      duration: 4,
      category: "forward_fold",
      description: "Restorative pose providing safety and introspection while gently stretching the back.",
      instructions: "Kneel with big toes together, knees apart. Sit back and fold forward with arms extended.",
      benefits: ["Calms nervous system", "Stretches back and shoulders", "Promotes introspection"],
      image: "assets/images/fig3-13.png"
    },
    {
      name: "Caterpillar",
      sanskrit: "Caterpillar",
      duration: 5,
      category: "forward_fold",
      description: "Deep forward fold stretching the entire back body and hamstrings.",
      instructions: "Sit with legs extended, fold forward from hips allowing spine to round naturally.",
      benefits: ["Stretches spine and hamstrings", "Calms the mind", "Improves digestion"],
      image: "assets/images/fig3-12.png"
    },
    {
      name: "Dangling",
      sanskrit: "Dangling",
      duration: 4,
      category: "forward_fold",
      description: "Standing forward fold providing spinal traction and hamstring stretch.",
      instructions: "Stand with feet apart, bend knees slightly and fold forward. Clasp elbows or rest on knees.",
      benefits: ["Spinal traction", "Hamstring stretch", "Calms nervous system"],
      image: "assets/images/fig3-17.png"
    },
    {
      name: "Snail",
      sanskrit: "Snail",
      duration: 4,
      category: "forward_fold",
      description: "Inverted forward fold providing deep spinal flexion.",
      instructions: "Lie on back, lift legs overhead and support with hands on lower back.",
      benefits: ["Deep spinal flexion", "Neck and shoulder stretch", "Introspective pose"],
      image: "assets/images/fig3-34.png"
    },
    {
      name: "Anahatasana",
      sanskrit: "Anahatasana",
      duration: 4,
      category: "forward_fold",
      description: "Heart melting pose targeting middle and upper back extension.",
      instructions: "From hands and knees, walk hands forward allowing chest to drop toward floor. Keep hips over knees.",
      benefits: ["Opens middle and upper back", "Heart opening qualities", "Shoulder mobility"],
      image: "assets/images/fig3-1.png",
      contraindications: ["Take care with neck positioning to avoid strain", "Watch for tingling in hands - adjust arm position if needed"]
    }
  ],

  backbends: [
    {
      name: "Bridge",
      sanskrit: "Bridge",
      duration: 3,
      category: "backbend",
      description: "Gentle backbend opening the chest and strengthening the back body.",
      instructions: "Lie on back with knees bent, lift hips up creating arch through spine.",
      benefits: ["Opens chest and heart", "Strengthens glutes and back", "Energizing pose"],
      image: "assets/images/fig3-5.png"
    },
    {
      name: "Sphinx and Seal",
      sanskrit: "Sphinx and Seal",
      duration: 4,
      category: "backbend",
      description: "Progressive backbends working from gentle to deeper spinal extension.",
      instructions: "Lie prone, prop up on forearms for Sphinx, then straighten arms for Seal if comfortable.",
      benefits: ["Spinal extension", "Strengthens back muscles", "Opens chest"],
      image: "assets/images/fig3-35.png"
    }
  ],

  twists: [
    {
      name: "Reclining Twists",
      sanskrit: "Reclining Twists",
      duration: 4,
      category: "twist",
      description: "Gentle supine twist wringing out the spine and promoting detoxification.",
      instructions: "Lie on back, bring knees to chest then drop to one side. Extend arms in T-shape.",
      benefits: ["Wrings out spine", "Aids digestion", "Releases lower back tension"],
      image: "assets/images/fig3-31.png"
    },
    {
      name: "Cat Pulling Its Tail",
      sanskrit: "Cat Pulling Its Tail",
      duration: 4,
      category: "twist",
      description: "Asymmetrical twist combining hip opening with spinal rotation.",
      instructions: "Lie on side, bend top knee and reach back to hold foot, creating twist through spine.",
      benefits: ["Spinal rotation", "Hip flexor stretch", "Side body opening"],
      image: "assets/images/fig3-11.png"
    }
  ],

  restorative: [
    {
      name: "Happy Baby",
      sanskrit: "Happy Baby",
      duration: 4,
      category: "restorative",
      description: "Playful restorative pose that opens hips and releases lower back tension.",
      instructions: "Lie on back, draw knees to chest, grab outside edges of feet and gently rock side to side.",
      benefits: ["Hip opening", "Lower back release", "Calming and grounding"],
      image: "assets/images/fig3-24.png"
    },
    {
      name: "Savasana",
      sanskrit: "Savasana",
      duration: 5,
      category: "restorative",
      description: "Final relaxation pose that integrates the practice and promotes deep rest.",
      instructions: "Lie flat on back with arms and legs comfortably apart. Close eyes and breathe naturally.",
      benefits: ["Integrates the practice", "Promotes deep relaxation", "Calms the mind"],
      image: "assets/images/fig3-48.png"
    }
  ]
};

// Routine generation algorithm
function generateDailyRoutine() {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  
  // Use day of year as seed for consistent daily routines
  const seed = dayOfYear;
  
  // Seeded random number generator for consistency
  function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }
  
  const routine = {
    date: today.toISOString().split('T')[0],
    title: "Today's Yin Yoga Journey",
    totalDuration: 30,
    poses: [],
    theme: getThemeForDay(seed)
  };
  
  let currentTime = 0;
  let poseIndex = 0;
  
  // Always start with opening
  const opening = yinYogaPoses.opening[0];
  routine.poses.push({
    ...opening,
    order: ++poseIndex,
    startTime: currentTime
  });
  currentTime += opening.duration;
  
  // Select main poses (aim for 20-22 minutes total)
  const categories = ['hipOpeners', 'forwardFolds', 'backbends', 'twists'];
  const targetMainTime = 20;
  
  while (currentTime < targetMainTime + 3) { // +3 for opening
    const categoryIndex = Math.floor(seededRandom(seed + poseIndex) * categories.length);
    const category = categories[categoryIndex];
    const categoryPoses = yinYogaPoses[category];
    
    if (categoryPoses.length > 0) {
      const poseIndex2 = Math.floor(seededRandom(seed + poseIndex + 100) * categoryPoses.length);
      const selectedPose = categoryPoses[poseIndex2];
      
      // Adjust duration if needed to fit remaining time
      const remainingTime = (targetMainTime + 3) - currentTime;
      const adjustedDuration = Math.min(selectedPose.duration, remainingTime);
      
      if (adjustedDuration >= 3) { // Minimum pose duration
        routine.poses.push({
          ...selectedPose,
          duration: adjustedDuration,
          order: ++poseIndex,
          startTime: currentTime
        });
        currentTime += adjustedDuration;
      } else {
        break;
      }
    }
  }
  
  // Always end with Savasana
  const savasana = yinYogaPoses.restorative[1]; // Savasana
  routine.poses.push({
    ...savasana,
    order: ++poseIndex,
    startTime: currentTime
  });
  
  routine.actualDuration = currentTime + savasana.duration;
  routine.poseCount = routine.poses.length;
  
  return routine;
}

function getThemeForDay(seed) {
  const themes = [
    "Opening to Peace",
    "Releasing Tension",
    "Heart Opening Journey",
    "Grounding Practice",
    "Inner Strength",
    "Gentle Flexibility",
    "Mindful Presence"
  ];
  
  const themeIndex = Math.floor((seed / 7) % themes.length);
  return themes[themeIndex];
}

// Generate and save routine
async function generateAndSaveRoutine() {
  try {
    console.log('Generating daily yin yoga routine...');
    
    const routine = generateDailyRoutine();
    
    // Create data directory if it doesn't exist
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Save routine as JSON
    const routineFile = path.join(dataDir, 'daily-routine.json');
    fs.writeFileSync(routineFile, JSON.stringify(routine, null, 2));
    
    // Update last generated timestamp
    const metaFile = path.join(dataDir, 'meta.json');
    const meta = {
      lastGenerated: new Date().toISOString(),
      version: '1.0.0'
    };
    fs.writeFileSync(metaFile, JSON.stringify(meta, null, 2));
    
    console.log(`✅ Generated routine for ${routine.date}:`);
    console.log(`   Theme: ${routine.theme}`);
    console.log(`   Duration: ${routine.actualDuration} minutes`);
    console.log(`   Poses: ${routine.poseCount}`);
    console.log(`   Saved to: ${routineFile}`);
    
    return routine;
    
  } catch (error) {
    console.error('❌ Error generating routine:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  generateAndSaveRoutine()
    .then(() => {
      console.log('🧘‍♀️ Daily routine generation complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed to generate routine:', error);
      process.exit(1);
    });
}

module.exports = {
  generateDailyRoutine,
  generateAndSaveRoutine,
  yinYogaPoses
};