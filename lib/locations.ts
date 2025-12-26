export const INDIAN_STATES = [
    { label: "Andhra Pradesh", value: "Andhra Pradesh" },
    { label: "Arunachal Pradesh", value: "Arunachal Pradesh" },
    { label: "Assam", value: "Assam" },
    { label: "Bihar", value: "Bihar" },
    { label: "Chhattisgarh", value: "Chhattisgarh" },
    { label: "Goa", value: "Goa" },
    { label: "Gujarat", value: "Gujarat" },
    { label: "Haryana", value: "Haryana" },
    { label: "Himachal Pradesh", value: "Himachal Pradesh" },
    { label: "Jharkhand", value: "Jharkhand" },
    { label: "Karnataka", value: "Karnataka" },
    { label: "Kerala", value: "Kerala" },
    { label: "Madhya Pradesh", value: "Madhya Pradesh" },
    { label: "Maharashtra", value: "Maharashtra" },
    { label: "Manipur", value: "Manipur" },
    { label: "Meghalaya", value: "Meghalaya" },
    { label: "Mizoram", value: "Mizoram" },
    { label: "Nagaland", value: "Nagaland" },
    { label: "Odisha", value: "Odisha" },
    { label: "Punjab", value: "Punjab" },
    { label: "Rajasthan", value: "Rajasthan" },
    { label: "Sikkim", value: "Sikkim" },
    { label: "Tamil Nadu", value: "Tamil Nadu" },
    { label: "Telangana", value: "Telangana" },
    { label: "Tripura", value: "Tripura" },
    { label: "Uttar Pradesh", value: "Uttar Pradesh" },
    { label: "Uttarakhand", value: "Uttarakhand" },
    { label: "West Bengal", value: "West Bengal" },
    { label: "Delhi National Capital Territory", value: "Delhi" },
]

// Mapping for major cities (MVP)
// In a real app this would be a full JSON or API
export const CITIES_BY_STATE: Record<string, string[]> = {
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Thane", "Solapur"],
    "Karnataka": ["Bangalore", "Mysore", "Mangalore", "Hubli", "Belgaum"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
    "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Noida", "Ghaziabad", "Allahabad"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner"],
    "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"],
    // Fallback generic list if state not found or for others
    "Default": ["Other City"]
}

export const getCitiesForState = (state: string): { label: string, value: string }[] => {
    const list = CITIES_BY_STATE[state] || CITIES_BY_STATE["Default"]
    // If state isn't in our curated list but exists in generic list, we return empty or simple prompt?
    // Let's return generic list + allow custom in Combobox
    return list.map(city => ({ label: city, value: city }))
}

export const DEGREES = [
    { label: "B.Tech (Bachelor of Technology)", value: "B.Tech" },
    { label: "B.E (Bachelor of Engineering)", value: "B.E" },
    { label: "BCA (Bachelor of Computer Applications)", value: "BCA" },
    { label: "B.Sc (Bachelor of Science)", value: "B.Sc" },
    { label: "M.Tech (Master of Technology)", value: "M.Tech" },
    { label: "MCA (Master of Computer Applications)", value: "MCA" },
    { label: "MBA (Master of Business Administration)", value: "MBA" },
    { label: "Diploma", value: "Diploma" },
    { label: "High School", value: "High School" },
]

export const ROLES = [
    { label: "Frontend Developer", value: "Frontend Developer" },
    { label: "Backend Developer", value: "Backend Developer" },
    { label: "Full Stack Developer", value: "Full Stack Developer" },
    { label: "Mobile App Developer", value: "Mobile App Developer" },
    { label: "DevOps Engineer", value: "DevOps Engineer" },
    { label: "Data Scientist", value: "Data Scientist" },
    { label: "Machine Learning Engineer", value: "Machine Learning Engineer" },
    { label: "UI/UX Designer", value: "UI/UX Designer" },
    { label: "Product Manager", value: "Product Manager" },
    { label: "Student", value: "Student" },
]
