const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Yin yoga poses database with curated poses suitable for 30-minute routines
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
      name: "Butterfly Pose",
      sanskrit: "Baddha Konasana",
      duration: 4,
      category: "hip_opener",
      description: "A gentle hip opener that targets the inner thighs and hip flexors while promoting introspection.",
      instructions: "Sit with soles of feet together, knees wide. Hold feet and gently fold forward, keeping spine long.",
      benefits: ["Opens hips and inner thighs", "Stimulates abdominal organs", "Calms the mind"],
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop&auto=format"
    },
    {
      name: "Pigeon Pose",
      sanskrit: "Eka Pada Rajakapotasana",
      duration: 5,
      category: "hip_opener",
      description: "Deep hip opener that releases tension in the hip flexors and can bring up emotional releases.",
      instructions: "From table top, bring right knee behind right wrist, extend left leg back. Fold forward over front leg.",
      benefits: ["Deep hip flexor stretch", "Opens the sacrum", "Releases stored emotions"],
      image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&h=300&fit=crop&auto=format"
    },
    {
      name: "Dragon Pose",
      sanskrit: "Low Lunge",
      duration: 4,
      category: "hip_opener",
      description: "Active hip opener that targets the hip flexors and strengthens the legs.",
      instructions: "From downward dog, step right foot between hands. Lower back knee down, sink hips forward.",
      benefits: ["Stretches hip flexors", "Strengthens legs", "Improves hip mobility"],
      image: "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400&h=300&fit=crop&auto=format"
    }
  ],
  
  forwardFolds: [
    {
      name: "Child's Pose",
      sanskrit: "Balasana",
      duration: 4,
      category: "forward_fold",
      description: "Restorative pose that provides a sense of safety and introspection while gently stretching the back.",
      instructions: "Kneel with big toes touching, knees apart. Sit back on heels and fold forward, arms extended or by sides.",
      benefits: ["Calms the nervous system", "Stretches back and shoulders", "Promotes introspection"],
      image: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=400&h=300&fit=crop&auto=format"
    },
    {
      name: "Seated Forward Fold",
      sanskrit: "Paschimottanasana",
      duration: 5,
      category: "forward_fold",
      description: "Deep forward fold that stretches the entire back body and promotes inner reflection.",
      instructions: "Sit with legs extended, hinge at hips to fold forward. Rest hands on legs or floor, keep spine long.",
      benefits: ["Stretches hamstrings and spine", "Calms the mind", "Improves digestion"],
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format"
    },
    {
      name: "Wide-Legged Forward Fold",
      sanskrit: "Upavistha Konasana",
      duration: 4,
      category: "forward_fold",
      description: "Gentle forward fold with wide legs that opens the inner thighs and back body.",
      instructions: "Sit with legs wide, hands behind hips. Slowly walk hands forward, keeping spine long.",
      benefits: ["Stretches inner thighs", "Opens the back body", "Promotes surrender"],
      image: "https://images.unsplash.com/photo-1593810450967-f9c42742e326?w=400&h=300&fit=crop&auto=format"
    }
  ],
  
  backbends: [
    {
      name: "Supported Fish Pose",
      sanskrit: "Matsyasana",
      duration: 5,
      category: "backbend",
      description: "Passive heart opener that counteracts forward fold postures and opens the chest.",
      instructions: "Lie back over a bolster or pillow placed under shoulder blades. Let arms fall open to sides.",
      benefits: ["Opens heart and chest", "Counteracts forward folding", "Promotes emotional opening"],
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop&auto=format"
    },
    {
      name: "Camel Pose",
      sanskrit: "Ustrasana",
      duration: 3,
      category: "backbend",
      description: "Heart opening backbend that builds courage and opens the front body.",
      instructions: "Kneel with shins parallel, place hands on lower back. Slowly arch back, opening chest to sky.",
      benefits: ["Opens chest and heart", "Strengthens back", "Builds confidence"],
      image: "https://images.unsplash.com/photo-1506629905645-b178db688c10?w=400&h=300&fit=crop&auto=format"
    }
  ],
  
  twists: [
    {
      name: "Supine Spinal Twist",
      sanskrit: "Supta Matsyendrasana",
      duration: 4,
      category: "twist",
      description: "Gentle twist that wrings out the spine and promotes detoxification.",
      instructions: "Lie on back, bring right knee to chest, cross over to left side. Extend arms in T-shape.",
      benefits: ["Wrings out the spine", "Aids digestion", "Releases lower back tension"],
      image: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=300&fit=crop&auto=format"
    },
    {
      name: "Seated Spinal Twist",
      sanskrit: "Bharadvajasana",
      duration: 3,
      category: "twist",
      description: "Seated twist that promotes spinal mobility and internal organ massage.",
      instructions: "Sit with legs extended, bend right knee and place foot outside left thigh. Twist right.",
      benefits: ["Increases spinal mobility", "Massages internal organs", "Improves posture"],
      image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&h=300&fit=crop&auto=format"
    }
  ],
  
  restorative: [
    {
      name: "Legs Up the Wall",
      sanskrit: "Viparita Karani",
      duration: 5,
      category: "restorative",
      description: "Deeply restorative inversion that calms the nervous system and promotes circulation.",
      instructions: "Lie near a wall, scoot hips close and extend legs up the wall. Rest arms by sides.",
      benefits: ["Calms nervous system", "Improves circulation", "Reduces swelling in legs"],
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop&auto=format"
    },
    {
      name: "Savasana",
      sanskrit: "Savasana",
      duration: 5,
      category: "restorative",
      description: "Final relaxation pose that integrates the practice and promotes deep rest.",
      instructions: "Lie flat on back with arms and legs comfortably apart. Close eyes and breathe naturally.",
      benefits: ["Integrates the practice", "Promotes deep relaxation", "Calms the mind"],
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&auto=format"
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