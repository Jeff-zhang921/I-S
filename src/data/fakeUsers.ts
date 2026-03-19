export type FakeUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  major: string;
  budget: string;
  vibe: string;
};

export const fakeUsers: FakeUser[] = [
  {
    id: "u-101",
    name: "Maya Patel",
    email: "maya@bristol.ac.uk",
    password: "demo1234",
    major: "Computer Science",
    budget: "GBP900-GBP1,100",
    vibe: "Early riser, tidy, likes quiet study nights"
  },
  {
    id: "u-102",
    name: "Ethan Kim",
    email: "ethan@bristol.ac.uk",
    password: "roommate!",
    major: "Mechanical Engineering",
    budget: "GBP800-GBP1,000",
    vibe: "Gym routine, social weekends, shared cooking"
  },
  {
    id: "u-103",
    name: "Zoe Rivera",
    email: "zoe@bristol.ac.uk",
    password: "prototype1",
    major: "Business Analytics",
    budget: "GBP1,000-GBP1,250",
    vibe: "Night owl, music friendly, organized common space"
  },
  {
    id: "u-104",
    name: "Leila Hassan",
    email: "leila@bristol.ac.uk",
    password: "budgetstay",
    major: "Law",
    budget: "GBP780-GBP950",
    vibe: "Budget-conscious, direct communicator, likes predictable routines"
  },
  {
    id: "u-105",
    name: "Samir Ali",
    email: "samir@bristol.ac.uk",
    password: "private88",
    major: "Medicine",
    budget: "GBP1,050-GBP1,250",
    vibe: "Quiet, privacy-focused, prefers clear guest rules"
  },
  {
    id: "u-106",
    name: "Tara O'Neill",
    email: "tara@bristol.ac.uk",
    password: "prototype2",
    major: "Environmental Science",
    budget: "GBP950-GBP1,150",
    vibe: "Cyclist, tidy kitchen habits, likes bright shared spaces"
  },
  {
    id: "u-107",
    name: "Ben Morris",
    email: "ben@bristol.ac.uk",
    password: "prototype3",
    major: "History",
    budget: "GBP850-GBP1,050",
    vibe: "Flexible, friendly, enjoys movie nights without a loud flat"
  },
  {
    id: "u-108",
    name: "Nia Campbell",
    email: "nia@bristol.ac.uk",
    password: "prototype4",
    major: "Psychology",
    budget: "GBP980-GBP1,180",
    vibe: "Morning routine, clean shared bathroom, likes calm Sundays"
  }
];
