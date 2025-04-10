const jobs = [
    { company: "Google", role: "SDE Intern", appliedDate: "2025-04-01" },
    { company: "Amazon", role: "Frontend Dev", appliedDate: "2025-03-15" },
    { company: "Microsoft", role: "Backend Eng", appliedDate: "2025-04-10" }
  ];
  
  // Sort by date (newest first)
  const sortedJobs = jobs.sort((a, b) => 
    new Date(b.appliedDate) - new Date(a.appliedDate)
  );
  
  console.log(sortedJobs);