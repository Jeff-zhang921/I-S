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
    email: "maya@campus.edu",
    password: "demo1234",
    major: "Computer Science",
    budget: "$900-$1,100",
    vibe: "Early riser, tidy, likes quiet study nights"
  },
  {
    id: "u-102",
    name: "Ethan Kim",
    email: "ethan@campus.edu",
    password: "roommate!",
    major: "Mechanical Engineering",
    budget: "$800-$1,000",
    vibe: "Gym routine, social weekends, shared cooking"
  },
  {
    id: "u-103",
    name: "Zoe Rivera",
    email: "zoe@campus.edu",
    password: "prototype1",
    major: "Business Analytics",
    budget: "$1,000-$1,250",
    vibe: "Night owl, music friendly, organized common space"
  }
];
