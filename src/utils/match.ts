export function matchScore(mentee: any, mentor: any) {
  const menteeSkills = new Set((mentee.skills || []).map((s: string) => s.toLowerCase()))
  const mentorSkills = new Set((mentor.skills || []).map((s: string) => s.toLowerCase()))
  const shared = [...menteeSkills].filter(s => mentorSkills.has(s)).length
  const skillOverlap = (menteeSkills.size ? (shared / menteeSkills.size) : 0) * 100 * 0.5

  const locationScore = (mentee.location?.county && mentor.location?.county && mentee.location.county === mentor.location.county) ? 100 * 0.2 : 50 * 0.2

  const experienceScore = Math.min((mentor.yearsExperience || 0) / 10, 1) * 100 * 0.3

  return Math.round(skillOverlap + locationScore + experienceScore)
}
